import Student from "../userModel/users/student.js";
import { sequelize } from "../dbConnection.js";

const createStudent = async (student_id, user_id) =>
{
    
    const student = await Student.create(
	{
		student_id: student_id,
		user_id: user_id
	})
	console.log(student)
  
}
export default createStudent;