import { sequelize } from "../dbConnection.js";
import Docent from "../userModel/docent.js";

const createDocent = async (docent_id, user_id) =>
{
    
    const docent = await Docent.create(
	{
		docent_id: docent_id,
		user_id: user_id
	})
	console.log(docent)
  
}

const selectDocent = async (req, res, next) => {
	try {
		const docent = await Docent.findAll();
        return res.status(200).json({
            msg: "Docenten selected successfully",
            data: docent
        });
	} catch (error) {
		console.error("Error selecting users: ", error);
		return res.status(500).json({
			msg: "something went wrong while selecting users"
		});
	}
}
export default {createDocent, selectDocent};