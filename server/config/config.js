const env = process.env.NODE_ENV || "development";  // This variable is only set on heroku. we don't have it set locally
console.log("env ====", env)   // to check things are working correctly

if (env === "development") {
    // setup the MongoDB url
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:9010/TodoApp";
} else if (env === "test") {
    // setup some custom database url  --- now running our test doesn't wipe data in the TodoApp database
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:9010/TodoAppTest";
}

// module.exports = { env };