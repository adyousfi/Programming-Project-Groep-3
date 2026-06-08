import { sequelize } from "../dbConnection.js";
import Docent from "../userModel/users/docent.js";

const createDocent = async (docent_id, user_id) =>
{
    
    const docent = await Docent.create(
	{
		docent_id: docent_id,
		user_id: user_id
	})
	console.log(docent)
  
}
export default createDocent;