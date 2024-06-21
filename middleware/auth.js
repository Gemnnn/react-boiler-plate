const { User } = require('../models/User');

let auth = async(req, res, next) => {

    // Get token from client's cookies
    let token = req.cookies.x_auth;

    // Find user
    // User.findByToken(token, (err, user) =>{
    //     if(err){
    //         throw err;
    //     }
    //     if(!user){
    //         return res.json({ isAuth: false, error: true })
    //     }

    //     req.token = token;
    //     req.user = user;
    //     next()
    // });
    try {
        const user = await User.findByToken(token);
        if (!user) {
            return res.json({ isAuth: false, error: true });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ isAuth: false, error: true });
    }
};

module.exports = { auth };