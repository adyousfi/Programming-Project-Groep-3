import Admin from "../userModel/users/admin.js";
import { sequelize } from "../dbConnection.js";

const createAdmin = async (admin_id, user_id) =>
{
    
    const admin = await Admin.create(
	{
		admin_id: admin_id,
		user_id: user_id
	})
	console.log(admin)
  
}
export default createAdmin;