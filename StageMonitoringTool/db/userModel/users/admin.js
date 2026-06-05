import { sequelize } from '../../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Admin = sequelize.define("Admin",{

  admin_id:{
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

User.hasOne(Admin, { 
    foreignKey: 'admin_id', 
    onDelete: 'CASCADE' 
});
Admin.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Admin;