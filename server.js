var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./data.db');
var jc = require('json-2-csv');
var cookieParser = require('cookie-parser');
var moment = require('moment');
var http = require('http');
var URL = require('url');
var request = require('request');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1W5FMdfp0GbGhbS0PztZpgYDAPHvhwek_icVLzf62Riw');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', router);


db.run("CREATE TABLE IF NOT EXISTS Data(user_id INTEGER PRIMARY KEY AUTOINCREMENT, fullname varchar(40) NOT NULL, date datetime NOT NULL, route varchar(1), estimatesex1 varchar(15), estimateno1 varchar(1), estimatesex2 varchar(15), estimateno2 varchar(1), estimatesex3 varchar(15), estimateno3 varchar(1), question1 varchar(10), comment1 varchar(1000), question2 varchar(10), comment2 varchar(1000), question3 varchar(10), comment3 varchar(1000));");

router.get('/', function(req,resp){
    fs.readFile('html/index.html', function (err, data) {
        if (err) console.log(err);
        resp.writeHead(200, {'Content-Type': 'text/html'});
        resp.write(data);
        resp.end();
    });
});


router.post('/submit', function(req, resp){
    query = "INSERT INTO Data(fullname, date, route, estimatesex1, estimateno1, estimatesex2, estimateno2, estimatesex3, estimateno3, question1, comment1, question2, comment2, question3, comment3) VALUES('" +
        req.body.name + "', '" + req.body.date + "', '" + req.body.route + "', '" + req.body.estimatesex1 +
        "', '" + req.body.estimateno1 + "', '" + req.body.estimatesex2 + "', '" +
        req.body.estimateno2 + "', '" + req.body.estimatesex3 + "', '" + req.body.estimateno3 +
        "', '" + req.body.question1 + "', '" + (req.body.comment1).replace(new RegExp("\'", "g"),"\'\'") + "', '" +
        req.body.question2 + "', '" + (req.body.comment2).replace(new RegExp("\'", "g"),"\'\'") + "', '" +
        req.body.question3 + "', '" + (req.body.comment3).replace(new RegExp("\'", "g"),"\'\'") +"')";
    db.run(query);
    doc.useServiceAccountAuth(creds, function (err) {
        doc.addRow(1, req.body, function(err) {
            if(err) {
                console.log(err);
            }
        });
    });
    resp.end();
});


router.use('/assets', express.static('html/assets'));
app.use('/node_modules/bootstrap/dist/css/', express.static('node_modules/bootstrap/dist/css/'));
app.use('/node_modules/bootstrap/dist/js/', express.static('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'));
app.use('/node_modules/jquery', express.static('node_modules/jquery'));
app.use('/node_modules/popper.js/dist', express.static('node_modules/popper.js/dist'));
app.use('/node_modules/bootstrap/dist/js', express.static('node_modules/bootstrap/dist/js'));
app.use('/node_modules/js-cookie/src', express.static('node_modules/js-cookie/src'));

app.listen(8091, function(){
    console.log("Server is running on http://127.0.0.1:8091/");
});