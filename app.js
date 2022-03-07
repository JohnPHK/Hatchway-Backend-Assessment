const express = require('express');
const https = require('https');
const axios = require('axios');
const app = express();


app.get('/api/ping', (req, res) => {
    res.send({"success": true});
});

app.get('/api/posts', (req, res) => {
    let posts = [];
    const query = req.query  
    if (!query.tags) return res.status(400).send("Tags parameter is required");

    const tagList = query.tags.split(',');

    let test = []

    for (const tag of tagList) {
        axios.get("https://api.hatchways.io/assessment/blog/posts?tag=" + tag).
            then(tag => {console.log(tag.data)});
    }

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
