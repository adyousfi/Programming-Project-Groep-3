import Competentie from "../objectModel/competentie.js";
import Rubriek from "../objectModel/rubriek.js";
import Behaaldescore from "../objectModel/behaaldeScore.js";
import { sequelize } from "../dbConnection.js";

const createCompetentie  = async(req,res,next) =>{
    const{
        code,
        title,
        omschrijving,
        gewicht
    } = req.body
    try{
        const competentie = await Competentie.create({
            code: code,
            titel: title,
            omschrijving: omschrijving,
            gewicht_percentage: gewicht
        })


        return res.status(200).json({
            msg: "Competentie created successfully",
            data: competentie
        })
    }
    catch(error){
        console.error("Error creating competentie: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating competentie"
        });
    }

}

const getAllCompetenties = async (req, res, next) => {
  try {
    const competenties = await Competentie.findAll();
    return res.status(200).json({
      msg: 'Competenties opgehaald',
      data: competenties,
    });
  } catch (error) {
    console.error('Error fetching competenties:', error);
    return res.status(500).json({ msg: 'something went wrong while fetching competenties' });
  }
};

const updateCompetentie = async (req, res, next) => {
  const { competentie_id } = req.params;
  const { code, title, omschrijving, gewicht } = req.body;

    console.log('[updateCompetentie] competentie_id:', competentie_id);
  console.log('[updateCompetentie] req.body:', req.body);

  try {
    console.log('[updateCompetentie] update payload:', { code, titel: title, omschrijving, gewicht_percentage: gewicht });

const competentie = await Competentie.findByPk(competentie_id);
    if (!competentie) return res.status(404).json({ msg: 'Competentie niet gevonden' });

    await competentie.update({
      code,
      titel: title,
      omschrijving,
      gewicht_percentage: gewicht,
    });


    return res.status(200).json({ msg: 'Competentie bijgewerkt', data: competentie });
  } catch (error) {
    console.error('Error updating competentie:', error);
    return res.status(500).json({
      msg: 'something went wrong while updating competentie',
      debug: error?.message ?? String(error),
      name: error?.name,
      stack: error?.stack,
    });
  }
};

const createCompetentieMetRubrieken = async (req, res, next) => {
  const { code, title, omschrijving, gewicht, rubrieken } = req.body;

  if (!code || !title || !omschrijving || gewicht === undefined) {
    return res.status(400).json({ msg: 'code, title, omschrijving en gewicht zijn verplicht' });
  }

  // Default 5 rubrieken
  const defaultRubrieken = [
    { score: 1, beschrijving: 'Rubriek 1' },
    { score: 2, beschrijving: 'Rubriek 2' },
    { score: 3, beschrijving: 'Rubriek 3' },
    { score: 4, beschrijving: 'Rubriek 4' },
    { score: 5, beschrijving: 'Rubriek 5' },
  ];


  const toCreate = Array.isArray(rubrieken) && rubrieken.length ? rubrieken : defaultRubrieken;

  const t = await sequelize.transaction();
  try {
    const competentie = await Competentie.create(
      {
        code,
        titel: title,
        omschrijving,
        gewicht_percentage: gewicht,
      },
      { transaction: t }
    );

    // Maak rubrieken met competentie_id
    const Rubriek = (await import('../objectModel/rubriek.js')).default;

    const createdRubrieken = await Promise.all(
      toCreate.map((r) =>
        Rubriek.create(
          {
            competentie_id: competentie.competentie_id,
            score: Number(r.score),
            beschrijving: r.beschrijving ?? r.titel ?? r.omschrijving ?? '',
          },
          { transaction: t }
        )
      )
    );

    await t.commit();

    return res.status(200).json({
      msg: 'Competentie aangemaakt met rubrieken',
      data: { competentie, rubrieken: createdRubrieken },
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating competentie with rubrieken:', error);
    return res.status(500).json({
      msg: 'something went wrong while creating competentie',
      debug: error?.message ?? String(error),
    });
  }
};

const deleteCompetentie = async (req, res, next) => {
  const { competentie_id } = req.params;

  try {
    const competentie = await Competentie.findByPk(competentie_id);
    if (!competentie) {
      return res.status(404).json({ msg: 'Competentie niet gevonden' });
    }

    const rubrieken = await Rubriek.findAll({ where: { competentie_id } });
    const rubriekIds = rubrieken.map(r => r.rubriek_id);

    if (rubriekIds.length > 0) {
      await Behaaldescore.destroy({ where: { rubriek_id: rubriekIds } });
    }
    await Behaaldescore.destroy({ where: { competentie_id } });

    await competentie.destroy();

    return res.status(200).json({ msg: 'Competentie verwijderd' });
  } catch (error) {
    console.error('Error deleting competentie:', error);
    return res.status(500).json({ msg: 'Verwijderen mislukt', debug: error?.message ?? String(error) });
  }
};

const getAllCompetentiesMetRubrieken = async (req, res, next) => {
  try {
    const competenties = await Competentie.findAll({
      include: [{
        model: Rubriek,
        as: 'Rubrieks',
        attributes: ['rubriek_id', 'competentie_id', 'code', 'score', 'beschrijving'],
      }],
      order: [['competentie_id', 'ASC']],
    });
    return res.status(200).json({
      msg: 'Competenties met rubrieken opgehaald',
      data: competenties,
    });
  } catch (error) {
    console.error('Error fetching competenties with rubrieken:', error);
    return res.status(500).json({ msg: 'Something went wrong while fetching competenties with rubrieken' });
  }
};

export default { createCompetentie, getAllCompetenties, getAllCompetentiesMetRubrieken, updateCompetentie, createCompetentieMetRubrieken, deleteCompetentie };

