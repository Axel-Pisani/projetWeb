// "use strict"
let express = require('express');
let app = express();

let mustache = require ('mustache-express');

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');
app.use('/views', express.static(__dirname + '../views'));

let cookieSession = require('cookie-session');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

let db = require('../model/model');

app.use(cookieSession({
  secret: 'MotDePassePourMesCookiesSessions',
}));


app.use((req, res, next) => {
	if(req.session.login !== undefined) {
		res.locals.authenticated = true;
		return next();
	}
	next();
});

// let isAuthenticated = function (req, res, next) {
// 	if(req.session.login !== undefined) {
// 		res.locals.authenticated = true;
// 		return next();
// 	}
// 	next();
// }//is_authenticated


/*	  GET    */


app.get('/', (req, res) => {
	res.render('index');
});


app.get('/listNarg', (req, res) => {
	let narg = db.getNarguile();
	res.render('listNarg', {narg});
});

app.get('/infoNarg/:id', (req, res) => {
	let narg = db.searchNarg(req.params.id);
	console.log(narg.teteDesc);
	res.render('infoNarg', {narg})
})

app.get('/signup', (req, res) => {
	res.render('registerForm');
});


app.get('/signout', (req, res) => {
	req.session = null;
	// req.sessionOptions.maxAge = new Date();
	res.redirect('/');
});


app.get('/signin', (req, res) => {
	// let user = db.
	req.session.login = true;
	res.redirect('/listNarg');
});


/*	  POST    */

app.post('/create', (req, res) => {
    redirect('/');
});

// app.post('/signup', (req, res) => {
// 	let data = req.body;
// 	let justify = data.justify.split('-');
// 	let date = new Date();
// 	if (justify[0] < 1960 || (date.getYear() - justify[0]) < 18) 
// 		res.redirect('/signup');
// 	let user = db.searchUser(data.tel, data.address);
// 	if (user !== null)
// 		//ajouter message erreur user existe deja
// 		res.redirect('/signup');
// 	// res.redirect('/userView');
// 	db.createUser(data);
// 	req.locals = true;
// 	res.redirect('/');
// 	return;
// });



// app.use( function (req, res, next) {
// 	res.redirect('error');
// })//error


app.listen(3000, () => console.log('listening on http://127.0.0.1:3000'));