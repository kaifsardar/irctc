
const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth= (req, res, next) => {
    const token = req.header("Authorization");
    // console.log(token)
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        // console.log(decoded)
        req.body.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};




router.post("/", auth, async (req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); 

    try {
        const { userId, trainId } = req.body;
        // console.log(userId,trainId)
        if(!userId || !trainId) 
            return res.status(400).json({ error: "userId and trainId are requied" });

        const [trains] = await connection.query(
            "SELECT available_seats FROM trains WHERE id = ? FOR UPDATE",
            [trainId]
        );

        if (trains.length === 0 || trains[0].available_seats <= 0) {
            await connection.rollback();
            return res.status(400).json({ error: "No seats available" });
        }


        await connection.query(
            "UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?",
            [trainId]
        );


        await connection.query(
            "INSERT INTO bookings (user_id, train_id) VALUES (?, ?)",
            [userId, trainId]
        );

        await connection.commit();
        res.json({ message: "Seat booked" });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "failed", details: error.message });
    } finally {
        connection.release();
    }
});

router.get("/", auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const {userId} = req.body;

        const [booking] = await connection.query(
            `SELECT id as bookingId , train_id as trainId from bookings 
            WHERE user_id = ?`,
            [userId]
        );

        // console.log(booking)

        res.json({userId ,bookings:booking});

    } catch (error) {

        res.status(500).json({ error: "failed", details: error.message });
    } 
    finally {
        connection.release();
    }
});


router.get("/:bookingId", auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const {userId} = req.body;
        const bookingId=req.params.bookingId;

        const [booking] = await connection.query(
            `SELECT u.name as user,u.email,t.name as train,t.id as trainId, b.id as bookingId,u.id as userId ,t.source,t.destination FROM bookings as b,
            users as u , trains as t
            WHERE b.train_id = t.id AND b.user_id = u.id AND b.id = ? AND b.user_id = ?`,
            [bookingId,userId]
        );

        if (booking.length === 0) {
            return res.status().json({ error: "Not valid booking" });
        }

        res.json(booking[0]);

    } catch (error) {

        res.status(500).json({ error: "failed", details: error.message });
    } 
    finally {
        connection.release();
    }
});


module.exports = router;
