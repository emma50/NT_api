const express = require("express");
// body-parser essentially parses the body. takes the string body and turns it into a JSON
const bodyParser = require("body-parser");

const {mongoose} = require("./db/mongoose");    // var mongoose = require("./db/mongoose");
const {User} = require("./models/user");     // var User = require("./models/user");
const {Todo} = require("./models/todo");    // var Todo = require("./models/todo"); 

const app = express();

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
    Todo.find()
      .then((todos) => res.send({todos}))
      .catch((err) => res.status(400).send(err))
})

// setup GET /todos/:id route
app.get("/todos/:id", (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
      .then((todo) => { 
          if(!todo) {
              return res.status(404).send();
          }

          res.send({todo})
      })
      .catch((err) => {
          res.status(400).send(err)
      })
})



// setup users route
// app.post("/users", (req, res) => {
//     // console.log(req.body)
//     // create an instance of the mongoose model
//     var user = new User({
//         email: req.body.email
//     });

    // save the model to the database  --- take in the email and save it in the database
//     user.save().then((doc) => {
//         return res.send(doc);
//     }).catch((err) => {
//         res.status(400).send(err);
//     })
// })

app.listen(3000, () => console.log("Started on port 3000"))

module.exports = { app };




