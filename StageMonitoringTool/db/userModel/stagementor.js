import { sequelize } from '../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';
import Bedrijf from '../objectModel/bedrijf.js';

const Stagementor = sequelize.define("Stagementor",{

  user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: User,
            key: 'user_id' 
        }
    },

    bedrijf_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Bedrijf,
            key: 'bedrijf_id'
        }
    },
    
    },
    {
        timestamps: true,
    }
)


export default Stagementor;