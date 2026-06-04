import sequelize from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";

// 2. Call .define() on your lowercase 'sequelize' instance variable
const User = sequelize.define("User", {
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

export default User;