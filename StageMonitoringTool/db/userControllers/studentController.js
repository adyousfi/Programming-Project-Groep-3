import Student from "../userModel/student.js";
import { sequelize } from "../dbConnection.js";

const createStudent = async (user_id) =>
{
    
    const student = await Student.create(
	{
		user_id: user_id
	})
	console.log(student)
  
}
export default createStudent;