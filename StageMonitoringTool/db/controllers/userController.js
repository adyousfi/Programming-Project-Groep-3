import { ROLES } from "../userModel/users/user.js";
import { sequelize } from "../dbConnection.js";

import User from "../userModel/users/user.js";

import Docent from "../userModel/users/docent.js";
import Stagecommisie from "../userModel/users/stagecommisie.js";
import Admin from "../userModel/users/admin.js";
import Student from "../userModel/users/student.js";
import Stagementor from "../userModel/users/stagementor.js";


const createUser = async (first_name, last_name, email, password ,role, phone) =>
{
    
    const user = await User.create(
	{
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
		role: role,
		phone: phone,
		
	})
	
	console.log(user)


	switch (role){
		case ROLES.STUDENT:
		await Student.create({
        user_id: user.user_id
    	})
		break;

		case ROLES.STAGEMENTOR:
			await Stagementor.create({
			user_id: user.user_id
		})
		break;

		case ROLES.ADMIN:
			await Admin.create({
			user_id: user.user_id
		})
		break;

		case ROLES.STAGECOMMISIE:
			await Stagecommisie.create({
				user_id: user.user_id
			})
		break;

		case ROLES.DOCENT:
			await Docent.create({
				user_id: user.user_id
			})
		break;
	}
}


const selectUser = async (req, res, next) =>
{
  try {
    const users = await User.findAll();
	return res.status(200).json(
	{
		msg: "Users selected successfully",
		data: users

	});
  } catch (error) {
    return res.status(500).json(
      {
        msg: "something went wrong while selecting user"
      })
  } 
}

export default {createUser,selectUser}