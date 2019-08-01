const User = require("./models/user");

let otherUser = new User({
    email: " okwuidegbeemmanuel@gmail.com   "
})

otherUser.save()
  .then((doc) => {
      // we pretty print the result to the screen
      console.log(JSON.stringify(doc, undefined, 2));
  })
  .catch((err) => {
      console.log("Unable to save user", err);
  });