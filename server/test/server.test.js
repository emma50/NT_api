const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");     // const app = require("./../server").app
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");

// we create a dummy todo
const todos = [{
    _id: new ObjectID(),
    text: "First todo test"
}, {
    _id: new ObjectID(),
    text: "Second todo test"
}];

// we run a lifecycle/hook method called beforeEach() which allows us to run some code before every single test case
beforeEach((done) => {
    Todo.remove({})    // wipes all of our Todos
      .then(() => {    
         return  Todo.insertMany(todos)
      })
      .then(() => done())   // only moves to the test case once we call done() --- an expression syntax
      .catch((err) => console.log("Could not empty the Todo collection", err))
})

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

