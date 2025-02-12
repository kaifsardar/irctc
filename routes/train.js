const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");





const auth= (req, res, next) => {
    const token = req.header("Authorization");
    // console.log(token)
    if (!token) return res.status(400).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        // console.log(decoded)
        req.body.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};



// Admin 
router.post("/", async (req, res) => {
    const connection = await pool.getConnection();
    try {

        const apiKey = req.header("api-key"); 

        if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
            return res.status(400).json({ error: "Invalid API Key" });
        }
    


        const { name, source, destination, totalSeats } = req.body;

        if(!name || !source || !destination || !totalSeats) 
            return res.res.status(400).json({ error: "Name, source destination and total seat are required"});

        const [result] = await connection.query(
            "INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)",
            [name, source, destination, totalSeats, totalSeats]
        );

        res.json({ message: "Train added", train: { id:result.insertId ,name,source,destination,totalSeats,} });
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        connection.release();
    }
});


router.get("/",auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { source, destination } = req.query;
        if(!source || !destination) 
            return res.status(400).json({ error: "Source and Destination are required"});

        const [trains] = await connection.query(
            "SELECT id as trainId,name,available_seats FROM trains WHERE source = ? AND destination = ?",
            [source, destination]
        );
        res.json(trains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        connection.release();
    }
});

module.exports = router;
