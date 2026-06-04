const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');


class User extends Model {}

User.init({
  // Shared attributes
  id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        // You can pass values directly as arguments
        type: DataTypes.ENUM('STUDENT', 'DOCENT', 'ADMIN','STAGEMENTOR','STAGECOMMISIE'),
        defaultValue: 'user',
        allowNull: false
    },
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
  // Subclass attributes (must be optional/allowNull: true)
  gpa: { type: DataTypes.FLOAT, allowNull: true },
  salary: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  sequelize, 
  modelName: 'User',
  scopes: {
    student: { where: { role: 'STUDENT' } },
    teacher: { where: { role: 'DOCENT' } },
    admin: { where: { role: 'ADMIN' } },
    stagementor: {where: {role: 'STAGEMENTOR'}},
    stagecommisie: {where: {role:'STAGECOMMISIE'}},
  }
});

module.exports = User;
