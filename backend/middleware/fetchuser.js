const jwt = require('jsonwebtoken');
const JWT_SECRET='mynamevivek'

const fetchuser =(req,res,next)=>{
 

try {
     
    //get the user from jwt token and add id to req object
    const token=req.header('auth-token');
    if(!token){
        return res.status(401).send({error:"please authenticate using a valid token"})
    }
    const data=jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    next(); 
} catch (error) {
    console.error(error.message)
    res.status(401).send({error:"please authenticate using a valid token"})
}
}
module.exports=fetchuser;