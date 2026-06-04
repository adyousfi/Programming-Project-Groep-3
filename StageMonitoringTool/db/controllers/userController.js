import User from "../userModel/user.js";
import { sequelize } from "../dbConnection.js";

const createUser = async (first_name, last_name, email, password, permission) =>
{
    
    const user = await User.create(
	{
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
	})
	console.log(user)
  
}
export default createUser;