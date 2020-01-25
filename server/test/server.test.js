const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");     
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");


beforeEach(populateUsers);
beforeEach(populateTodos);


describe("POST /todos", () => {
    it("should create a new todo", (done) => {
       let text = "Test the text";
        
        // lets start using supertest
         request(app)
         .post("/todos")    
          .set("x-auth", users[0].tokens[0].token)  // verify user
          .send({text})   
          .expect(200)     
          .expect((res) => {     
              expect(res.body.text).toBe(text);
          })
          .end((err, res) => {      // query the database
              
              if (err) {
                 return done(err);    // end test
              }
              
              Todo.find({text})   
                .then((todos) => {     // start making assertions
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                .catch((err) => done(err))
          })
    })

    it("should not create todo with invalid body data", (done) => {
        request(app)
          .post("/todos")
          .set("x-auth", users[0].tokens[0].token)  // verify user
          .send({})
          .expect(400)
          .end((err, res) => {
              if (err) {
                 return done(err);    
              }

              Todo.find()  
                .then((todos) => {     
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch((err) => done(err))
          })          
    })
})


describe("GET /todos", () => {
    it("should get all todos", (done) => {    
        request(app)
          .get("/todos")
          .set("x-auth", users[0].tokens[0].token)  // verify user
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(1);   
          })
          .end(done)
    });
});


describe("GET /todos/:id", () => {
    it("should return a todo document", (done) => {    
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)     
          .set("x-auth", users[0].tokens[0].token)
          .expect(200)
          .end(done)
    });

    it("should not return a todo document created by other user", (done) => {    
        request(app)
          .get(`/todos/${todos[1]._id.toHexString()}`)       
          .set("x-auth", users[0].tokens[0].token)        
          .expect(404)
          .end(done);
    });    

    it("should return 404 if todo is not found", (done) => {
        let id = new ObjectID()     
        
        request(app)
          .get(`/todos/${id.toHexString()}`)     
          .set("x-auth", users[0].tokens[0].token)
          .expect(404)
          .end(done)
    })

    it("should return 404 for non-object ids", (done) => {
        let id = "123abc";
        
        request(app)
          .get(`/todos/${id}`)
          .set("x-auth", users[0].tokens[0].token)
          .expect(404)
          .end(done)
    })
});


describe("DELETE /todos/:id ", () => {
    it("should remove a todo", (done) => {
        let hexId = todos[1]._id.toHexString();     

        request(app)
          .delete(`/todos/${hexId}`) 
          .set("x-auth", users[1].tokens[0].token)     
          .expect(200)
          .expect((res) => {
              expect(res.body.todo._id).toBe(hexId);
          })
          .end((err, res) => {    
              if (err) {
                  return done(err);    
              }

              Todo.findById(hexId)  
                .then((todos) => {     
                    expect(todos).toBeFalsy();
                    done();
                })
                .catch((err) => done(err))
          })
    })
    
    it("should not remove a todo doc owned by other user", (done) => {
        let hexId = todos[0]._id.toHexString();     

        request(app)
          .delete(`/todos/${hexId}`) 
          .set("x-auth", users[1].tokens[0].token)     
          .expect(404)
          .end((err, res) => {    
              if (err) {
                  return done(err);    
              }

              Todo.findById(hexId)  
                .then((todos) => {     
                    expect(todos).toBeTruthy();
                    done();
                })
                .catch((err) => done(err))
          })
    })

    it("should return 404 if todo is not found", (done) => {
        let hexId = new ObjectID().toHexString()     // generate random id
        
        request(app)
          .delete(`/todos/${hexId}`)  
          .set("x-auth", users[1].tokens[0].token)    
          .expect(404)
          .end(done)
    })

    it("should return 404 if object id is invalid", (done) => {
        let id = 123     // generate invalid id
        
        request(app)
          .delete(`/todos/${id}`)
          .set("x-auth", users[1].tokens[0].token)    
          .expect(404)
          .end(done)
    })
})


describe("PATCH /todos/:id", () => {
    it("should update a todo", (done) => {
        let hexId = todos[0]._id.toHexString();    
        let text = "Dummy minds here";

        request(app)
          .patch(`/todos/${hexId}`) 
          .set("x-auth", users[0].tokens[0].token) 
          .send({
              completed: true, 
              text
          })   
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(true);
              expect(typeof res.body.todo.completedAt).toBe("string")
          })
          .end(done)
    })

    it("should not update a todo doc created by other user", (done) => {
        let hexId = todos[0]._id.toHexString();       
        let text = "Dummy minds here";

        request(app)
          .patch(`/todos/${hexId}`) 
          .set("x-auth", users[1].tokens[0].token) 
          .send({
              completed: true, 
              text
          })   
          .expect(404)
          .end(done)
    })

    it("should clear completedAt when todo is not completed", (done) => {
        let hexId = todos[1]._id.toHexString();    
        let text = "text is the new text!!";   
        
        request(app)
          .patch(`/todos/${hexId}`) 
          .set("x-auth", users[1].tokens[0].token) 
          .send({   
              completed: false,
              text
          })    
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(false);
              expect(res.body.todo.completedAt).toBeFalsy();
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
              expect(res.headers["x-auth"]).toBeTruthy();
              expect(res.body._id).toBeTruthy();
              expect(res.body.email).toBe(email);
          })
          .end((err) => {    
              if (err) {
                  return done(err);
              }

              User.findOne({email}).then((user) => {
                  expect(user).toBeTruthy();
                  expect(user.password).not.toBe(password);     
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
        let email = users[0].email;      
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
              expect(res.headers["x-auth"]).toBeTruthy();
          })
          .end((err, res) => {
            if (err) {
                done(err);
            } else {
                User.findById(users[1]._id).then((user) => {
                    // assert the x-auth token was added to the token array
                    expect(user.toObject().tokens[0]).toMatchObject({     
                        access: "auth",
                        token: res.headers["x-auth"]
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
              expect(res.headers["x-auth"]).toBeFalsy();
          })
          .end((err, res) => {
            if (err) {
                done(err);
            } else {
                User.findById(users[1]._id).then((user) => {
                    // assert the x-auth token was added to the token array
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((err) => done(err))
            }
          })
    })
})


describe("DELETE /users/me/token", () => {
    it("should remove auth token on logout", (done) => {
        request(app)
          .delete("/users/me/token")
          .set("x-auth", users[0].tokens[0].token)
          .expect(200)
          .end((err, res) => {
              if(err) {
                  return done(err);
              }

              User.findById(users[0]._id).then((user) => {
                  expect(user.tokens.length).toBe(0);
                  done();
              }).catch((err) => done(err))
          })
    })
})
