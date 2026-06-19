import Logboek from "../objectModel/logboek.js";
import Stage from "../objectModel/stage.js";
import { sequelize } from "../dbConnection.js";

const getLogboekByStage = async (req, res, next) => {
    try {
        const cookieUser = req.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const stage = await Stage.findByPk(req.params.stageId);
        if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

        if (cookieUser.role === 'docent') {
            if (String(cookieUser.user_id) !== String(stage.docent_id)) {
                return res.status(403).json({ msg: 'Geen toegang tot dit logboek' });
            }
        } else if (cookieUser.role === 'student') {
            if (String(cookieUser.user_id) !== String(stage.student_id)) {
                return res.status(403).json({ msg: 'Geen toegang tot dit logboek' });
            }
        } else if (cookieUser.role === 'stagementor') {
            if (String(cookieUser.user_id) !== String(stage.stagementor_id)) {
                return res.status(403).json({ msg: 'Geen toegang tot dit logboek' });
            }
        } else {
            return res.status(403).json({ msg: 'Geen toegang' });
        }

        const entries = await Logboek.findAll({
            where: { stage_id: req.params.stageId },
            order: [['datum', 'ASC']],
        });
        return res.json(entries);
    } catch (err) {
        console.error('Error fetching logboek:', err);
        return res.status(500).json({ msg: 'Fout bij ophalen logboek' });
    }
};

const getLogboekById = async (req, res, next) => {
    try {
        const cookieUser = req.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const logboek = await Logboek.findByPk(req.params.logboek_id);
        if (!logboek) return res.status(404).json({ msg: 'Logboek niet gevonden' });

        const stage = await Stage.findByPk(logboek.stage_id);
        if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

        if (cookieUser.role !== 'docent' || String(cookieUser.user_id) !== String(stage.docent_id)) {
            return res.status(403).json({ msg: 'Geen toegang tot dit logboek' });
        }

        return res.json({
            logboek_id: logboek.logboek_id,
            stage_id: logboek.stage_id,
            datum: logboek.datum,
            uitgevoerdeTaken: logboek.uitgevoerdeTaken,
            reflectie: logboek.reflectie,
            leerpunten: logboek.leerpunten,
            status: logboek.status,
            checkmark: logboek.checkmark,
            gevinkt_door_stagementor: logboek.gevinkt_door_stagementor,
        });
    } catch (err) {
        console.error('Error fetching logboek by id:', err);
        return res.status(500).json({ msg: 'Fout bij ophalen logboek' });
    }
};

const upsertLogboek = async (req, res, next) => {
    try {
        const cookieUser = req.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const { stage_id, datum, uitgevoerdeTaken, reflectie, leerpunten, status } = req.body;
        // Debug info bij 500s
        // console.log('[upsertLogboek] payload:', req.body);
        if (!stage_id || !datum) return res.status(400).json({ msg: 'stage_id en datum zijn verplicht' });

        // MSSQL + Sequelize kan falen bij `DATE(datum) = 'YYYY-MM-DD'`.
        // Daarom parsen we de datum naar een echte Date en matchen we op die waarde.
        // Verwacht: `datum` wordt door de frontend als `YYYY-MM-DD` gestuurd.
        const parsedDatum = new Date(`${datum}T00:00:00.000Z`);
        if (Number.isNaN(parsedDatum.getTime())) {
            return res.status(400).json({ msg: 'Ongeldige datum' });
        }

        const existing = await Logboek.findOne({
            where: {
                stage_id,
                datum: parsedDatum,
            },
        });

        if (existing) {
            await existing.update({ uitgevoerdeTaken, reflectie, leerpunten, status: status || existing.status });
            return res.json({ msg: 'Logboek bijgewerkt', data: existing });
        } else {
            const entry = await Logboek.create({
                stage_id,
                datum,
                uitgevoerdeTaken,
                reflectie,
                leerpunten,
                status: status || 'DEELSINGEVULD',
                checkmark: false,
            });
            return res.status(201).json({ msg: 'Logboek aangemaakt', data: entry });
        }
    } catch (err) {
        console.error('Error saving logboek:', err);
        return res.status(500).json({ msg: 'Fout bij opslaan logboek' });
    }
};

