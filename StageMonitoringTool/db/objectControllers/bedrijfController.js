import Bedrijf from "../objectModel/bedrijf.js";

const createBedrijf = async (name, address) =>{

    const bedrijf = await Bedrijf.create({
        name: name,
        address: address,
    })

    console.log(bedrijf);

    await Bedrijf.create({
        bedrijf_id: Bedrijf.bedrijf_id
    })
        
}

export {createBedrijf};

