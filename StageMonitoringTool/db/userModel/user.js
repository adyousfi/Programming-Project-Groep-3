import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize"


export const ROLES = {
    STUDENT: 'student',
    DOCENT: 'docent',
    ADMIN: 'admin',
    STAGECOMMISIE: 'stagecommisie',
    STAGEMENTOR: 'stagementor'
};

const User = sequelize.define("User", {
    
        
    user_id:{
      type: DataTypes.INTEGER,
      allowNull:true,
      primaryKey: true,
      autoIncrement: true,
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    
    role: {
        type: DataTypes.ENUM,
        defaultValue: ROLES.STUDENT,
        values: [ROLES.STUDENT, ROLES.DOCENT, ROLES.ADMIN, ROLES.STAGECOMMISIE, ROLES.STAGEMENTOR]
    },
    phone: {
        type: DataTypes.STRING,
        allowNull:true,
        defaultValue: "no phone"
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    },
    {
        timestamps: true,
    }
    
)

export default User;