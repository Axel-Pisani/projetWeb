// "use strict"
let express = require('express');
let app = express();

let mustache = require ('mustache-express');

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');

let bodyParser = require('body-parser');
let db = require('../model/model');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('index');
});


// app.get('/create', (req, res) => {
// 	res.render('create');
// });

app.get('/signup', (req, res) => {
	res.render('registerForm');
});


// /*	  post    */

// app.post('/create', (req, res) => {
//     redirect('/');
// });

app.post('/signup', (req, res) => {
	let data = req.body;
	let justify = data.justify.split('-');
	let date = new Date();
	if (justify[0] < 1960 || (date.getYear() - justify[0]) < 18) 
		res.redirect('/signup');
	let user = db.searchUser(data.tel, data.address);
	if (user !== null)
		//ajouter message erreur user existe deja
		res.redirect('/signup');
	// res.redirect('/userView');
	db.createUser(data);
	res.redirect('/');
	return;
});
// app.use( function (req, res, next) {
// 	res.redirect('error');
// })//error


app.listen(3000, () => console.log('listening on http://127.0.0.1:3000'));