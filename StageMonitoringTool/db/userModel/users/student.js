import { sequelize } from "../../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize"

const Student = sequelize.define("Student", {
    
    student_id:{
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
    },
    {
        timestamps: true,
    }
    
)

export default Student;