import { ROLES } from "../userModel/user.js";
import { sequelize } from "../dbConnection.js";
import createUserMail from "../../mailBot/sendMail/userCreate.js";
import createActivationMail from "../../mailBot/sendMail/activeUser.js";
import User from "../userModel/user.js";
import Docent from "../userModel/docent.js";
import Stagecommisie from "../userModel/stagecommisie.js";
import Admin from "../userModel/admin.js";
import Student from "../userModel/student.js";
import Stagementor from "../userModel/stagementor.js";
import Stage from "../objectModel/stage.js";
import { generateToken, verifyToken } from "../../backend/auth/authMiddleware.js";

const createUser = async (req, res, next) => {
    const { first_name, last_name, email, password, role, phone } = req.body;

    try {
        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            role: role,
            phone: phone || "no phone"
        });
        switch (role.toLowerCase()) {
        case 'student':
            await Student.create({ user_id: user.user_id });
            break;
        case 'stagementor':
            await Stagementor.create({ user_id: user.user_id });
            break;
        case 'admin':
            await Admin.create({ user_id: user.user_id });
            break;
        case 'stagecommisie':
            await Stagecommisie.create({ user_id: user.user_id });
            break;
        case 'docent':
            await Docent.create({ user_id: user.user_id });
            break;
        default:
            console.log(`No sub-profile table created for role: ${role}`);
    }
        await createUserMail(email, first_name, password, role);
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

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { first_name, last_name, email, password, role, phone } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: "Gebruiker niet gevonden" });
        }

        const updateData = { first_name, last_name, email, role, phone };
        if (password && password.trim() !== '') {
            updateData.password = password;
        }
        if (req.body.is_active !== undefined) {
            updateData.is_active = req.body.is_active;
        }

        await user.update(updateData);

        return res.status(200).json({
            msg: "Gebruiker succesvol bijgewerkt",
            data: user
        });
    } catch (error) {
        console.error("Error updating user: ", error);
        return res.status(500).json({
            msg: "Er is iets misgegaan bij het bijwerken van de gebruiker"
        });
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: "Gebruiker niet gevonden" });
        }

        switch (user.role) {
            case ROLES.STUDENT:
                await Student.destroy({ where: { user_id: user.user_id } });
                break;
            case ROLES.STAGEMENTOR:
                await Stagementor.destroy({ where: { user_id: user.user_id } });
                break;
            case ROLES.ADMIN:
                await Admin.destroy({ where: { user_id: user.user_id } });
                break;
            case ROLES.STAGECOMMISIE:
                await Stagecommisie.destroy({ where: { user_id: user.user_id } });
                break;
            case ROLES.DOCENT:
                await Docent.destroy({ where: { user_id: user.user_id } });
                break;
            default:
                console.log(`No sub-profile table to delete for role: ${user.role}`);
        }
        await user.destroy();
        return res.status(200).json({
            msg: "Gebruiker succesvol verwijderd"
        });
    } catch (error) {
        console.error("Error deleting user: ", error);
        return res.status(500).json({
            msg: "Er is iets misgegaan bij het verwijderen van de gebruiker"
        });
    }
};

const toggleUserActive = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ msg: 'Gebruiker niet gevonden' });
        await user.update({ is_active: !user.is_active });
        if(user.is_active){
            await createActivationMail(user.email, user.first_name, user.password, user.role);
        }
        return res.status(200).json({ msg: user.is_active ? 'Account geactiveerd' : 'Account gedeactiveerd', is_active: user.is_active });
        
    } catch (error) {
        console.error('Error toggling user active:', error);
        return res.status(500).json({ msg: 'Er is iets misgegaan' });
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.password !== password) {
            return res.json({ success: false, message: 'Foute login' });
        }
        if (!user.is_active) {
            return res.json({ success: false, message: 'Je account is nog niet geactiveerd. Contacteer de administrator.' });
        }
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            sameSite: 'lax',
        });
        res.json({
            success: true,
            message: 'Login succesvol',
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

const checkLogin = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.json({ loggedIn: false });
    }
    try {
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return res.json({ loggedIn: false });
        }
        res.json({
            loggedIn: true,
            user: {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            }
        });
    } catch (err) {
        return res.json({ loggedIn: false });
    }
};

const logoutUser = (req, res, next) => {
    res.clearCookie('token');
    res.cookie('token', '', { maxAge: 0, httpOnly: true, sameSite: 'lax' });
    res.json({ success: true });
};

export default { createUser, selectUser, updateUser, deleteUser, loginUser, checkLogin, logoutUser, toggleUserActive };
