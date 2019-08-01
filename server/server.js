const express = require("express");
// body-parser let us send JSON to the server. the server can then takes the JSON and do something with it.
// body-parser essentially parses the body. takes the string body and turns it into a JSON
const bodyParser = require("body-parser");

const {mongoose} = require("./db/mongoose");    // var mongoose = require("./db/mongoose");
const {User} = require("./models/user");     // var User = require("./models/user");
const {Todo} = require("./models/todo");    // var Todo = require("./models/todo"); 

const app = express();

// body-parser middleware --- reads incoming string body as JSON and send it to the express application
app.use(bodyParser.json());

// setup todos route
app.post("/todos", (req, res) => {
    // console.log(req.body)
    // create an instance of the mongoose model
    var todo = new Todo({
        text: req.body.text
    });

    // save the model to the database  --- take in the text and save it in the database
    todo.save().then((doc) => {
        return res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

// setup users route
app.post("/users", (req, res) => {
    // console.log(req.body)
    // create an instance of the mongoose model
    var todo = new User({
        email: req.body.email
    });

    // save the model to the database  --- take in the text and save it in the database
    todo.save().then((doc) => {
        return res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

app.listen(3000, () => console.log("Started on port 3000"))




