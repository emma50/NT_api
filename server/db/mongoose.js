const mongoose = require("mongoose");

// NOTE: mongoose support callback by default
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);


module.exports = { mongoose }