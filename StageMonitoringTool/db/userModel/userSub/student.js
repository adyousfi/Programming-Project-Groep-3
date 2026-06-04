const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class student extends Model {}

Student.init({
  // Define gpa directly here!
  gpa: { 
    type: DataTypes.FLOAT, 
    allowNull: false // Now you can make it strictly required!
  },
  // Foreign key linking to the User table
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, { 
  sequelize, 
  modelName: 'Student' 
});

module.exports = Student;