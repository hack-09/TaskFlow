const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({message : "Error not valid token"});
        }
        req.user = decode.id;
        next();
    }catch(err){
        res.status(404).json({message : "Token is not valid"});
    }
};

module.exports = authMiddleware;