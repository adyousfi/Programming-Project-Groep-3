import { sequelize } from "../../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize"
import User from "./user.js";

const Student = sequelize.define("Student", {
    
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: User,
            key: 'user_id' 
        }
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