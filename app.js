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
//Note that if there is a duplicate post, it returns false and true if there isn't
function checkDuplicate(postsAccumulated, candidatePost){
    for (let i = 0; i < postsAccumulated.length; i++) {
        if (equalDicts(postsAccumulated[i], candidatePost)) return false
    }
    return true
};
//This is to make the function above accessible from other JS files
app.checkDuplicate = checkDuplicate;


//Parses the tags
function parseTags(tags) {
    const tagList = tags.split(',').map(tag => tag.trim());
    return tagList;
};
//This is to make the function above accessible from other JS files
app.parseTags = parseTags;


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
//This is to make the function above accessible from other JS files
app.equalDicts = equalDicts;


//Validate if the parameters (sortBy and direction) are valid
function validateParams(sortBy, direction) {
    validSortBy = ["id", "reads", "likes", "popularity"];
    validDirections = ["asc", "desc"];
    return validSortBy.includes(sortBy) && validDirections.includes(direction);
}
//This is to make the function above accessible from other JS files
app.validateParams = validateParams;


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
//This is to make the function above accessible from other JS files
app.mergeSortPosts = mergeSortPosts;


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
//This is to make the function above accessible from other JS files
app.merge = merge;



module.exports = app;
