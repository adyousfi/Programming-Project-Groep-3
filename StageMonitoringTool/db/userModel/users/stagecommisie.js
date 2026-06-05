import { sequelize } from '../../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Stagecommisie = sequelize.define("Stagecommisie",{

  stagecommisie_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
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

User.hasOne(Stagecommisie, { 
    foreignKey: 'stagecommisie_id', 
    onDelete: 'CASCADE' 
});
Stagecommisie.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Stagecommisie;