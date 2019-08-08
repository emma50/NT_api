const {User} = require("./../models/user");

// custom middleware function we use on our routes to make them private --- the actual route does not get to run until next() is called
let authenticate = (req, res, next) => {
    let token = req.header("x-auth");   // get the header props "x-auth"
    
    // verify and fetch user --- we break this code into some middleware
    User.findByToken(token).then((user) => {
        if(!user) {
            // a valid token that did not match the user specified
            return Promise.reject();
        }
        
        // modify req object
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send()
    })
}

module.exports = { authenticate };