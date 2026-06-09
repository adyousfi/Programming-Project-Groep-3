import { ROLES } from "../userModel/user.js";
import { sequelize } from "../dbConnection.js";

import User from "../userModel/user.js";

import Docent from "../userModel/docent.js";
import Stagecommisie from "../userModel/stagecommisie.js";
import Admin from "../userModel/admin.js";
import Student from "../userModel/student.js";
import Stagementor from "../userModel/stagementor.js";

const createUser = async (req, res, next) =>
{

	const
	{
		first_name,
		last_name,
		email,
		password,
		role,
		phone
	} = await req.body;

    try {
        await User.create(
	{
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
		role: role,
		phone: phone
		
	})
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
	return res.status(200).json(
	{
		msg: "User created successfully"
	})
    } catch (error) {
        return res.status(500).json(
            {
              msg: "something went wrong while creating user"
            })
    }
	
}




















// const createUser = async (req, res, next ) =>
// {
    
    
// 	const user = await User.create(
// 	{
// 		first_name: req.body.first_name,
//     	last_name: req.body.last_name,
//     	email: req.body.email,
//     	password: req.body.password,
//     	role: req.body.role,
// 		phone: req.body.phone
// 	})
// 	console.log(user)
	
// }


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

export default {createUser,selectUser};