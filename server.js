var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('./'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
var port = 3060;
app.listen(port);

console.log('server running at port ' + port);