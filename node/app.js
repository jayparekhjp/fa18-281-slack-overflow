var express=require("express");
var bodyParser=require('body-parser');
const port = 8012;
// var connection = require('./config');
var app = express();
app.set('view engine', 'ejs');

var request = require('request');
var Cookies = require('cookies')
var http = require('http');
var cookie = require('cookie');
var Client = require('node-rest-client').Client;
var keys = ['keyboard cat']


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); 


// var authenticateController=require('./controllers/authenticate-controller');
// var registerController=require('./controllers/register-controller');
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    var cookies = parseCookies(req);  
   var name = cookies.username;
   console.log(name);
   res.render('home',{
    name : name
   });
})  
 
app.get('/login', function (req, res) {  
   res.sendFile( __dirname + "/views/" + "login.html" );  
})  
 
/*app.get('/restraunts', function (req, res) {
    var cookies = parseCookies(req);  
   var name = cookies.username;
   console.log(name);
   res.render('search',{
    name : name
   });
})  */

app.get('/restraunts', function (req, res) {
  var client = new Client();
  var pin = req.query.pin;
  var args = {
      parameters: { "zip": pin } // request headers
  };
  console.log(pin)
  client.get("http://localhost:3000/restraunts",args, function (data, response) { // CHANGE to broadcsat address for docker
      console.log(data);
      res.render('search',{
        data:data
      });
  });
});


app.get('/menu', function (req, res) {
  var client = new Client();
  var res_id = req.query.id;
  var args = {
      parameters: { "restraunt_id": res_id } // request headers
  };
  var cookies = new Cookies(req, res, { keys: keys })
  cookies.set('restraunt_id', res_id, { signed: false })

  client.get("http://localhost:3000/menus",args, function (data, response) {
      // console.log(data[0]['name']);
      res.render('menu',{
        data:data
      });
  });

});

app.listen(port, function () {
  console.log("Server is running on "+ port +" port");
});


