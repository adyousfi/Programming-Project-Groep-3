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

User.hasOne(Stagecommisie, { 
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});
Stagecommisie.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Stagecommisie;