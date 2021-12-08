const jwt = require("jsonwebtoken")
const config = require("config")

const auth = (req, res, next) => {
const token = req.header("auth-token")
if(!token) return res.status(404).json({msg:"No Token, Authorization denied"})
try {
   const verify = jwt.verify(token, config.get("jwtSecret"))
    user = verify.user.id
   console.log(user)
} catch (error) {
    console.log(error)
    res.status(500).json({msg:"Server Error"})
}
next()
}


module.exports = auth