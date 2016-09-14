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
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};

app.use(methodOverride('_method'));
/*
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
*/


// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //



// HOMEPAGE
app.get("/urls", (req, res) => {
  res.render("urls_index", {urls: urlDatabase});
});

// CREATE NEW
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post('/urls/', (req, res) =>{
  urlDatabase[randomString()] = req.body.longURL;
  res.redirect('/urls')
});

// DELETE
app.delete('/urls/:id', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
  });

// GO TO URL
app.get('/u/:shortURL', (req, res) => {
  var longURL;
  const sURL = req.params.shortURL
 if(urlDatabase.hasOwnProperty(sURL)){
    longURL = urlDatabase[sURL];
    res.redirect(longURL);
  }
  else res.redirect('/urls')
});


app.get("/url/:id", (req, res) => {
  let templateVars = { URL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



function randomString() {
  const baseNum = 36, length = 6
 return Math.round((Math.pow(baseNum, length-1) - Math.random() *
  Math.pow(baseNum, length))).toString(baseNum).slice(1);
}













