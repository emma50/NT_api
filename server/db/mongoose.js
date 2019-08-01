// load mongoose library --- used to connect to the MongoDB database
const mongoose = require("mongoose");

// NOTE: mongoose support callback by default
// so we tell mongoose we want to use the built in Promise library instead of using a third party Promise library
// and we only do this once
mongoose.Promise = global.Promise;

// connect to database    // and we only do this once
mongoose.connect("mongodb://localhost:9010/TodoApp");

// module.exports.mongoose = mongoose;
module.exports = { mongoose }