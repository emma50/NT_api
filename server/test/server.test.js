const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");     // const app = require("./../server").app
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");

// we create a dummy todo
const todos = [{
    text: "First todo test"
}, {
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
          .end((err, res) => {      // instead of end(done) we handle err and res
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

              Todo.find()  // we want to fetch everything in the Todo collection
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

