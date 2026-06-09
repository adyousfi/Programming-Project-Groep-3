import { ROLES } from "../userModel/user.js";
import { sequelize } from "../dbConnection.js";

import User from "../userModel/user.js";
import Docent from "../userModel/docent.js";
import Stagecommisie from "../userModel/stagecommisie.js";
import Admin from "../userModel/admin.js";
import Student from "../userModel/student.js";
import Stagementor from "../userModel/stagementor.js";

const createUser = async (req, res, next) => {
    const {
        first_name,
        last_name,
        email,
        password,
        role,
        phone
    } = req.body;

    try {

        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            role: role,
            phone: phone
        });

        // The switch statement can now read user.user_id perfectly
        switch (role.toUpperCase()) {
            case ROLES.STUDENT:
                await Student.create({
                    user_id: user.user_id
                });
                break;

            case ROLES.STAGEMENTOR:
                await Stagementor.create({
                    user_id: user.user_id
                });
                break;

            case ROLES.ADMIN:
                await Admin.create({
                    user_id: user.user_id
                });
                break;

            case ROLES.STAGECOMMISIE:
                await Stagecommisie.create({
                    user_id: user.user_id
                });
                break;

            case ROLES.DOCENT:
                await Docent.create({
                    user_id: user.user_id
                });
                break;
            
            default:
                console.log(`No sub-profile table created for role: ${role}`);
        }

        return res.status(200).json({
            msg: "User created successfully",
            data: user
        });

    } catch (error) {
        console.error("Error creating user: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating user"
        });
    }
};

const selectUser = async (req, res, next) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({
            msg: "Users selected successfully",
            data: users
        });
    } catch (error) {
        console.error("Error selecting users: ", error);
        return res.status(500).json({
            msg: "something went wrong while selecting user"
        });
    } 
};

export default { createUser, selectUser };