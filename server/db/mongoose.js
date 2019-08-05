// load mongoose library --- used to connect to the MongoDB database
const mongoose = require("mongoose");

// NOTE: mongoose support callback by default
// so we tell mongoose we want to use the built in Promise library instead of using a third party Promise library
// and we only do this once
mongoose.Promise = global.Promise;

// connect to database    // and we only do this once
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:9010/TodoApp");
mongoose.connect(process.env.MONGODB_URI);


// module.exports.mongoose = mongoose;
module.exports = { mongoose }

// node environment  --- creating a separate test database for our application.
// that means when we run test suite we are not going to be deleting all of our data in the database
// process.env.NODE_ENV = "production";    // this is set to production by heroku by default when we run app on heroku
// process.env.NODE_ENV = "development";   // when we run app locally
// process.env.NODE_ENV = "test";          // when we run test