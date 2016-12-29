"use strict"; //For let
// Dependencies
const express = require("express");
const app = express();
const http = require("http");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Config
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').__express);
const urlencodedParser = bodyParser.urlencoded({ extended: false });
//const jsonParser = bodyParser.json();
const port = process.env.port || 3000;
let limitOfResults = 10; //Max number of results displayed per page, must be equal to resultsPerPage in main.js when not searching

function sanitizeString(str){
  str = str.replace(/([/\\<>"'])+/g,"");
  return str.trim();
};


//To fix the deprecated promise issue use native promises here, like so:
//mongoose.Promise = global.Promise; // Can't use it on Cloudnode, global.Promise only supported in ES6

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/test');  //For local testing

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //connected
});

let entrySchema = mongoose.Schema({
  name: String,
  comm: String,
  score: Number
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
let Entry = mongoose.model('Entry', entrySchema);

//Routes
app.get("/",function(req, res){
    res.render('index'); 
  }); 

app.get("/entries",function(req, res){
  let items = [];
  let pageToDisplay = req.query.pageToDisplay;
  let skipEntries = 0;
  if (pageToDisplay === "s") {

    limitOfResults = 100;

  }else if (pageToDisplay > 1) {
    limitOfResults = 10;
    skipEntries = (pageToDisplay*limitOfResults) - limitOfResults;
  };

  Entry.count(function (err, dbSize) {
    //If there are more entries than the limit, show the buttons for successive pages
    if (dbSize >= limitOfResults) {
      Entry.find(function(err, entries) {
        if(err) return console.error(err);
        //JSON for Angular ng-repeat
        entries.forEach(function (entry, i) {
          items.push({
            id: entry.id,
            name: entry.name,
            comm: entry.comm,
            score: entry.score,
            dbsize: dbSize //TODO: Optimize. See if I can send this to the client only once, instead of sending it with every item.
          });
        });

        res.json( items );
      }).sort( { score: -1 } ).limit( limitOfResults ).skip(skipEntries); 
    }else{
      limitOfResults = 10;
      //Otherwise, just display all the results
      Entry.find(function(err, entries) {
        if(err) return console.error(err);
        //JSON for Angular ng-repeat
        entries.forEach(function (entry, i) {
          items.push({
            id: entry.id,
            name: entry.name,
            comm: entry.comm,
            score: entry.score,
          });
        });
        res.json( items );
      }).sort( { score: -1 } ); 
    };
  });
});


app.post("/addentry", urlencodedParser , function(req, res){
  //Get new data and save it to db
  let nameVal = sanitizeString(req.body.username);
  let commVal = sanitizeString(req.body.comment);
  let scoreVal = sanitizeString(req.body.score);
  let newEntry = new Entry({ name: nameVal, comm: commVal, score: scoreVal});
  newEntry.save(function (err, newEntry) {
    if (err) return console.error(err);
  });
  res.send("");
  res.end();
});

app.put("/updateentry", urlencodedParser, function(req,res){
  let entryid = req.body.entryId;
  let nameVal = sanitizeString(req.body.username);
  let commVal = sanitizeString(req.body.comment);
  let scoreVal = sanitizeString(req.body.score);
  Entry.update(
    { "_id" : entryid },
    {
      $set: { name: nameVal, comm: commVal, score: scoreVal },
      }, function(err, results) {
        if (err) {console.log(err);};
        });
  res.send("");
  res.end();
});

//Google verification
app.get("/google792be884c8fe585c.html",function(req, res){
    res.render( "google792be884c8fe585c.html" );
});

//404 Route (Keep this as the last route)
app.get('*', function(req, res){
  res.status(404).end('404 \nPage not found');
});

app.listen(port);