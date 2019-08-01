// const mongoose = require("./db/mongoose");
const mongoose = require("mongoose");

// create a model/mongoose model   --- for everything we want to store
// Here we create a Todo collection model specifyong the attributes we want it to have
const Todo = mongoose.model("Todo", {   // takes two arguments --- .model("string name", {object that defines various field/property for a model/the Schena})
   text: {   // the Todo model will have a text property. we figure out exactly what text is
       type: String,
       required: true,     // one of MongoDB validators
       minlength: 1,       // one of MongoDB validators 
       trim: true          // one of MongoDB validators
   },
   completed: {
       type: Boolean,
       default: false
   },
   completedAt: {
       type: Date, 
       default: null
   }
}) 

// module.exports.Todo = Todo
module.exports = { Todo }