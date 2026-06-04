import sequelize from "../dbConnection";
import User from "../userModel/user";

let first_name;
let last_name;
let 



const createUser = async (first_name, last_name, email, password, permission) =>
{
  try {
    this.
    const user = await User.create(
	{
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: hashedPassword,
        permission: permission
	})
	console.log(user)
  } catch (error) {
    return res.status(500).json(
      {
        msg: "something went wrong while creating user"
      })
  }
	
}

export default createUser;