// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine', 'ejs');

app.use(express.static('views'));
app.use(bodyParser.urlencoded());

var urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};




// ----------------------------------------------------------- //
// ----------------------------------------------------------- //
// ----------------------------------------------------------- //

app.get("/urls/new", (req, res) => {
  //let templateVars = { shortURL: req.params.id };
  res.render("urls_new");
});

app.post('/urls/', (req, res) =>{
  urlDatabase[randomString()] = req.body.longURL;
  console.log(urlDatabase);
  res.send(req.body);
  res.redirect('/urls.json')
})

app.get('/u/:shortURL', (req, res) => {
  var longURL;
  const sURL = req.params.shortURL
 if(urlDatabase.hasOwnProperty(sURL)){
    longURL = urlDatabase[sURL];
    res.redirect(longURL);
  }
  else res.redirect('/urls')
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { URL: req.params.id };
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













