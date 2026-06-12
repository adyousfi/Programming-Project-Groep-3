import { sequelize } from '../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Stagecommisie = sequelize.define("Stagecommisie",{

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


export default Stagecommisie;