const submitWeek = async (req, res, next) => {
    try {
        const cookieUser = req.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const { stage_id, weekStart, weekEnd } = req.body;
        if (!stage_id || !weekStart || !weekEnd) return res.status(400).json({ msg: 'stage_id, weekStart en weekEnd zijn verplicht' });

        // weekStart/weekEnd komen vanuit de frontend als `YYYY-MM-DD`.
        // Door MSSQL `DATE(datum)`-vergelijkingen kan dit soms falen.
        // Daarom parsen we naar echte Date-objecten en gebruiken we een range.
        const parsedWeekStart = new Date(`${weekStart}T00:00:00.000Z`);
        const parsedWeekEnd = new Date(`${weekEnd}T23:59:59.999Z`);
        if (Number.isNaN(parsedWeekStart.getTime()) || Number.isNaN(parsedWeekEnd.getTime())) {
            return res.status(400).json({ msg: 'Ongeldige weekStart/weekEnd' });
        }

        const [updated] = await Logboek.update(
            { status: 'INGEVULD' },
            {
                where: {
                    stage_id,
                    status: { [Logboek.sequelize.Sequelize.Op.ne]: 'NIETINGEVULD' },
                    datum: {
                        [Logboek.sequelize.Sequelize.Op.gte]: parsedWeekStart,
                        [Logboek.sequelize.Sequelize.Op.lte]: parsedWeekEnd,
                    },
                },
            }
        );

        return res.json({ msg: 'Week ingediend', updatedCount: updated });
    } catch (err) {
        console.error('Error submitting week:', err);
        return res.status(500).json({ msg: 'Fout bij indienen week' });
    }
};

const createLogboek = async (req, res, next) => {
    const {
        stage_id,
        uitgevoerdeTaken,
        datum,
        leerpunten,
        checkmark,
        reflectie,
        status
    } = req.body;
    try {
        const logboek = await Logboek.create({
            stage_id: stage_id,
            uitgevoerdeTaken: uitgevoerdeTaken,
            datum: datum,
            leerpunten: leerpunten,
            checkmark: checkmark,
            reflectie: reflectie,
            status: status
        });
        return res.status(200).json({
            msg: "Logboek created successfully",
            data: logboek
        });
    } catch (error) {
        console.error("Error creating logboek: ", error);
        return res.status(500).json({
            msg: "something went wrong while creating logboek"
        });
    }
};

const afvinkWeekDoorStudent = async (req, res, next) => {
    try {
        const cookieUser = req.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
        if (cookieUser.role !== 'student' && cookieUser.role !== 'stagementor') {
            return res.status(403).json({ msg: 'Geen toegang' });
        }

        const { stage_id, weekStart, weekEnd } = req.body;
        if (!stage_id || !weekStart || !weekEnd) return res.status(400).json({ msg: 'stage_id, weekStart en weekEnd zijn verplicht' });

        const stage = await Stage.findByPk(stage_id);
        if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });
        if (cookieUser.role === 'student' && String(cookieUser.user_id) !== String(stage.student_id)) {
            return res.status(403).json({ msg: 'Geen toegang tot dit logboek' });
        }
        if (cookieUser.role === 'stagementor' && String(cookieUser.user_id) !== String(stage.stagementor_id)) {
            return res.status(403).json({ msg: 'Geen toegang tot dit logboek' });
        }

        const entries = await Logboek.findAll({
            where: {
                stage_id,
                [Logboek.sequelize.Sequelize.Op.and]: [
                    Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), { [Logboek.sequelize.Sequelize.Op.gte]: weekStart }),
                    Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), { [Logboek.sequelize.Sequelize.Op.lte]: weekEnd }),
                ],
            },
        });

        if (entries.length === 0) return res.status(404).json({ msg: 'Geen logboek entries gevonden voor deze week' });

        const allIngevuld = entries.every(e => e.status === 'INGEVULD');
        if (!allIngevuld) return res.status(400).json({ msg: 'Niet alle dagen zijn ingevuld' });

        const alreadyAfgevinkt = entries.every(e => e.gevinkt_door_stagementor);
        if (alreadyAfgevinkt) return res.status(400).json({ msg: 'Week is al afgevinkt door student' });

        await Logboek.update(
            { gevinkt_door_stagementor: true },
            {
                where: {
                    stage_id,
                    [Logboek.sequelize.Sequelize.Op.and]: [
                        Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), { [Logboek.sequelize.Sequelize.Op.gte]: weekStart }),
                        Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), { [Logboek.sequelize.Sequelize.Op.lte]: weekEnd }),
                    ],
                },
            }
        );

        return res.json({ msg: 'Week afgevinkt door student', updatedCount: entries.length });
    } catch (err) {
        console.error('Error afvinken week door student:', err);
        return res.status(500).json({ msg: 'Fout bij afvinken week' });
    }
};

const assignOpmerkingToLogboek = async (req, res, next) => {
    const {
        stage_id,
        opmerkinglogboek_id
    } = req.body;

    try {
        const ulogboek = await Logboek.update(
            {
                opmerkinglogboek_id: opmerkinglogboek_id,
            },
            {
                where: { stage_id: stage_id }
            }
        );
        return res.status(200).json({
            msg: "Logboek updated successfully",
            data: ulogboek
        });
    } catch (error) {
        console.error("Error updating logboek: ", error);
        return res.status(500).json({
            msg: "something went wrong while updating logboek"
        });
    }
};

export default { getLogboekByStage, getLogboekById, upsertLogboek, submitWeek, afvinkWeekDoorStudent, createLogboek, assignOpmerkingToLogboek };
