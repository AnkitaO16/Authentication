const jwt = require('jsonwebtoken')
const User = require('../model/User')

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, 'secret' , (err, decodedToken) =>{
            // console.log("decoded", decodedToken);
            if(err){
                res.redirect('/login')
            }
            else {
                next();
            }
        })
    }else{
        res.redirect('/login')
    }
};


const checkUser =  async(req,res,next) => {
    const token = req.cookies.jwt
        if (token) {
        jwt.verify(token, 'secret', async(err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });

    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = {
    requireAuth, checkUser
}