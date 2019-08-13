const env = process.env.NODE_ENV || "development";  // This variable is only set on heroku. we don't have it set locally
console.log("env ====", env);   // this tells us the running env i.e test, development, production.

// load env in if on test or development
if (env === "development" || env === "test") {
    // we load in a JSON file "config.json" where our dev & test variable live and the file is not going to be part of the git repository    
    let config = require("./config.json");      // require the config.json file
    // console.log(config);

    // set process.env obj
    let envConfig = config[env];    // access the variable using bracket notation
    // console.log(Object.keys(envConfig))
    // console.log(Object.values(envConfig))
    // console.log(Object.entries(envConfig))

    Object.keys(envConfig)    // get the Object keys
      .forEach((key) => {   // loop over the Object keys 
          process.env[key] = envConfig[key];    // set process.env
          
      })
    
}

// if (env === "development") {
//     // setup the MongoDB url
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:9010/TodoApp";
// } else if (env === "test") {
//     // setup some custom database url  --- now running our test doesn't wipe away data in the TodoApp database
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:9010/TodoAppTest";
// }

// module.exports = { env };