// NOTE: In the playground folder we make use of the Node.js MongoDB Driver API to communcate with the MongoDB database

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

    // db.collection("Todos")
    //   .findOneAndUpdate({     // findOneAndUpdate(filter/field of document to be updated, update/updated value, options, callback function)
    //     _id: new ObjectID("5d3ede7c6d31301ec8a46fe7")
    //   }, {   // It is not straight forward. we use the MongoDB update operator
    //       $set: {
    //           completed: true
    //       }
    //   }, {  // default is true
    //       returnOriginal: false
    //   })    
    //   .then(result => console.log(result))      
    //   .catch(err => console.log("Unable to find one todos and update", err))

    db.collection("Users")
      .findOneAndUpdate({     // findOneAndUpdate(filter/field of document to be updated, update/updated value, options, callback function)
        _id: new ObjectID("5d3e6159467cce082cf38e5f")
      }, {   // we use the MongoDB update operator to update fields/properties
          $set: {
              firstName: "Emmanuel"
          },
          $inc: {   // Increment age by 1
              age: 1
          }
      }, {  // default is true
          returnOriginal: false
      })    
      .then(result => console.log(result))      
      .catch(err => console.log("Unable to find one todos and update", err))

    // db.close()     // close connection with the MongoDB server --- but we do not want to close now because when we do it's going to interfere with the data we are about to write
})     



