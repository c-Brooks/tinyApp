// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

const PORT = process.env.PORT || 8080; // default port 8080
app.set('view engine', 'ejs');

app.use(express.static('views'));
app.use(bodyParser.urlencoded());

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.use(methodOverride('_method'));


const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";
console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);


var db;


MongoClient.connect(MONGODB_URI, function(err, database1) {
  //const collection = database.collection('test');
  if (err) return console.log(err);
  db = database1;
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});



// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //



// SHOW ALL
app.get('/urls', (req, res) => {
  db.collection('test').find().toArray( (err, result) => {
    console.log(result);
     res.render('urls_index', {urls: result});
  });
});

// CREATE NEW
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls/', (req, res) => {
var shortURL = randomString();
  db.collection('test').insert({ shortURL: shortURL, longURL: req.body.longURL },  function(err) {
    if (err) return res.redirect('/new');
    res.redirect('/urls');
  });
});

// DELETE
app.delete('/urls/:id', (req, res) => {
  console.log(req.params.id);
  db.collection('test').removeOne({shortURL: req.params.id});
  res.redirect('/urls');
  });


// PUT
app.put('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls')

  db.collection('test').updateOne( {'shortURL': req.params.id},
    {$set:{'longURL': req.body.longURL}}, (err, result) => {
    res.render('urls_show', {urls: result[0]});
  });
});


// GO TO URL
app.get('/u/:id', (req, res) => {
  db.collection('test').findOne( {'shortURL': req.params.id}, (err, result) => {
   res.redirect(result.longURL);
  });
});

// SHOW INDIVIDUAL
app.get('/urls/:id', (req, res) => {
  var shortURL = req.params.id;
  db.collection('test').findOne({'shortURL': shortURL}, (err, result) => {
    res.render('urls_show', {urls: result});
    });
  });




function randomString() {
  const baseNum = 36, length = 6
  return Math.round((Math.pow(baseNum, length-1) - Math.random() *
          Math.pow(baseNum, length))).toString(baseNum).slice(1);
}



