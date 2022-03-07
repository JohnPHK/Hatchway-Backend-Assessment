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
    if (!query.tags) return res.status(400).send("Tags parameter is required");

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
