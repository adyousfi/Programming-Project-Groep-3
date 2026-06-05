import { sequelize } from '../../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Docent = sequelize.define("Docent",{

  docent_id:{
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

User.hasOne(Docent, { 
    foreignKey: 'docent_id', 
    onDelete: 'CASCADE' 
});
Docent.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Docent;