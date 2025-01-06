const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const token = req.header("Authorization");

    if(!token){
        return res.status(401).json({message : "Invalid token, Authorization is denied"});
    }

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