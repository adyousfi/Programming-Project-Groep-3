import Bedrijf from "../objectModel/bedrijf.js";
import Stagementor from "../userModel/stagementor.js";

const createBedrijf = async (req,res,next) =>{

    const{
        naam,
        address,
    } = req.body;

    try{
        const user = await Bedrijf.create({
            naam:naam,
            address:address
        });
        return res.status(200).json({
            msg: "Bedrijfs created successfully",
            data: Bedrijf
        })
    }
    catch(error){
        console.error("Error creating bedrijf: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating bedrijf"
        });

    }
}



const linkBedrijfToStageMentor = async (req,res,next) =>{
    try{
        const{
            user_id,
            bedrijf_id
        } = req.body;

        await Stagementor.update(
    { bedrijf_id: bedrijf_id }, 
    { where: { user_id: user_id } })
    
    return res.status(200).json({
            msg: "mentor updated successfully",
            data: Stagementor
        })
    }
    catch(error){
        console.error("Error updating stagementor: ", error); 
        return res.status(500).json({
            msg: "something went wrong while updating stagementor"
        })
    }
}


export default {createBedrijf, linkBedrijfToStageMentor};