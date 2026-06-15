import { sequelize } from "../dbConnection.js";
import Docent from "../userModel/docent.js";
import User from "../userModel/user.js";

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
    const docenten = await Docent.findAll({
      include: [{ model: User, as: 'User' }]
    });
    return res.json(docenten.map(d => ({
      user_id: d.user_id,
      first_name: d.User.first_name,
      last_name: d.User.last_name,
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen docenten' });
  }
}
export default {createDocent, selectDocent};