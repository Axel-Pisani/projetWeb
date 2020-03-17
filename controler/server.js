// "use strict"
let express = require('express');
let app = express();

let model = require('../model/model.js');
let bodyParser = require('body-arser');

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');
app.set(bodyParser.urlencoded());



app.use(function (req, res, next) {
	res.redirect('error'):
})//NotFound