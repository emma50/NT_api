const mongoose = require("mongoose");      // const mongoose = require("./db/mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

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

// create a method using Schema.methods object and an instance method i.e generateToken
UserSchema.methods.generateAuthToken = function() {    // arrow function do not bind the this keyword
    let user = this;
    let access = "auth";
    let token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

    // update user token array --- UserSchema.tokens
    const tokenArray = [];
    tokenArray.push({access, token});

    user.tokens = tokenArray;
    
    // user.tokens.push({access, token});

    console.log(`--->${user.tokens}`);

    // save user to the database
    return user.save().then(() => token);
}

// register the user model
const User = mongoose.model("User", UserSchema);

// module.exports.User = User;
module.exports = { User }

