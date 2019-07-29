// start connecting to the database
// we need to pull something out of the mongodb library installed from npm
// which is a mongo client that allow us connect to a mongo server and issue commands to manipulate the database
// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");     // A better way to use require with Destructuring
                                                          // We do not have to rely on the MongoDB default _id timestamp
                                                          // MongoDB gives us a function we can run to make an obj_id whenever we like called ObjectID

// // We could create a new _id by making an instance of the ObjectID constructor function
// var obj = new ObjectID();     // This is a regular obj _id
// console.log(obj);

// To connect to the database we call MongoClient.connect()
MongoClient.connect("mongodb://localhost:9010/TodoApp", (err, db) => {  // takes two argument --- MongoClient.connect("url where database live", callback function)
    // if (err) {
    //     console.log("unable to connect to MongoDB server"); 
    // } else {
    //     console.log("Connected to MongoDB server");
    // }

    if (err) {
        return console.log("unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");

    // we insert a new record/document into a collection
    db.collection("Todos")    // db.collection("collection you want to insert into")
      .insertOne({            // inserts a new document into a collection --- insertOne({}, callback function)
          text: "Something to do",
          completed: false
      }, (err, result) => {
          if (err) {
              return console.log("Unable to insert todo", err)
          }

          console.log(JSON.stringify(result.ops, undefined, 2))     // the ops attribute installs all of the document inserted, undefined for the filtered function, and indentation is 2
      })    
      
    db.collection("Users").insertOne({
        firstName: "Emmanuel",
        lastName: "Okwuidegbe",
        age: 25,
        birthday: "1993-12-23",
        location: "Lagos, Nigeria"
    }, (err, result) => {
        if (err) {
            console.log("Unable to insert user", err)
        } else {
            console.log(JSON.stringify(result.ops, undefined, 2))     
        }
    })

    // db.collection("Login").insertOne({
    //     _id: "456",              // NOTE: There is a MongoDB default generated _id if no _id is specified
    //     firstName: "Emmanuel",
    //     lastName: "Okwuidegbe",
    //     email: "okwuidegbeemmanuel@gmail.com",
    //     password: "yeah"
    // }, (err, result) => {
    //     if (err) {
    //         console.log("Unable to insert login", err)
    //     } else {
    //         console.log(JSON.stringify(result.ops, undefined, 2))
    //     }
    // })

    db.collection("Loan").insertOne({
        amount: "$200,000"
    }, (err, result) => {
        if (err) {
            console.log("Unable to insert loan", err)
        } else {
            console.log(JSON.stringify(result.ops[0]._id)) 
            console.log(JSON.stringify(result.ops[0]._id.getTimestamp()))    // A fantastic way to figure out when exactly a document was created   
        }
    })

    db.close()     // close connection with the MongoDB server
})     
// Prints MongoDB default _id to the  screen
// NOTE: In MongoDB unlike other database you don't need to create a database in the GUI or it's shell before you start using it
// NOTE: MongoDB do not create a database until we start adding into it

// SOL --- database->table->column->row
// NOSOL --- database->collection->document->field/property