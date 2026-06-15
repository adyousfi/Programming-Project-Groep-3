import Stage from "../objectModel/stage.js";
import StageDocument from "../objectModel/stageDocument.js";
import Stagementor from "../userModel/stagementor.js";
import { sequelize } from "../dbConnection.js";
import Student from "../userModel/student.js";
import User from "../userModel/user.js";
import Bedrijf from "../objectModel/bedrijf.js";
import Docent from "../userModel/docent.js";

const createStage = async (req, res, next) => {
  try {
    const {
      studentNaam, studentNummer,
      bedrijfNaam, bedrijfAdres,
      mentorNaam, mentorEmail,
      opdrachtOmschrijving,
      periodeStart, periodeEind
    } = req.body;

    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

    const studentProfile = await Student.findByPk(cookieUser.user_id);
    if (!studentProfile) return res.status(400).json({ msg: 'Geen studentprofiel gevonden' });
    const student_id = studentProfile.user_id;

    // Delete old stages and their documents so admin always sees only the latest
    const oldStages = await Stage.findAll({ where: { student_id } });
    for (const old of oldStages) {
      await StageDocument.destroy({ where: { stage_id: old.stage_id } });
      await old.destroy();
    }

    const bedrijf = await Bedrijf.create({ naam: bedrijfNaam, address: bedrijfAdres });

    const mentorUser = await User.create({
      first_name: mentorNaam,
      last_name: '',
      email: mentorEmail,
      password: 'pending',
      role: 'stagementor',
      phone: 'no phone'
    });
    await Stagementor.create({ user_id: mentorUser.user_id, bedrijf_id: bedrijf.bedrijf_id });

    const stage = await Stage.create({
      student_id,
      stagementor_id: mentorUser.user_id,
      bedrijf_id: bedrijf.bedrijf_id,
      omschrijving_opdracht: opdrachtOmschrijving,
      status: 'AANVRAAG',
      begin_datum: periodeStart,
      eind_datum: periodeEind
    });

    return res.status(201).json({ msg: 'Stage succesvol aangemaakt', data: stage });
  } catch (error) {
    console.error('Error creating stage:', error.message || error);
    if (error.errors) {
      error.errors.forEach(e => console.error('  Validation:', e.message));
    }
    return res.status(500).json({ msg: 'Er is iets misgegaan: ' + (error.message || 'Onbekende fout') });
  }
};

const updateStage = async (req, res, next) => {
  try {
    const { status, feedback, bedrijfNaam, bedrijfAdres, mentorNaam, mentorEmail, omschrijving_opdracht, begin_datum, eind_datum } = req.body;

    const stage = await Stage.findByPk(req.params.id, {
      include: [
        { model: Bedrijf, as: 'bedrijf' },
        { model: Stagementor, as: 'mentor' },
      ]
    });

    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

    const updateData = {};
    if (status) updateData.status = status;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (omschrijving_opdracht !== undefined) updateData.omschrijving_opdracht = omschrijving_opdracht;
    if (begin_datum !== undefined) updateData.begin_datum = begin_datum;
    if (eind_datum !== undefined) updateData.eind_datum = eind_datum;

    await stage.update(updateData);

    if (bedrijfNaam && stage.bedrijf) {
      await stage.bedrijf.update({ naam: bedrijfNaam, address: bedrijfAdres || stage.bedrijf.address });
    }
    if (mentorNaam && stage.mentor) {
      const mentorUser = await User.findByPk(stage.mentor.user_id);
      if (mentorUser) await mentorUser.update({ first_name: mentorNaam });
    }
    if (mentorEmail && stage.mentor) {
      const mentorUser = await User.findByPk(stage.mentor.user_id);
      if (mentorUser) await mentorUser.update({ email: mentorEmail });
    }

    return res.json({ msg: 'Stage succesvol bijgewerkt', data: stage });
  } catch (error) {
    console.error('Error updating stage:', error);
    return res.status(500).json({ msg: 'Fout bij bijwerken van stage' });
  }
}; 

