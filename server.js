// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();

const PORT = process.env.PORT || 8080; // default port 8080
app.set('view engine', 'ejs');

app.use(express.static('views'));
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.use(cookieParser());

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);

var db;

MongoClient.connect(MONGODB_URI, function(err, database1) {
  if (err) return console.log(err);
  db = database1;
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});



// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //

app.post('/login', (req, res) => {
  res.cookie('userName', req.body.userName, {maxAge: 900000, httpOnly: true});
  res.redirect('/');
});

app.post('/logout', (req, res) => {
  res.clearCookie('userName');
  res.redirect('/');
});




// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //



// REDIRECT
app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  res.redirect('/urls/new')
  });

// SHOW ALL
app.get('/urls', (req, res) => {
  db.collection('test').find().toArray( (err, result) => {
    res.render('urls_index', {urls: result, userName: req.cookies.userName});
  });
});

// CREATE NEW
app.get('/urls/new', (req, res) => {

  res.render('urls_new', {userName: req.cookies['userName']});
});

app.post('/urls', (req, res) => {
var shortURL = randomString();
  db.collection('test').insert({ shortURL: shortURL, longURL: req.body.longURL },  function(err) {
    if (err) return res.redirect('/new');
    res.redirect('/urls');
  });
});

// DELETE
app.delete('/urls/:id', (req, res) => {
  db.collection('test').removeOne({shortURL: req.params.id});
  res.redirect('/urls');
  });

// SHOW ONE URL
app.get('/urls/:id', (req, res) => {
  var shortURL = req.params.id;
  db.collection('test').findOne({'shortURL': shortURL}, (err, result) => {
    res.render('urls_show', {urls: result, userName: req.cookies['userName']});
    });
  });

// EDIT ONE URL
app.put('/urls/:id', (req, res) => {
  db.collection('test').updateOne( {'shortURL': req.params.id},
    {$set:{'longURL': req.body.longURL}}, (err, result) => {
      res.redirect('/urls')
  });
});


// REDIRECT TO LONG URL
app.get('/u/:id', (req, res) => {
  db.collection('test').findOne( {'shortURL': req.params.id}, (err, result) => {
// If address does not begin with http://, add it in
    if(!/^((http|https|ftp):\/\/)/.test(result.longURL)) {
      result.longURL = "http://" + result.longURL;
    }
    console.log(result.longURL);
    res.redirect(result.longURL);
  });
});

// Creating a random string for use as the ('''''''unique'''''''') shortLink
function randomString() {
  const baseNum = 36, length = 6
  return Math.round((Math.pow(baseNum, length-1) - Math.random() *
          Math.pow(baseNum, length))).toString(baseNum).slice(1);
}



