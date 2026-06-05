import { sequelize } from "../../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize"
import User from "./user.js";

const Student = sequelize.define("Student", {
    
    student_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    
    },
    {
        timestamps: true,
    }
        
)

User.hasOne(Student, { 
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});
Student.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Student;