const request = require('supertest');
const { app, validateParams } = require('./app');



describe("GET /api/ping", () => {

    describe("Ping the api", () => {

        test("Should respond with a 200 status code", async () => {
            const response = await request(app).get("/api/ping");

            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({ "success": true });
        })

    })
})

describe("Function validateParams test", () => {
    test("Should return true, both valid - id, asc", () => {
        const expectedResult = true;
        expect(validateParams("id", "asc")).toBe(true);
    })
})

//describe("")
