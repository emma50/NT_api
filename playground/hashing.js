// const crypto = require("crypto-js");
const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let password = "123abc!";

// generate salt
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {   // we store the has value in our database and not the password
//         console.log(hash);
//     })
// })

// compare if hash equals plain text password
let hashedPassword = "$2a$10$ydqnEv5/7IO/7JThZ2athOASMyMQB4nwjknkP.kQhAtTNxleaurJ6";
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);   // returns Boolean
});


// let data = {
//     id: 10
// }

// let token = jwt.sign(data, "123abc");    // create hash & secret and return token value 
// console.log("token:", token)

// let decoded = jwt.verify(token, "123abc");    // verify token --- takes token and makes sure data was not manipulated
// console.log("decoded", decoded);


// let message = "I am user number 3";
// // to hash a value we just pass it into the SHA256() function
// let hash = SHA256(message);   // the result is usually an obj we convert it to string
// hash.toString();   // result converted to string

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// // data we want to send to the client
// let data = {
//     id: 4     // the id will equal the user id
// }

// let token = {
//     data,
//     // hash: SHA256(JSON.stringify(data)).toString()
//     hash: SHA256(JSON.stringify(data) + "somesecret").toString()    // sort the hash --- sorting a hash means you add something to the hash that is unique that changes the value
// }

// // the middle man or hacker might try to change some values
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data) + "somesecret").toString()

// let resultHash = SHA256(JSON.stringify(token.data)).toString();
// // console.log(resultHash);

// if (resultHash === token.data) {   // token was not manipulated
//     console.log("data was not a changed or manipulated");
// } else {
//     console.log("data was manipulated. Do not trust");
// }


// NOTE: hashing is a one way algorithm