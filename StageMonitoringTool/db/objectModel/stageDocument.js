import { sequelize } from '../dbConnection.js';
import { DataTypes } from 'sequelize';
import Stage from './stage.js';

const StageDocument = sequelize.define('stageDocument', {
    document_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('admin_template', 'student_submission', 'contract_unsigned', 'contract_signed'),
        allowNull: false,
    },
    original_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stored_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // --- Bedrijf signing fields ---
    signing_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    signed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, { timestamps: true });

StageDocument.belongsTo(Stage, { foreignKey: 'stage_id', as: 'stage' });
Stage.hasMany(StageDocument, { foreignKey: 'stage_id', as: 'documents' });

export default StageDocument;
