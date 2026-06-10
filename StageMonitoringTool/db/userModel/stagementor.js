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

Bedrijf.hasMany(Stagementor, { 
        foreignKey: 'bedrijf_id', 
        onDelete: 'CASCADE' // Als een bedrijf wordt verwijderd, blijven de mentors bestaan (hun company_id wordt NULL)
    });
    
    // Een mentor BEHOORT TOT een bedrijf
    Stagementor.belongsTo(Bedrijf, { 
        foreignKey: 'bedrijf_id' 
    });



User.hasOne(Stagementor, { 
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});
Stagementor.belongsTo(User, { 
    foreignKey: 'user_id' 
});

export default Stagementor;