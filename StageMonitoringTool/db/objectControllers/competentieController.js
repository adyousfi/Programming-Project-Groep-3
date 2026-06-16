import Competentie from "../objectModel/competentie.js";
import { sequelize } from "../dbConnection.js";

const createCompetentie  = async(req,res,next) =>{
    const{
        code,
        title,
        omschrijving,
        gewicht
    } = req.body
    try{
        const competentie = await Competentie.create({
            code:code,
            title:title,
            omschrijving:omschrijving,
            gewicht:gewicht
        })

        return res.status(200).json({
            msg: "Competentie created successfully",
            data: competentie
        })
    }
    catch(error){
        console.error("Error creating competentie: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating competentie"
        });
    }

}

const getAllCompetenties = async (req, res, next) => {
  try {
    const competenties = await Competentie.findAll();
    return res.status(200).json({
      msg: 'Competenties opgehaald',
      data: competenties,
    });
  } catch (error) {
    console.error('Error fetching competenties:', error);
    return res.status(500).json({ msg: 'something went wrong while fetching competenties' });
  }
};

const updateCompetentie = async (req, res, next) => {
  const { competentie_id } = req.params;
  const { code, title, omschrijving, gewicht } = req.body;

  try {
    const competentie = await Competentie.findByPk(compentie_id);
    if (!competentie) return res.status(404).json({ msg: 'Competentie niet gevonden' });

    await competentie.update({
      code,
      title,
      omschrijving,
      gewicht_percentage: gewicht,
    });

    return res.status(200).json({ msg: 'Competentie bijgewerkt', data: competentie });
  } catch (error) {
    console.error('Error updating competentie:', error);
    return res.status(500).json({ msg: 'something went wrong while updating competentie' });
  }
};

export default { createCompetentie, getAllCompetenties, updateCompetentie };
