const _ = require("lodash");
const express = require("express");
// body-parser essentially parses the body. takes the string body and turns it into a JSON
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb")    // from MongoDB library/Mongo Driver API


const {mongoose} = require("./db/mongoose");    // var mongoose = require("./db/mongoose");
const {User} = require("./models/user");     // var User = require("./models/user");
const {Todo} = require("./models/todo");    // var Todo = require("./models/todo"); 

const app = express();
// allows Heroku to access port and port also works on localhost
const port = process.env.PORT || 3000

// body-parser middleware --- reads incoming string body as JSON and send it to the express application
app.use(bodyParser.json());

// setup POST /todos route
app.post("/todos", (req, res) => {
    // console.log(req.body)
    // create an instance of the mongoose model
    var todo = new Todo({
        text: req.body.text
    });

    // save the model to the database  --- take in the text and save it in the database
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

// setup GET /todos route
app.get("/todos", (req, res) => {
    Todo.find()    // one way to query data in mongoose
      .then((todos) => res.send({todos}))
      .catch((err) => res.status(400).send(err))
})

// setup GET /todos/:id route
app.get("/todos/:id", (req, res) => {
    let id = req.params.id;
       
    // validate the id
    if(!ObjectID.isValid(id)) {
        // handles when we pass in an invalid obj id format 
        return res.status(404).send();
    }

    Todo.findById(id)
      .then((todo) => {    // success callback
          // handles when we pass in a valid obj id format but it does not march a document
          if(!todo) {
              return res.status(404).send();
          }

          // when we pass in a valid obj id that match a document we get it back
          res.send({todo})
      })
      .catch((err) => {    // error callback
          // the req cannot be fulfilled due to bad syntax
          res.status(400).send()
      })
})

// setup DELETE /todos/:id route
app.delete("/todos/:id", (req, res) => {
    let id = req.params.id;
       
    // validate the id
    if(!ObjectID.isValid(id)) {
        // handles when we pass in an invalid obj id format 
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
      .then((todo) => {    // success callback
          // handles when we pass in a valid obj id format but it does not match a document
          if(!todo) {
              return res.status(404).send();
          }

          // when we pass in a valid obj id that march a document we get it back
          res.send({todo})
      })
      .catch((err) => {    // error callback
          // the req cannot be fulfilled due to bad syntax
          res.status(400).send()
      })

})

// setup PATCH /todos/:id route --- the http patch() method is used to update a resource
app.patch("/todos/:id", (req, res) => {
    let id = req.params.id;

    // this is where the update is going to be stored --- will pull off the property we want the user to update
    let body = _.pick(req.body, ["text", "completed"])     // .pick({}, [array of props to be pulled off])

    // validate the id
    if(!ObjectID.isValid(id)) {
        // handles when we pass in an invalid obj id format 
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {   // if body.completed is Boolean & is true
        body.completedAt = new Date().getTime()     // set completedAt to the current time
    } else {
        body.completed = false;
        body.completedAt = null;   // empty
    }

    // query to update the database
    Todo.findByIdAndUpdate(id, {$set: body}, {$new: true})     // .findByIdAndUpdate() takes in the id, set the value in body, return new value true
      .then((todo) => {
          if (!todo) { // check if todo obj exist
              return res.status(404).send()
          }

          // runs if todo exist
          res.send({todo})
      })
      .catch((err) => {
          res.status(400).send();
      })

})

app.listen(port, () => console.log(`Started on port ${port}`))

module.exports = { app };




