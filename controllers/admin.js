
const pool = require("../config/db");



exports.addTrainHandeler= async (req, res) => {
    const connection = await pool.getConnection();
    try {
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
};




