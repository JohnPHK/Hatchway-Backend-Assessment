const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));


app.get('/api/ping', (req, res) => {
    res.send({ "success": true });
});

app.get('/api/posts', async (req, res) => {
    let posts = [];
    const query = req.query  
    const sortBy = query.sortBy ? query.sortBy : "id";
    const direction = query.direction ? query.direction : "asc";  

    if (!query.tags) 
        return res.status(400).send({ error: "Tags parameter is required" });

    if (!validateParams(sortBy, direction)) 
        return res.status(400).send({ error : "sortBy parameter is invalid" }); 

    const tagList = parseTags(query.tags);
    
    const postsData = tagList
        .map((tag) => {   
            return axios.get("https://api.hatchways.io/assessment/blog/posts?tag=" + tag);
        });
    
    try {
        const ccApiRes = await Promise.all(postsData);
        
        const dictsOfPosts =  ccApiRes[0].data.posts;
        
        for (let i = 0; i < dictsOfPosts.length; i++) {
            if (checkDuplicate(posts, dictsOfPosts[i])) {
                posts.push(dictsOfPosts[i])
            }         
        }
        posts = mergeSortPosts(posts, sortBy, direction); 

    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
    
    return res.send({ posts: posts });

});



//Check if there post to be added already exists in the so far gathered posts
function checkDuplicate(postsAccumulated, candidatePost){
    for (let i = 0; i < postsAccumulated.length; i++) {
        if (equalDicts(postsAccumulated[i], candidatePost)) return false
    }
    return true
};

const lst1 = [
    {
        "a": 1
    },
    {
        "c": 3
    }
];

const dct1 = { "a": 1 };
const dct2 = { "f": 3 };

console.log(checkDuplicate(lst1, dct1));
console.log(checkDuplicate(lst1, dct2));

//Parses the tags
function parseTags(tags) {
    const tagList = tags.split(',').map(tag => tag.trim());
    return tagList;
};


//Check if two dictionaries are the same
function equalDicts(dict1, dict2) {
    if (Object.keys(dict1).length !== Object.keys(dict2).length) {
        return false;
    }
    
    const orderedDict1 = Object.keys(dict1).sort().reduce(
        (obj, key) => {
            obj[key] = dict1[key];
            return obj;
        }, {}
    );
    const orderedDict2 = Object.keys(dict2).sort().reduce(
        (obj, key) => {
            obj[key] = dict2[key]
            return obj;
        }, {}
    );
    return JSON.stringify(orderedDict1) === JSON.stringify(orderedDict2);
}

//Validate if the parameters (sortBy and direction) are valid
function validateParams(sortBy, direction) {
    validSortBy = ["id", "reads", "likes", "popularity"];
    validDirections = ["asc", "desc"];
    return validSortBy.includes(sortBy) && validDirections.includes(direction);

}

console.log("1", validateParams("id", "desc"));
console.log("2", validateParams("reads", "asc"));
console.log("3", validateParams("ping", "dsc"));

function mergeSortPosts(posts, kind, ascOrDsc) {
    if (posts.length < 2) return posts;
    
    const half = posts.length / 2;
    
    const left = posts.splice(0, half); 
    const right = posts;

    return merge(mergeSortPosts(left, kind, ascOrDsc), 
                 mergeSortPosts(right, kind, ascOrDsc), 
                 kind, 
                 ascOrDsc);
}


//Sort the posts by Kind
function merge(left, right, kind, ascOrDsc) {
    let arr = [];
    if (!ascOrDsc || ascOrDsc === "asc") {

        while (left.length && right.length) {
            if (left[0][kind] < right[0][kind]) {
                arr.push(left.shift());
            } else {
                arr.push(right.shift());
            }
        }
    } else if (ascOrDsc === "desc") {
        while (left.length && right.length) {
            if (left[0][kind] < right[0][kind]) {
                arr.push(right.shift());
            } else {
                arr.push(left.shift());
            }
        }
    }
    return [...arr, ...left, ...right];
}

let test = [
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
    },
    {
        "author": "Adalyn Blevins",
        "authorId": 11,
        "id": 12,
        "likes": 590,
        "popularity": 0.32,
        "reads": 80351,
        "tags": [
            "tech"
        ]
    },
    {
        "author": "Trevon Rodriguez",
        "authorId": 5,
        "id": 14,
        "likes": 311,
        "popularity": 0.67,
        "reads": 25644,
        "tags": [
            "tech",
            "history"
        ]
    },
    {
        "author": "Elisha Friedman",
        "authorId": 8,
        "id": 13,
        "likes": 230,
        "popularity": 0.31,
        "reads": 64058,
        "tags": [
            "design",
            "tech"
        ]
    },
    {
        "author": "Lainey Ritter",
        "authorId": 1,
        "id": 15,
        "likes": 560,
        "popularity": 0.8,
        "reads": 81549,
        "tags": [
            "culture",
            "startups",
            "tech"
        ]
    },
];


let test1 = [
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
    },
    {
        "author": "Adalyn Blevins",
        "authorId": 11,
        "id": 12,
        "likes": 590,
        "popularity": 0.32,
        "reads": 80351,
        "tags": [
            "tech"
        ]
    },
    {
        "author": "Trevon Rodriguez",
        "authorId": 5,
        "id": 14,
        "likes": 311,
        "popularity": 0.67,
        "reads": 25644,
        "tags": [
            "tech",
            "history"
        ]
    },
    {
        "author": "Elisha Friedman",
        "authorId": 8,
        "id": 13,
        "likes": 230,
        "popularity": 0.31,
        "reads": 64058,
        "tags": [
            "design",
            "tech"
        ]
    },
    {
        "author": "Lainey Ritter",
        "authorId": 1,
        "id": 15,
        "likes": 560,
        "popularity": 0.8,
        "reads": 81549,
        "tags": [
            "culture",
            "startups",
            "tech"
        ]
    },
];

let yo = mergeSortPosts(test, "popularity ", "asc");
//console.log(yo);
let yoo = mergeSortPosts(test1, "popularity", "dsc");
//console.log(yoo);

app.checkDuplicate = checkDuplicate;
module.exports = app;
