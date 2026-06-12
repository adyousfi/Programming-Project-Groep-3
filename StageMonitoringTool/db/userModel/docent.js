import { sequelize } from '../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Docent = sequelize.define("Docent",{

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

export default Docent;