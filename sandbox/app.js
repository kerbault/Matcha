const fs = require("fs");
const data = fs.readFileSync('texte.txt');

console.log(data.toString());
console.log("Program Ended");

console.log("-----------------------------");

fs.readFile('texte.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});

console.log("Program Ended");

fs.readFile('texte.txt', (test, data) => {
    if (test) throw console.error(err);
    console.log(data.toString());
});

