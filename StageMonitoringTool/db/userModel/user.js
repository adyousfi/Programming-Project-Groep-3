import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize"

export const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
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
    role: {
        // 2. Feed the array values directly into the ENUM
        type: DataTypes.ENUM(Object.values(ROLES)),
        allowNull: false
    },
    password: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    },
    {
        timestamps: true,
    }
    
)

export default User;