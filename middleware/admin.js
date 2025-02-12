exports.admin = (req,res,next)=>{
    const apiKey = req.header("api-key"); 

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(400).json({ error: "Invalid API Key" });
    }

    next();
};