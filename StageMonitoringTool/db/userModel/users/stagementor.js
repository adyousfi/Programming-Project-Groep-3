import { sequelize } from '../../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Stagementor = sequelize.define("Stagementor",{

  stagementor_id:{
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

User.hasOne(Stagementor, { 
    foreignKey: 'stagementor_id', 
    onDelete: 'CASCADE' 
});
Stagementor.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Stagementor;