import { sequelize } from '../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Admin = sequelize.define("Admin",{

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

User.hasOne(Admin, { 
    foreignKey: 'admin_id', 
    onDelete: 'CASCADE' 
});
Admin.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Admin;