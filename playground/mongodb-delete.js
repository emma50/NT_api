// start connecting to the database
// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");     // A better way to use require with Destructuring

// To connect to the database we call MongoClient.connect()
MongoClient.connect("mongodb://localhost:9010/TodoApp", (err, db) => { 
    if (err) {
        console.log("unable to connect to MongoDB server"); 
    } else {
        console.log("Connected to MongoDB server");
    }

    // deleteMany() --- target many documents and removes them
    // db.collection("Todos").deleteMany({text: "Eat lunch"})
    //   .then(result => console.log(result))
    //   .catch(err => console.log("Unable to delete todos", err))

    // deleteOne() --- target one document "the first document it sees" and removes it
    // db.collection("Todos").deleteOne({text: "Something to do"})
    //   .then(result => console.log(result))
    //   .catch(err => console.log("Unable to delete todos", err))

    // findOneAndDelete() --- removes an individual item/document "the first document it sees" and returns the value/data 
    // db.collection("Todos").findOneAndDelete({completed: false})
    //   .then(result => console.log(result))      // here it returns the result
    //   .catch(err => console.log("Unable to delete find one todos and delete", err))

    // db.collection("Users").deleteMany({firstName: "Emmanuel"})
    //   .then(result => console.log(result))
    //   .catch(err => console.log("Unable to delete users", err))

    db.collection("Users").findOneAndDelete({_id: new ObjectID("5d3ede7c6d31301ec8a46fe8")})
      .then(result => console.log(result))      // here it returns the result
      .catch(err => console.log("Unable to delete find one todos and delete", err))


    // db.close()     // close connection with the MongoDB server --- but we do not want to close now because when we do it's going to interfere with the data we are about to write
})     



