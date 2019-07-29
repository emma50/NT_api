// This file mongodb.find.js is all about Querying data from the database
// Fetch data from MongoDB database --- MongoDB .find() method to query database

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

    // db.collection('Todos')
    // //   .find()    // By default we do not provide any argument for the .find() method --- meaning we want every document from the Todos collection and it returns a cursor which has various methods and it is a pointer to the documents
    // //   .find({completed: false})     // Query using unique values
    //   .find({_id: new ObjectID("5d3e587ffefccd15ccc31132")})    
    //   .toArray()     // A cursor method --- meaning we have an array of documents and we can add a then()/catch() call to it because it returns a promise
    //   .then((docs) => {
    //       console.log("Todos");
    //       console.log(JSON.stringify(docs, undefined, 2));
    //   })
    //   .catch((err) => {
    //       console.log("Unable to fetch todos", err);
    //   })

    // db.collection('Todos').find()
    //   .count()     // returns the number of documents in a collection
    //   .then((count) => {
    //       console.log(`Todos count: ${count}`);
    //   })
    //   .catch((err) => {
    //       console.log("Unable to fetch todos", err);
    //   })

    db.collection('Users').find({firstName: "Emmanuel"})
      .toArray()     // returns the array of documents in a collection
      .then((docs) => {
          console.log("Users");
          console.log(JSON.stringify(docs, undefined, 2));
      })
      .catch((err) => {
          console.log("Unable to fetch todos", err);
      })
    
    // db.close()     // close connection with the MongoDB server
})     