const selectStage = async (req, res, next) => {
    try {
    const stages = await Stage.findAll({
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
        { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
      ]
    });

    const result = stages.map(s => {
      const studentUser = s.student ? s.student.User : null;
      const mentorUser = s.mentor ? s.mentor.User : null;
      const docentUser = s.docent ? s.docent.User : null;

      return {
        id: s.stage_id,
        naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '',
        studentEmail: studentUser ? studentUser.email : '',
        functie: '',
        bedrijf: {
          naam: s.bedrijf ? s.bedrijf.naam : '',
          adres: s.bedrijf ? s.bedrijf.address : '',
          contactpersoon: '',
          email: '',
          telefoon: '',
        },
        stagementor: {
          naam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '',
          email: mentorUser ? mentorUser.email : '',
          telefoon: mentorUser ? mentorUser.phone : '',
        },
        docent: {
          naam: docentUser ? `${docentUser.first_name} ${docentUser.last_name}` : '',
          email: docentUser ? docentUser.email : '',
          user_id: s.docent_id || null,
        },
        stageDetails: {
          omschrijving: s.omschrijving_opdracht || '',
          start: s.begin_datum || '',
          einde: s.eind_datum || '',
          urenPerWeek: '',
        },
        status: s.status?.toLowerCase() === 'aanvraag' ? 'in_afwachting'
          : s.status?.toLowerCase() === 'goedgekeurd' ? 'goedgekeurd'
          : s.status?.toLowerCase() === 'afgekeurd' ? 'afgekeurd'
          : s.status?.toLowerCase() === 'aanpassingenvereisd' ? 'aanpassingen'
          : s.status,
        datum: s.createdAt ? new Date(s.createdAt).toLocaleDateString('nl-BE') : '',
        historiek: null,
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('Error fetching stages:', error);
    return res.status(500).json({ msg: 'Fout bij ophalen van stages' });
  }
};

//GET GOEDKEURDE STAGES
const getApprovedStages = async (req, res, next) => {try {
    const stages = await Stage.findAll({
      where: { status: 'GOEDGEKEURD' },
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
      ],
    });
    return res.json(stages.map(s => ({
      id: s.stage_id,
      naam: s.student?.User ? `${s.student.User.last_name.toUpperCase()} ${s.student.User.first_name}` : 'Onbekend',
      bedrijf: s.bedrijf?.naam || '',
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen stages' });
  }
};

//SELECT STAGE BY ID
const selectStageById = async (req, res, next) => {
    try {
    const stage = await Stage.findByPk(req.params.id, {
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
        { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
      ]
    });

    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

    const studentUser = stage.student ? stage.student.User : null;
    const mentorUser = stage.mentor ? stage.mentor.User : null;
    const docentUser = stage.docent ? stage.docent.User : null;

    return res.json({
      id: stage.stage_id,
      naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '',
      studentEmail: studentUser ? studentUser.email : '',
      functie: '',
      bedrijf: {
        naam: stage.bedrijf ? stage.bedrijf.naam : '',
        adres: stage.bedrijf ? stage.bedrijf.address : '',
      },
      stagementor: {
        naam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '',
        email: mentorUser ? mentorUser.email : '',
      },
      docent: {
        naam: docentUser ? `${docentUser.first_name} ${docentUser.last_name}` : '',
        email: docentUser ? docentUser.email : '',
        user_id: stage.docent_id || null,
      },
      stageDetails: {
        omschrijving: stage.omschrijving_opdracht || '',
        start: stage.begin_datum || '',
        einde: stage.eind_datum || '',
      },
      status: stage.status?.toLowerCase() === 'aanvraag' ? 'in_afwachting'
        : stage.status?.toLowerCase() === 'goedgekeurd' ? 'goedgekeurd'
        : stage.status?.toLowerCase() === 'afgekeurd' ? 'afgekeurd'
        : stage.status?.toLowerCase() === 'aanpassingenvereisd' ? 'aanpassingen'
        : stage.status,
      rawStatus: stage.status,
      datum: stage.createdAt ? new Date(stage.createdAt).toLocaleDateString('nl-BE') : '',
      feedback: stage.feedback || null,
    });
  } catch (error) {
    console.error('Error fetching stage:', error);
    return res.status(500).json({ msg: 'Fout bij ophalen van stage' });
  }
};

//GET STAGE BY STUDENT ID
const selectStageByStudentId = async (req, res, next) => {
    try {
        const stage = await Stage.findOne({
          where: { student_id: req.params.studentId },
          include: [
            { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
            { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
            { model: Bedrijf, as: 'bedrijf' },
            { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
          ],
          order: [['createdAt', 'DESC']]
        });
    
        if (!stage) return res.json({ found: false });
    
        const studentUser = stage.student ? stage.student.User : null;
        const mentorUser = stage.mentor ? stage.mentor.User : null;
        const docentUser = stage.docent ? stage.docent.User : null;
    
        return res.json({
          found: true,
          id: stage.stage_id,
          naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '',
          studentEmail: studentUser ? studentUser.email : '',
          studentNummer: stage.student ? stage.student.studentnummer : '',
          bedrijf: {
            naam: stage.bedrijf ? stage.bedrijf.naam : '',
            adres: stage.bedrijf ? stage.bedrijf.address : '',
          },
          stagementor: {
            naam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '',
            email: mentorUser ? mentorUser.email : '',
          },
          docent: {
            naam: docentUser ? `Prof. ${docentUser.first_name} ${docentUser.last_name}` : '',
          },
          stageDetails: {
            omschrijving: stage.omschrijving_opdracht || '',
            start: stage.begin_datum || '',
            einde: stage.eind_datum || '',
          },
          status: stage.status?.toLowerCase() === 'aanvraag' ? 'in_afwachting'
            : stage.status?.toLowerCase() === 'goedgekeurd' ? 'goedgekeurd'
            : stage.status?.toLowerCase() === 'afgekeurd' ? 'afgekeurd'
            : stage.status?.toLowerCase() === 'aanpassingenvereisd' ? 'aanpassingen'
            : stage.status,
          rawStatus: stage.status,
          datum: stage.createdAt ? new Date(stage.createdAt).toLocaleDateString('nl-BE') : '',
          feedback: stage.feedback || null,
          document_validated: stage.document_validated || false,
        });
      } catch (error) {
        console.error('Error fetching student stage:', error);
        return res.status(500).json({ msg: 'Fout bij ophalen van stage' });
      }
    };
// Raw select for internal usage (e.g. koppeldocent page)
const selectStageRaw = async (req, res, next) => {
    try {
        const stages = await Stage.findAll({
          include: [
            { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
            { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
            { model: Bedrijf, as: 'bedrijf' },
            { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
          ]
        });
        return res.status(200).json({
            msg: "Stages selected successfully",
            data: stages
        });
    } catch (error) {
        console.error("Error selecting stages: ", error);
        return res.status(500).json({
            msg: "something went wrong while selecting stages"
        });
    }
};

// Raw update for internal usage (e.g. koppeldocent page)
const updateStageRaw = async (req, res, next) => {
    try {
        const { stage_id, student_id, docent_id, stagementor_id, bedrijf_id } = req.body;

        await Stage.update(
            { student_id, docent_id, stagementor_id, bedrijf_id },
            { where: { stage_id: stage_id } }
        );

        return res.status(200).json({
            msg: "Stage updated successfully"
        });
    } catch (error) {
        console.error("Error updating stage: ", error);
        return res.status(500).json({
            msg: "something went wrong while updating stage"
        });
    }
};

export default { createStage, updateStage, selectStage, getApprovedStages, selectStageByStudentId, selectStageById, selectStageRaw, updateStageRaw };
