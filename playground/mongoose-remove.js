const {ObjectID} = require("mongodb")    // from MongoDB library/Mongo Driver API

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

//NOTE --- you can't pass in an empty document i.e Todo.remove() and expect all documents to get removed
// Todo.remove({text: text})     // delete query(ies) that match a record/delete multiple records
// But if we want to delete all documents we do it this way
// Todo.remove({})    // delete all documents
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err))

let id = "5d451f11fef3ed4cced9e5f8"
// Todo.findOneAndRemove({_id: id})    // query todos and delete one document at most --- remove the first element that matches the query and returns the data so you could do something to it
Todo.findOneAndRemove({_id: id})
  .then((todo) => console.log(todo))
  .catch((err) => console.log(err))

  // Todo.findByIdAndRemove()    // pass in the id as argument and it removes it --- it also returns the data/document
// Todo.findByIdAndRemove("5d451d95fef3ed4cced9e35f")
//   .then((todo) => console.log(todo))
//   .catch((err) => console.log(err))