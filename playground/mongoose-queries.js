const {ObjectID} = require("mongodb")    // from MongoDB library/Mongo Driver API

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// NOTE: when your id does not match an id in the database an error is not going to gt thrown. it's still going 
// to fire the success case but it's just going to fire it either with an empty array or null

// let id = "5d443decc88f1c4428c90a1b1";

// isValid() --- a method from mongodb ObjectID
// ObjectID.isValid(id)
// if (!ObjectID.isValid(id)) {
//     console.log("ID not valid")
// }

// Todo.find()   // query all todos
// Todo.find({    // query todos by id
//     _id: id
// }).then((todos) => {
//     console.log("Todos by find", todos)
// }).catch((err) => console.log(err))  

// Todo.findOne({    // query todos but return only one document at most --- grabs the first one that matches the query
//     _id: id
// }).then((todo) => {
//     console.log("Todo by findOne", todo)
// }).catch((err) => console.log(err))  

// Todo.findById(id)    // query todo by id
//   .then((todo) => {
//     if (!todo) {
//         return console.log("id not found");
//     }

//     console.log("Todos by Id", todo)
// }).catch((err) => console.log(err)) 

let id = "5d42d22fc37b0a8023e794f7";

User.findById(id)    // query todo by id
  .then((user) => {
    if (!user) {
        return console.log("User not found");
    }

    console.log(JSON.stringify(user, undefined, 2))
}).catch((err) => console.log(err)) 



