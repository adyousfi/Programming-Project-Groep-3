import Student from "../userModel/users/student.js";
import { sequelize } from "../dbConnection.js";

const createStudent = async (first_name, last_name, email, password, permission) =>
{
    
    const student = await Student.create(
	{
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
	})
	console.log(student)
  
}
export default createStudent;