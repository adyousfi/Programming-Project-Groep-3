import { sequelize } from "../../dbConnection.js";
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
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        defaultValue: ROLES.STUDENT,
        values: ['student','docent','admin','stagecommisie','stagementor']
    },
    },
    {
        timestamps: true,
    }
    
)

export default User;