import Logboek from "../objectModel/logboek.js";
import { sequelize } from "../dbConnection.js";

const getLogboekByStage = async (req, res, next) => {
    try {
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

const upsertLogboek = async (req, res, next) => {
    try {
        const cookieUser = req.cookies.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const { stage_id, datum, uitgevoerdeTaken, reflectie, leerpunten, status } = req.body;
        if (!stage_id || !datum) return res.status(400).json({ msg: 'stage_id en datum zijn verplicht' });

        const existing = await Logboek.findOne({
            where: {
                stage_id,
                [Logboek.sequelize.Sequelize.Op.and]: [
                    Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), datum)
                ]
            }
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
        const cookieUser = req.cookies.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const { stage_id, weekStart, weekEnd } = req.body;
        if (!stage_id || !weekStart || !weekEnd) return res.status(400).json({ msg: 'stage_id, weekStart en weekEnd zijn verplicht' });

        const [updated] = await Logboek.update(
            { status: 'INGEVULD' },
            {
                where: {
                    stage_id,
                    [Logboek.sequelize.Sequelize.Op.and]: [
                        Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), { [Logboek.sequelize.Sequelize.Op.gte]: weekStart }),
                        Logboek.sequelize.where(Logboek.sequelize.fn('DATE', Logboek.sequelize.col('datum')), { [Logboek.sequelize.Sequelize.Op.lte]: weekEnd }),
                    ],
                    status: { [Logboek.sequelize.Sequelize.Op.ne]: 'NIETINGEVULD' },
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

export default { getLogboekByStage, upsertLogboek, submitWeek, createLogboek, assignOpmerkingToLogboek };
