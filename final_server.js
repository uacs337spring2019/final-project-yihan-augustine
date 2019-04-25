
// CSC 337
// Yihan Mo & Augustine Xu
// Final project server code

const express = require("express");//express module
const app = express();
var fs = require('fs');//read file module
const bodyParser = require('body-parser');//body-parser module
const jsonParser = bodyParser.json();


app.use(function(req, res, next) {//use function
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

app.post('/', jsonParser, function (req, res) {//post function
    const name = req.body.name;//name
    const score = req.body.score;//message
    const filecontent = name + ':::' + score;//string append to file
    fs.appendFile("messages.txt","\n", function(err){ 
        if(err) {
            res.send("Error");
            console.log(err);
        }
    });
    fs.appendFile('scores.txt', filecontent, function(err) {//append to file
        if(err) {
            res.send("Error");
            console.log(err);//return error message
        }
        console.log("The file was saved!");//if it is saved successfully
    });
    res.send("The file was saved!");//send string
});

app.get('/', function (req, res) {//get function
    res.header("Access-Control-Allow-Origin", "*");
    var line;//empty json variable
    var data =[];//empty list
    file = fs.readFileSync('scores.txt', 'utf8');//readfile
    file = file.trim().split('\n');//split into a list
    for (var i =0; i <file.length; i++){//iterate through list
        var temp = file[i].split(":::");//split name and comment
        data.push({"name":temp[0], "score":temp[1]});//add to the data list
    }
    function sortscore(a,b){
        return b.score-a.score;
    }
    data.sort(sortscore);
    line = {"record":data};//create the json
    res.send(JSON.stringify(line));//send json back
    

})

app.listen(process.env.PORT);

