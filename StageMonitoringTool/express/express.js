import express from 'express';
import User from '../db/userModel/user.js';
import { createUser } from '../db/userControllers/userController.js';
import { ROLES } from '../db/userModel/user.js';

// Create the router instance using lowercase 'router'
const router = express.Router();

// Middleware to parse JSON bodies (Crucial for POST requests)
router.use(express.json());

// -------------------------------------------------------------
// POST: Create a new user in the database
// -------------------------------------------------------------
router.post('/users', async (req, res) => {
    try {
        // Using your imported controller function
        // Change this inside router.post('/users')
              await User.create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role
          });
          
        return res.status(201)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
});

// -------------------------------------------------------------
// GET: Fetch all users from the database
// -------------------------------------------------------------
router.get('/users', async (req, res) => {
    try {
        // Sequelize method to select all rows from the users table
        const allUsers = await User.findAll();
        
        // Respond with 200 (OK) and the array of users
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Correct ES Modules export syntax
export default router;


// Create a main app instance to actually run the server
const app = express();

// Use the router we just configured
app.use(router);

// Tell the server to stay open and listen for Postman
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is successfully running on http://localhost:${PORT}`);
});