import Evaluatie from "../objectModel/evaluatie.js";
import Competentie from "../objectModel/competentie.js";
import Rubriek from "../objectModel/rubriek.js";
import { sequelize } from "../dbConnection.js";

const createEvaluatie = async (req, res, next) => {
  const { type_evaluatie, feedback_docent, feedback_student, feedback_mentor, stage_id } =
    req.body;

  try {
    const nieuweEvaluatie = await Evaluatie.create({
      type_evaluatie,
      feedback_docent,
      feedback_student,
      feedback_mentor,
      stage_id,
    });

    return res.status(200).json({
      msg: "Evaluatie created successfully",
      data: nieuweEvaluatie,
    });
  } catch (error) {
    console.error("Error creating evaluatie: ", error);
    return res.status(500).json({
      msg: "Something went wrong while creating evaluatie",
    });
  }
};

/**
 * GET: status + bestaande evaluaties voor (stage_id, type_evaluatie)
 *
 * Response (frontend gebruikt enkel: bestaat + evaluaties[]):
 * {
 *   bestaat: boolean,
 *   evaluaties: [{ competentie_code, competentie_id, score, feedback_docent, feedback_student, feedback_mentor, rubriek_id, type_evaluatie, datum_evaluatie }]
 * }
 */
const getEvaluatieStatus = async (req, res, next) => {
  try {
    const { stage_id, type_evaluatie } = req.query;

    if (!stage_id || !type_evaluatie) {
      return res.status(400).json({ msg: "stage_id en type_evaluatie zijn verplicht" });
    }

    const evaluaties = await Evaluatie.findAll({
      where: { stage_id: Number(stage_id), type_evaluatie },
    });

    const bestaat = evaluaties.length > 0;

    // We linken per competentie_code via Competentie.code.
    // (Evaluatie bevat competentie_id, Competentie bevat code/titel)
    const competentieIds = Array.from(new Set(evaluaties.map((e) => e.competentie_id).filter(Boolean)));
    const competenties = competentieIds.length
      ? await Competentie.findAll({ where: { competentie_id: competentieIds } })
      : [];

    const byId = Object.fromEntries(competenties.map((c) => [c.competentie_id, c]));

    const evaluatiesMapped = evaluaties.map((e) => {
      const c = e.competentie_id ? byId[e.competentie_id] : null;
      return {
        evaluatie_id: e.evaluatie_id,
        type_evaluatie: e.type_evaluatie,
        stage_id: e.stage_id,
        competentie_id: e.competentie_id,
        competentie_code: c?.code ?? null,
        rubriek_id: e.rubriek_id,
        datum_evaluatie: e.datum_evaluatie,
        feedback_docent: e.feedback_docent ?? '',
        feedback_student: e.feedback_student ?? '',
        feedback_mentor: e.feedback_mentor ?? '',
        score_docent: e.score_docent ?? null,
        score_student: e.score_student ?? null,
        score_mentor: e.score_mentor ?? null,
      };
    });


    // Vul score via rubriek als rubriek_id gezet is.
    const rubriekIds = Array.from(new Set(evaluatiesMapped.map((e) => e.rubriek_id).filter(Boolean)));
    const rubrieken = rubriekIds.length ? await Rubriek.findAll({ where: { rubriek_id: rubriekIds } }) : [];
    const rubriekById = Object.fromEntries(rubrieken.map((r) => [r.rubriek_id, r]));

    const evaluatiesFinal = evaluatiesMapped.map((e) => ({
      ...e,
      // Voor docentpagina gebruiken we score_docent als bron.
      // (score_docent werd weggeschreven bij opslaan en is veiliger dan enkel rubriek_id.)
      score: e.score_docent ?? (e.rubriek_id ? rubriekById[e.rubriek_id]?.score ?? null : null),
    }));


    return res.status(200).json({ bestaat, evaluaties: evaluatiesFinal });
  } catch (error) {
    console.error("Error getEvaluatieStatus: ", error);
    return res.status(500).json({ msg: "Something went wrong while fetching evaluatie status" });
  }
};

