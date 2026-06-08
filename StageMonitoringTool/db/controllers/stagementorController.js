import Stagementor from "../userModel/users/stagementor.js";
import { sequelize } from "../dbConnection.js";

const createStagementor = async (stagementor_id, user_id) =>
{
    
    const stagementor = await Stagementor.create(
	{
		stagementor_id: stagementor_id,
		user_id: user_id
	})
	console.log(stagementor)
  
}
export default createStagementor;