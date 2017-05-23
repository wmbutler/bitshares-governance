var express = require('express');  
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
var api = express();

app.use(express.static(__dirname + '/dist'));

api.use(bodyParser.json());
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

api.post('/', function(req, res) {

  console.log(req.body.data);

  const config = {
    method: 'post',
    json: true,
    url: 'https://bitshares.openledger.info/wss',
    body: req.body.data,
  };

  request(config, function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(body);
        res.send(body);
      }
  });

})

api.listen(9000);

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV == 'production') {
  app.listen(8080);
}

