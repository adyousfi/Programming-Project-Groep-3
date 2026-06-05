import { sequelize } from '../dbConnection.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Stagementor = sequelize.define("Stagementor",{

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

User.hasOne(Stagementor, { 
    foreignKey: 'stagementor_id', 
    onDelete: 'CASCADE' 
});
Stagementor.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Stagementor;