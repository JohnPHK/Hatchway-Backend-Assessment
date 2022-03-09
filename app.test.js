const request = require('supertest');
const app = require('./app');


//Test ping
describe("GET /api/ping", () => {

    describe("Ping the api", () => {

        it("Should respond with a 200 status code", async () => {
            const response = await request(app).get("/api/ping");

            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({ "success": true });
        });
    });
});


describe("GET /api/posts", () => {
    describe("Testing simple route /api/posts", () => {   
        it("testing tags=tech", async() => {
            const response = await request(app).get("/api/posts?tags=tech");
            
            let noError = true;
            
            expect(response.statusCode).toBe(200);
            
            const posts = response.body
            
            for (let i = 0; i < posts.length; i++) {
                if (!posts[i][tags].includes("tech")) noError = false;
            }
            
            expect(noError).toBe(true);
        });
    });
    
    describe("Test no Tags parameter", () => {
        it("Must return 400 status code", async () => {
            const response = await request(app).get("/api/posts");
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toStrictEqual({ "error": "Tags parameter is required" })
            
        });
    });
    
    
    describe("Test invalid sortBy param", () => {
        it("Must return 400 status code", async () => {
            const response = await request(app).get("/api/posts?tags=tech&sortBy=XXX");
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toStrictEqual({ "error": "sortBy parameter is invalid" })
            
        });
    });
    
    describe("Test invalid sortBy param", () => {
        it("Must return 400 status code", async () => {
            const response = await request(app).get("/api/posts?tags=tech&direction=XXX");
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toStrictEqual({ "error": "sortBy parameter is invalid" })
            
        });
    });
    
    describe("Testing multiple param", () => {   
        it("testing tags=tech,health", async() => {
            const response = await request(app).get("/api/posts?tags=tech,health");
            
            let noError = true;
            
            expect(response.statusCode).toBe(200);
            
            const posts = response.body
            
            for (let i = 0; i < posts.length; i++) {
                if (!posts[i][tags].includes("tech") && !posts[i][tags].includes("health")) noError = false;
            }
            
            expect(noError).toBe(true);
        });
    });
    

    
    describe("Test sortBy=id&direction=desc", () => {
        it("Must return posts sorted with decreasing id", async () => {
            const response = await request(app).get("/api/posts?tags=tech&sortBy=id&direction=desc")
            expect(response.statusCode).toBe(200);
            
            let sorted = true;
            posts = response.body;
            
            for (let i = 0; i < posts.length-1; i++) {
                if (posts[i]["id"] < posts[i+1]["id"]) sorted = false;
            }
            
            expect(sorted).toBe(true);
        });
    });
    
    describe("Test sortBy=id&direction=asc", () => {
        it("Must return posts sorted with increasing id", async () => {
            const response = await request(app).get("/api/posts?tags=tech&sortBy=id&direction=asc")
            expect(response.statusCode).toBe(200);
            
            let sorted = true;
            posts = response.body;
            
            for (let i = 0; i < posts.length-1; i++) {
                if (posts[i]["id"] > posts[i+1]["id"]) sorted = false;
            }
            
            expect(sorted).toBe(true);
        });
    });
    
    describe("Test sortBy=popularity", () => {
        it("Must return posts sorted with increasing popularity", async () => {
            const response = await request(app).get("/api/posts?tags=tech&sortBy=popularity&direction=asc")
            expect(response.statusCode).toBe(200);
            
            let sorted = true;
            posts = response.body;
            
            for (let i = 0; i < posts.length-1; i++) {
                if (posts[i]["popularity"] > posts[i+1]["popularity"]) sorted = false;
            }
            
            expect(sorted).toBe(true);
        });
    });
});






//Below are tests for functions

describe("Function checkDuplicate test", () => {
    test("Should return false, there is the post in the list", () => {
        const lst1 = [
            {
                "a": 1
            },
            {
                "c": 3
            }
        ];
        const tmp = { "a": 1 };
        expect(app.checkDuplicate(lst1, tmp)).toBe(false);
    })
    
    test("Should return true, there isn't a duplicate post in the list", () => {
        const lst1 = [
            {
                "a": 1
            },
            {
                "c": 3
            }
        ];
        const tmp = { "f": 3 };
        expect(app.checkDuplicate(lst1, tmp)).toBe(true);
    })
});


