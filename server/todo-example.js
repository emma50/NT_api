const Todo = require("./models/todo")

// create a brand new Todo --- creating a new instance of Todo
// let newTodo = new Todo({      // NOTE: creating a new instance alone does not update the MongoDB database
//     text: "Cook dinner"
// });

// To update the MongoDB database we call the save() method on the instance "newTodo"
// .save() returns a promise --- we could append the .then() and .catch() call
// newTodo.save()
//   .then((doc) => {
//       console.log("Saved todo", doc)
//   })
//   .catch((err) => {
//       console.log("Unable to save todo", err)
//   });

// let otherTodo = new Todo({
//     // text: true,    // type casting is true --- mongoose converts this to string
//     text: "Something to do"
// })

// otherTodo.save()
//   .then((doc) => {
//       // we pretty print the result to the screen
//       console.log(JSON.stringify(doc, undefined, 2));
//   })
//   .catch((err) => {
//       console.log("Unable to save todo", err);
//   });