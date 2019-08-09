const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");     // const app = require("./../server").app
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

// we run a lifecycle/hook method called beforeEach() which allows us to run some code before every single test case
beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        let text = "Test the text";
        
        // lets start using supertest
        request(app)
          .post("/todos")    // sets up a post request
          .send({text})   // will send data along with the request which is automatically converted to JSON by supertest
          .expect(200)     // we start making assertions about the request with res.statusCode == 200|ok
          .expect((res) => {     // expect takes in a function
              expect(res.body.text).toBe(text);
          })
          .end((err, res) => {      // query the database
              // handle error 
              if (err) {
                 return done(err);    // end test
              }
              
            //   Todo.find()  // fetch everything in the Todo collection
              Todo.find({text})   // fetch a single Todo
                .then((todos) => {     // start making assertions
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                .catch((err) => done(err))
          })
    })

    // verify that todo does not get created when we send bad data
    it("should not create todo with invalid body data", (done) => {
        request(app)
          .post("/todos")
          .send({})
          .expect(400)
          .end((err, res) => {
              if (err) {
                 return done(err);    
              }

              Todo.find()  // we fetch everything in the Todo collection
                .then((todos) => {     // start making assertions
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch((err) => done(err))
          })          
    })
})

describe("GET /todos", () => {
    it("should get all todos", (done) => {    // the two todos we passed into the function
        request(app)
          .get("/todos")
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(2);
          })
          .end(done)
    });
});

describe("GET /todos/:id", () => {
    it("should return a todo document", (done) => {    // the two todos we passed into the function
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)     // we get the first obj id and convert it to a string with the .toHexString()
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done)
    });

    it("should return 404 if todo is not found", (done) => {
        let id = new ObjectID()     // let hexId = new ObjectID().toHexString()
        
        request(app)
          .get(`/todos/${id.toHexString()}`)     // .get(`/todos/${hexId}`)
          .expect(404)
          .end(done)
    })

    it("should return 404 if todo is not found", (done) => {
        let id = 123
        
        request(app)
          .get(`/todos/${id}`)
          .expect(404)
          .end(done)
    })
});

describe("DELETE /todos/:id ", () => {
    it("should remove a todo", (done) => {
        let hexId = todos[1]._id.toHexString();     // the second element in the todos array

        request(app)
          .delete(`/todos/${hexId}`)     
          .expect(200)
          .expect((res) => {
              expect(res.body.todo._id).toBe(hexId);
          })
          .end((err, res) => {    // query the database
              if (err) {
                  return done(err);    
              }

              Todo.findById(hexId)  // we fetch the Todo collection from database by Id
                .then((todos) => {     // start making assertions
                    expect(todos).toNotExist();
                    done();
                })
                .catch((err) => done(err))
          })
    })

    it("should return 404 if todo is not found", (done) => {
        let hexId = new ObjectID().toHexString()     // generate random id
        
        request(app)
          .delete(`/todos/${hexId}`)     
          .expect(404)
          .end(done)
    })

    it("should return 404 if object id is invalid", (done) => {
        let id = 123     // generate invalid id
        
        request(app)
          .delete(`/todos/${id}`)
          .expect(404)
          .end(done)
    })
})

describe("PATCH /todos/:id", () => {
    it("should update a todo", (done) => {
        let hexId = todos[0]._id.toHexString();    // grab first todo id   
        let text = "Dummy minds here";

        request(app)
          .patch(`/todos/${hexId}`) 
          .send({
              completed: true, 
              text
          })   
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(true);
              expect(res.body.todo.completedAt).toBeA("string")
          })
          .end(done)
    })

    it("should clear completedAt when todo is not completed", (done) => {
        let hexId = todos[1]._id.toHexString();    // grab first todo id
        let text = "text is the new text!!";   
        
        request(app)
          .patch(`/todos/${hexId}`) 
          .send({   // we need to send some data
              completed: false,
              text
          })    
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(false);
              expect(res.body.todo.completedAt).toNotExist()
          })
          .end(done)
    })
})

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
          .get("/users/me")
          .set("x-auth", users[0].tokens[0].token)     // set header 
          .expect(200)
          .expect((res) => {    // a custom assertion
              expect(res.body._id).toBe(users[0]._id.toHexString());
              expect(res.body.email).toBe(users[0].email);
          })
          .end(done);
    })

    it("should return 401 if not authenticated", (done) => {
        request(app)
          .get("/users/me")     
          .expect(401)
          .expect((res) => {
              expect(res.body).toEqual({});
          })
          .end(done)
    })
})

describe("POST /users", () => {
    it("should create a user", (done) => {
        let email = "example@example.com";
        let password = "456def!";

        request(app)
          .post("/users")
          .send({email, password})
          .expect(200)
          .expect((res) => {
              expect(res.headers["x-auth"]).toExist();
              expect(res.body._id).toExist();
              expect(res.body.email).toBe(email);
          })
          .end((err) => {    // custom function to query database
              if (err) {
                  return done(err);
              }

              User.findOne({email}).then((user) => {
                  expect(user).toExist();
                  expect(user.password).toNotBe(password);     // because password should have been hashed
                  done()
              }).catch((err) => done(err));
          })
    })

    it("should return validation error if request is invalid", (done) => {
        let email = "1234abcd";
        let password = "ab12";
        
        request(app)
          .post("/users") 
          .send({email, password})
          .expect(400)    
          .end(done)
    })

    it("should not create user if email exist", (done) => {
        let email = users[0].email;      // let email = "daily659@example.com";
        let password = "password123";

        request(app)
          .post("/users")
          .send({email})    
          .expect(400) 
          .end(done)
    })
})

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
          .post("/users/login")
          .send({
              email: users[1].email,
              password: users[1].password
          })
          .expect(200)
          .expect((res) => {
              expect(res.header["x-auth"]).toExist();
          })
          .end((err, res) => {
            if (err) {
                done(err);
            } else {
                User.findById(users[1]._id).then((user) => {
                    // assert the x-auth token was added to the token array
                    expect(user.tokens[0]).toInclude({
                        access: "auth",
                        token: res.header["x-auth"]
                    });
                    done();
                }).catch((err) => done(err))
            }
          })
    })

    it("should reject invalid login", (done) => {
        request(app)
          .post("/users/login")
          .send({
              email: users[1].email ,
              password: users[1].password + "1"
          })
          .expect(400)
          .expect((res) => {
              expect(res.header["x-auth"]).toNotExist();
          })
          .end((err, res) => {
            if (err) {
                done(err);
            } else {
                User.findById(users[1]._id).then((user) => {
                    // assert the x-auth token was added to the token array
                    expect(user.tokens.length).toBe(0)
                    done();
                }).catch((err) => done(err))
            }
          })
    })
})