describe("Function parseTags test", () => {
    test("Should return list of string separated by comma", () => {
        expectedResult = ["tech", "health", "drama"];
        tmp = "tech,health,drama";
        expect(app.parseTags(tmp)).toStrictEqual(expectedResult);
    }) 
});


describe("Function equalDicts test", () => {
    test("Should return true, because they are equivalent", () => {
        const dct1 = {
            "author": "Rylee Paul",
            "authorId": 9,
            "id": 1,
            "likes": 960,
            "popularity": 0.13,
            "reads": 50361,
            "tags": [
                "tech",
                "health" 
            ] 
        }
        const dct2 = {
            "author": "Rylee Paul",
            "authorId": 9,
            "id": 1,
            "likes": 960,
            "popularity": 0.13,
            "reads": 50361,
            "tags": [
                "tech",
                "health" 
            ] 
        }
        expect(app.equalDicts(dct1, dct2)).toBe(true);
    })
    
    test("Should return false, because they are not equivalent", () => {
        const dct1 = {
            "author": "Rylee Paul",
            "authorId": 9,
            "id": 1,
            "likes": 960,
            "popularity": 0.13,
            "reads": 50361,
            "tags": [
                "tech",
                "health" 
            ] 
        }
        const dct2 = {
            "author": "Rylee Paul",
            "authorId": 9,
            "id": 2,  //difference here
            "likes": 960,
            "popularity": 0.13,
            "reads": 50361,
            "tags": [
                "tech",
                "health" 
            ] 
        }
        expect(app.equalDicts(dct1, dct2)).toBe(false);
    })
});


describe("Function validateParams test", () => {
    test("Should return true, both valid - id, asc", () => {
        expect(app.validateParams("id", "asc")).toBe(true);
    })
    test("Should return false, invalid sortBy parameter", () => {
        expect(app.validateParams("numbers", "asc")).toBe(false);
    })
    test("Shoulrd return false, invalid direction parameter", () => {
        expect(app.validateParams("likes", "dasc")).toBe(false);
    })
});


describe("Function mergeSortPosts", () => {
    test("Should return sorted list of posts by id, asc", () => {
        let toBeSorted = [
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ];
        
        let expectedResult = [
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ]
        
        expect(app.mergeSortPosts(toBeSorted, "id", "asc")).toStrictEqual(expectedResult);
    })
    
    test("Should return sorted list of posts by id, desc", () => {
        let toBeSorted = [
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ];
        
        let expectedResult = [
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            }
        ];
        
        expect(app.mergeSortPosts(toBeSorted, "id", "desc")).toStrictEqual(expectedResult);
    })
    
    test("Should return sorted list of posts by reads, asc", () => {
        let toBeSorted = [
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ];
        
        let expectedResult = [
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            }
        ]
        expect(app.mergeSortPosts(toBeSorted, "reads", "asc")).toStrictEqual(expectedResult);
    })
    
    test("Should return sorted list of posts by likes, asc", () => {
        let toBeSorted = [
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ];
        
        let expectedResult = [
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ]
        expect(app.mergeSortPosts(toBeSorted, "likes", "asc")).toStrictEqual(expectedResult);
    })
    
    test("Should return sorted list of posts by popularity, asc", () => {
        let toBeSorted = [
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            }
        ];
        
        let expectedResult = [
            {
                "author": "Jaden Bryant",
                "authorId": 3,
                "id": 18,
                "likes": 983,
                "popularity": 0.09,
                "reads": 33952,
                "tags": [
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Rylee Paul",
                "authorId": 9,
                "id": 1,
                "likes": 960,
                "popularity": 0.13,
                "reads": 50361,
                "tags": [
                    "tech",
                    "health"
                ]
            },
            {
                "author": "Zackery Turner",
                "authorId": 12,
                "id": 2,
                "likes": 469,
                "popularity": 0.68,
                "reads": 90406,
                "tags": [
                    "startups",
                    "tech",
                    "history"
                ]
            },
            {
                "author": "Elisha Friedman",
                "authorId": 8,
                "id": 4,
                "likes": 728,
                "popularity": 0.88,
                "reads": 19645,
                "tags": [
                    "science",
                    "design",
                    "tech"
                ]
            }
        ];
        expect(app.mergeSortPosts(toBeSorted, "popularity", "asc"));
    })
});

