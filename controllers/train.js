const pool = require("../config/db");

exports.getAllTrainsHandeler= async (req, res) => {
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
};