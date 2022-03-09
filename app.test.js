const request = require('supertest');
const { app, validateParams } = require('./app');


/////

// in your app.js
//const app = express();
//// add routes and middleware
//module.exports = app;

//// in your test file
//import app from './app.js';
//import supertest from 'supertest';

//describe('test block', () => {
  //it('test route', async (done) => {
    //const res = await supertest(app).get('/').expect(200);
    //done();
  //});
//});

//////



describe("GET /api/ping", () => {

    describe("Ping the api", () => {

        it("Should respond with a 200 status code", async () => {
            const response = await request(app).get("/api/ping");

            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({ "success": true });

            
        });
    });
});

//afterAll(() => { console.log('closing...'); app.close(); });


//describe("GET /api/posts", ()=> {

//})

describe("Function validateParams test", () => {
    test("Should return true, both valid - id, asc", () => {
        const expectedResult = true;
        expect(validateParams("id", "asc")).toBe(true);
    })
    test("Should return false, invalid sortBy parameter", () => {
        const expectedResult = false;
        expect(validateParams("numbers", "asc")).toBe(false);
    })
    test("Shoulrd return false, invalid direction parameter", () => {
        const expectedResult = false;
        expect(validateParams("likes", "dasc")).toBe(false);
    })
})

//describe("")


