const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();



router.post("/register", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { name, email, password } = req.body;


        if(!name || !email || !password) 
            return res.status(400).json({ error: "Name, Email and Password are reuired" });



        const [existingUser] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", details:{userId: result.insertId,name,email}});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        connection.release(); 
    }
});



router.post("/login", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { email, password } = req.body;

        if(!email || !password) return res.status(401).json({ error: "Email and Password are Required" });



        const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: "No User Found" });
        }
        // console.log(users)
        const user = users[0];
        // console.log(user);

        //password checking
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        connection.release(); // Ensure connection is released
    }
});

module.exports = router;
