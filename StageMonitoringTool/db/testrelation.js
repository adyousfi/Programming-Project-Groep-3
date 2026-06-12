import Stage from "./objectModel/stage.js";
import Student from "./userModel/student.js";
import User from "./userModel/user.js";
import Bedrijf from "./objectModel/bedrijf.js";

export const runRelationTest = async () => {
    console.log("\n------------------------------------------------");
    console.log("STARTEN VAN DATABASE RELATIE TEST...");
    console.log("------------------------------------------------");

    try {
        // We zoeken Stage ID 1 en trekken de gekoppelde tabellen mee naar binnen via 'include'
        const testStage = await Stage.findOne({
            where: { stage_id: 1 },
            include: [
                { 
                    model: Student, 
                    as: 'student',
                    include: [{ model: User, as: 'User' }]
                }, 
                { 
                    model: Bedrijf,
                    as: 'bedrijf'
                }
            ]
        });

        if (testStage) {
            console.log("RELATIE TEST GESLAAGD!");
            console.log(`Stage ID: ${testStage.stage_id}`);
            console.log(`Omschrijving: ${testStage.omschrijving_opdracht}`);
            
            if (testStage.student && testStage.student.User) {
                console.log(`Gekoppelde Student: ${testStage.student.User.first_name} ${testStage.student.User.last_name}`);
            } else {
                console.log("Waarschuwing: Stage gevonden, maar de relatie met Student/User is leeg.");
            }

            if (testStage.bedrijf) {
                console.log(`Gekoppeld Bedrijf: ${testStage.bedrijf.naam} (${testStage.bedrijf.address})`);
            } else {
                console.log("Waarschuwing: Stage gevonden, maar de relatie met Bedrijf is leeg.");
            }
        } else {
            console.log("TEST MISLUKT: Er is geen Stage met ID 1 gevonden in de database. Zorg dat de seeder eerst succesvol draait.");
        }

    } catch (error) {
        console.error("KRITISCHE FOUT: De relaties tussen de modellen kloppen niet.");
        console.error("Foutmelding van Sequelize:", error.message);
    }
    
    console.log("------------------------------------------------\n");
};