const mongoose = require("mongoose");      // const mongoose = require("./db/mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

// the user Schema --- needed for custom methods
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        trim: true,    
        minlength: 3,        
        unique: true,
        validate: {  // setup custom email validation
            //    validator: function(value) {
            //        // call in the npm validator --- an installed library
            //        return validator.isEmail(value)    // returns true if email is valid or false if otherwise
            //    },  
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        } 
     },
     password: {
         type: String,
         required: true,
         minLength: 6
     }, 
     tokens: [{     
         access: {
             type: String,
             required: true
         },
         token: {
             type: String,
             required: true
         }
     }]
}, {usePushEach: true}); 

// deterrmines what exactly get sent back when a mongoose model is converted into a JSON value
UserSchema.methods.toJSON = function() {
    let user = this;    // mongoose variable
    let userObject = user.toObject();    // convert mongoose variable into a regular object
    
    return _.pick(userObject, ["_id", "email"]);
}

// create a method using Schema.methods object and an instance method i.e generateToken()
UserSchema.methods.generateAuthToken = function() {    // arrow function do not bind the this keyword
    let user = this;    // instance method of the model method 
    let access = "auth";
    let token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

    // update user token array --- UserSchema.tokens
    const tokenArray = [];
    tokenArray.push({access, token});

    user.tokens = tokenArray;
    
    // user.tokens.push({access, token});

    // save user to the database
    return user.save().then(() => token);
}

UserSchema.methods.removeToken = function(token) {
    let user = this;

    return user.update({    
        $pull: {    // $pull --- a mongodb operator remove the entire items from an array that match certain criteria
            tokens: { token }
        }
    })
    
}

// .statics() is an object 
UserSchema.statics.findByToken = function(token) {
    let User = this;    // Object --- model method/User variable
    let decoded;    // stores the decoded jwt values

    try {   // verify token
        decoded = jwt.verify(token, "abc123")
    } catch(err) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();    // return Promise.reject("Authentication is required");    
    }
    
    // handle success case
    return User.findOne({    // find users whose values match the one we have
        "_id": decoded._id,    // _id: decoded._id,
        "tokens.token": token,   // find a user whose token array has an Object where the token props equal the tokenprops passed to the above this function
        "tokens.access": "auth"
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;

    return User.findOne({email}).then((user) => {    // verify that the user exist
        if (!user) {    // runs if the user does not exist
            return Promise.reject();
        }

        // runs if the user exist
        return new Promise((resolve, reject) => {
            // compare password and user password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

// mongoose middleware --- runs a code before or after certain event i.e an update even
UserSchema.pre("save", function(next) {
    let user = this;
    
    if(user.isModified("password")) {  // .isModified() returns a Boolean
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {   
                user.password = hash;     // update user password to equal the hash value
                next();
            })
        })
    } else {
        next();
    }   
})

// register the user model
const User = mongoose.model("User", UserSchema);

// module.exports.User = User;
module.exports = { User }

