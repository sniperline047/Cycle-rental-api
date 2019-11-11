var express = require('express');
var app = express();
var http = require('http').createServer(app);
var cors = require('cors');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

var Users = require('./routes/Users.js');

app.use('/users',Users)

http.listen(port, () => {
	console.log("Server is running on port:" + port);
})
