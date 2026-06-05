
import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";
import Docent from "../userModel/users/docent.js";
import Student from "../userModel/users/student.js";
import Admin from "../userModel/users/admin.js";
import Stagementor from "../userModel/users/stagementor.js";


export const status = {
    AANVRAAG: 'Aanvraag',
    GOEDGEKEURD: 'Goedgekeurd',
    AANPASSINGENVEREISD: 'Aanpassingen_vereist',
    DOCUMENTGEUPLOADED: 'documentgeuploaded',
    KLAAR: 'klaar'
};

// Stage model
const Stage = sequelize.define("stage", {
    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "PK - Stage primary key"
    },
    stageaanvraag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to stageaanvraag"
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to student (admin)"
    },
    docent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to docent (admin)"
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to admin"
    },
    mentor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to mentor"
    },
    bedrijfs_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to bedrijf"
    },
    omschrijving_opdracht: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(Object.values(status)),
        allowNull: true,
        defaultValue: 'Aanvraag'
    },
    begin_datum: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    eind_datum: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    },
    {
        timestamps: true,
    }

)



// Define associations
Stage.belongsTo(Docent, { foreignKey: 'docent_id', as: 'docent' });
Stage.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Stage.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });
Stage.belongsTo(Stagementor, { foreignKey: 'mentor_id', as: 'mentor' });

export default Stage;