/**
 * POST: maak evaluatie records per competentie voor gegeven stage/type
 * Body: { stage_id: number, type_evaluatie: 'tussentijds'|'finale' }
 */
const createEvaluatiesPerCompetentie = async (req, res, next) => {
  try {
    const { stage_id, type_evaluatie } = req.body;

    if (!stage_id || !type_evaluatie) {
      return res.status(400).json({ msg: "stage_id en type_evaluatie zijn verplicht" });
    }

    // HUIDIGE competenties: in dit project lijkt er geen stage-naar-competenties relatie.
    // Dus we nemen alle Competenties.
    // (Als er later een stageCompetentie mapping komt, vervangen we dit.)
    const competenties = await Competentie.findAll();

    // We voorkomen dubbele records: enkel aanmaken als nog niet bestaat
    const bestaande = await Evaluatie.findAll({
      where: { stage_id: Number(stage_id), type_evaluatie, competentie_id: competenties.map((c) => c.competentie_id) },
    });

    const bestaandeKey = new Set(bestaande.map((e) => String(e.competentie_id)));

    const t = await sequelize.transaction();
    try {
      const created = [];

      // Voor rubriek_id: standaard setten we niet (want score wordt pas later gekozen).
      // UI kan rubriek_id pas nodig hebben als je score opslaat.
      // We zetten rubriek_id null.

      for (const c of competenties) {
        if (bestaandeKey.has(String(c.competentie_id))) continue;

        const nieuw = await Evaluatie.create(
          {
            type_evaluatie,
            stage_id: Number(stage_id),
            competentie_id: c.competentie_id,
            rubriek_id: null,
            datum_evaluatie: new Date(),
            feedback_docent: null,
            feedback_student: null,
            feedback_mentor: null,
          },
          { transaction: t }
        );

        created.push(nieuw);
      }

      await t.commit();

      return res.status(201).json({
        msg: "Evaluaties per competentie aangemaakt",
        createdCount: created.length,
        data: created,
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } catch (error) {
    console.error("Error createEvaluatiesPerCompetentie: ", error);
    return res.status(500).json({ msg: "Something went wrong while creating evaluaties" });
  }
};

/**
 * PUT: update evaluatie per competentie voor een stage (rubriek/score/feedback)
 * Body:
 * {
 *   stage_id: number,
 *   type_evaluatie: 'tussentijds'|'finale',
 *   updates: [{
 *     competentie_code: string,
 *     score: number,              // (docent score)
 *     feedback: string,          // (docent feedback)
 *     score_student?: number,    // (student score)
 *     score_mentor?: number      // (mentor score)
 *   }]
 * }
 */
const updateEvaluatiesPerCompetentie = async (req, res, next) => {
  try {
    const stageIdFromParam = req.params.stageId;
    const { stage_id, type_evaluatie, updates } = req.body;

    const stageId = stageIdFromParam ?? stage_id;

    if (!stageId || !type_evaluatie || !Array.isArray(updates)) {
      return res.status(400).json({ msg: "stage_id/type_evaluatie/updates zijn verplicht" });
    }

    // Vertaling: competentie_code -> competentie_id
    const uniqueCompetentieCodes = Array.from(
      new Set(updates.map((u) => u?.competentie_code).filter(Boolean))
    );

    const competenties = uniqueCompetentieCodes.length
      ? await Competentie.findAll({ where: { code: uniqueCompetentieCodes } })
      : [];

    const competentieByCode = Object.fromEntries(
      competenties.map((c) => [c.code, c])
    );

    // Alleen docent-score heeft een rubriek-mapping nodig.
    const uniqueDocentScores = Array.from(
      new Set(
        updates
          .map((u) => u?.score)
          .filter((s) => s !== null && s !== undefined)
      )
    );

    // We hebben rubrieken nodig om score -> rubriek_id te mappen.
    const competentieIds = competenties.map((c) => c.competentie_id);

    const rubrieken = (competentieIds.length && uniqueDocentScores.length)
      ? await Rubriek.findAll({
          where: {
            competentie_id: competentieIds,
            score: uniqueDocentScores,
          },
        })
      : [];

    const rubriekIndex = new Map();
    for (const r of rubrieken) {
      rubriekIndex.set(`${r.competentie_id}:${r.score}`, r);
    }

    const t = await sequelize.transaction();
    try {
      const results = [];

      for (const u of updates) {
        const compCode = u?.competentie_code;
        const docentScore = u?.score;
        const docentFeedback = u?.feedback ?? null;
        const feedback_student = u?.feedback_student ?? null;
        const feedback_mentor = u?.feedback_mentor ?? null;
        const score_student = u?.score_student ?? null;
        const score_mentor = u?.score_mentor ?? null;

        const comp = compCode ? competentieByCode[compCode] : null;
        if (!comp) continue;

        const rubriek =
          docentScore !== null && docentScore !== undefined
            ? rubriekIndex.get(`${comp.competentie_id}:${docentScore}`)
            : null;

        let evaluatie = await Evaluatie.findOne({
          where: {
            stage_id: Number(stageId),
            type_evaluatie,
            competentie_id: comp.competentie_id,
          },
          transaction: t,
        });

        let created = false;
        if (!evaluatie) {
          evaluatie = await Evaluatie.create({
            stage_id: Number(stageId),
            type_evaluatie,
            competentie_id: comp.competentie_id,
            rubriek_id: rubriek?.rubriek_id ?? null,
            datum_evaluatie: new Date(),
            feedback_docent: docentFeedback,
            score_docent: docentScore ?? null,
            feedback_student,
            score_student,
            feedback_mentor,
            score_mentor,
          }, { transaction: t });
          created = true;
        } else {
          const updatesToApply = { datum_evaluatie: new Date() };
          if (docentScore != null) {
            updatesToApply.score_docent = docentScore;
            updatesToApply.rubriek_id = rubriek?.rubriek_id ?? null;
          }
          if (docentFeedback != null) updatesToApply.feedback_docent = docentFeedback;
          if (score_student != null) updatesToApply.score_student = score_student;
          if (feedback_student != null) updatesToApply.feedback_student = feedback_student;
          if (score_mentor != null) updatesToApply.score_mentor = score_mentor;
          if (feedback_mentor != null) updatesToApply.feedback_mentor = feedback_mentor;
          await evaluatie.update(updatesToApply, { transaction: t });
        }

        results.push({
          competentie_code: compCode,
          competentie_id: comp.competentie_id,
          rubriek_id: rubriek?.rubriek_id ?? null,
          score: docentScore ?? rubriek?.score ?? null,
          score_student,
          score_mentor,
          updated: !created,
        });
      }

      // Bereken totaalpercentage (out of 100) op basis van aantal competenties:
      // normalizedPerCompetentie = (score/5)*100
      // total = (sum(normalizedPerCompetentie)) / N
      const competentiesVoorBerekening = results
        .map((r) => r.competentie_id)
        .filter((id) => id !== null && id !== undefined);

      const uniekeCompetentieIds = Array.from(new Set(competentiesVoorBerekening));
      const N = uniekeCompetentieIds.length;

      let totalPercentage = null;
      if (N > 0) {
        const sumScores = results.reduce((acc, r) => {
          if (r.score === null || r.score === undefined) return acc;
          return acc + (Number(r.score) / 5) * 100;
        }, 0);

        totalPercentage = sumScores / N;

        // Rond af voor nette display
        totalPercentage = Math.round(totalPercentage * 10) / 10;
      }

      await t.commit();
      return res.status(200).json({ msg: "Evaluaties geüpdatet", results, totalPercentage });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } catch (error) {
    console.error("Error updateEvaluatiesPerCompetentie: ", error);
    return res.status(500).json({ msg: "Something went wrong while updating evaluaties" });
  }
};

export default {
  createEvaluatie,
  getEvaluatieStatus,
  createEvaluatiesPerCompetentie,
  updateEvaluatiesPerCompetentie,
};




