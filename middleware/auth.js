
const jwt = require("jsonwebtoken");


exports.auth = (req, res, next) => {
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