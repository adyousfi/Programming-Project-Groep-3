import Stagementor from "../userModel/stagementor.js";
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

const linkStagementorToBedrijf = async (userId, bedrijfId) =>{
    await Stagementor.update(
    { bedrijf_id: bedrijfId }, 
    { where: { user_id: userId } }
);
}


export {createStagementor, linkStagementorToBedrijf};