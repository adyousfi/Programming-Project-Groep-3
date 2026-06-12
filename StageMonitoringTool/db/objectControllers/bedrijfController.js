import Bedrijf from "../objectModel/bedrijf.js";
import Stagementor from "../userModel/stagementor.js";

const createBedrijfCore = async (naam, address) => {
    const bedrijf = await Bedrijf.create({
        naam,
        address
    });
    return bedrijf;
};

const createBedrijf = async (req, res, next) => {
    const { naam, address } = req.body;

    try {
        const bedrijf = await createBedrijfCore(naam, address);
        return res.status(200).json({
            msg: "Bedrijf created successfully",
            data: bedrijf
        });
    } catch (error) {
        console.error("Error creating bedrijf: ", error);
        return res.status(500).json({
            msg: "something went wrong while creating bedrijf"
        });
    }
};

const linkBedrijfToStageMentor = async (req, res, next) => {
    try {
        const { user_id, bedrijf_id } = req.body;

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
};

export default { createBedrijfCore, createBedrijf, linkBedrijfToStageMentor };