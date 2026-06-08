import Bedrijf from "../objectModel/bedrijf.js";
import Stagementor from "../userModel/stagementor.js";

const createBedrijf = async (name, address) =>{

    const bedrijf = await Bedrijf.create({
        name: name,
        address: address,
    })

    console.log(bedrijf);
        
}

const linkBedrijfToStageMentor = async (userId, bedrijfId) =>{
    await Stagementor.update(
    { bedrijf_id: bedrijfId }, 
    { where: { user_id: userId } }
);
}


export {createBedrijf, linkBedrijfToStageMentor};