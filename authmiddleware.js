const jwt= require ('jsonwebtoken')

function authmiddleware (req,res,next){


const token = req.headers.token 
if (!token){
    return res.status(403).json({
        message: "No token provided"
    });
}

const decoded = jwt.verify (token, "secretkey")
const username = decoded.username

  if (!username){
    return res.status(403).json({
        message : "token is mismatched"
    })

    req.username = username 
        
   
    next ();
  }
}

module.exports = authmiddleware;