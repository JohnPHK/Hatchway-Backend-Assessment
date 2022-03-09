//server.js
const app = require("./app");
const port = process.env.PORT || 3000;


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

console.log(app.checkDuplicate(lst1, dct1));
console.log(app.checkDuplicate(lst1, dct2));


app.listen(port, () => { console.log(`Listening on port ${port}...`) });
