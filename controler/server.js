// "use strict"

/*************
	EXPRESS
**************/ 
let express = require('express');
let app = express();

let mustache = require ('mustache-express');

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');
app.use('/views', express.static('../views'));
// app.use(express.static('../views'));
app.use(express.static('../model'));

// app.use('/model', express.static(__dirname + '../model'));
// app.use('/assets', express.static(__dirname + '../model/assets'));

const MAX_AGE_COKKIE = new Date(Date.now() + 24*60*60*1000);

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

/************   
	COOKIE
*************/
let cookieSession = require('cookie-session');
app.use(cookieSession({
 	secure: false,
 	expires: MAX_AGE_COKKIE,
	httpOnly: true,
	overwrite: true,
  	keys: ['key1', 'key2']
}));


/***********
	MODEL    
************/ 
let db = require('../model/model');


/************************
		MIDDELWER    
*************************/ 
//bouble infinie
app.use((req, res, next) => {
	if(req.session.admin === true) {
		res.locals = {
			authenticated: true,
			user: req.session.user,
			admin: true
		};
		return next();
	} else if (req.session.authenticated === true) {
		res.locals = {
			authenticated: true,
			user: req.session.user
		};
	}
	next();
});

// let isAuthenticated = function (req, res, next) {
// 	if(req.session.admin === true) {
// 		res.locals = {
// 			authenticated: true,
// 			admin: true
// 		};
// 		return next();
// 	} else if (req.session.authenticated !== undefined) {
// 		res.locals.authenticated = true;
// 	}
// 	next();
// }//isAuthenticated


/******************
		GET
******************/
app.get('/', (req, res) => {
	res.render('index');
});


//OK
app.get('/listNarg', (req, res) => {
	let narg = db.getNarguile();
	res.render('listNarg', {narg});
});


//Marche pas
app.get('/infoNarg/:id', (req, res) => {
	let narg = db.searchNargile(req.params.id);
	res.render('info-narg', narg);
});


//OK
app.get('/signup', (req, res) => {
	res.render('registerForm');
});


//OK
app.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/');
});


app.get('/userSettings', (req, res)=> {
	res.render('userSettings');
});


//ok
app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/addNarg', (req, res) => {
	res.render('addNarg');
})

// app.get('/managementUser', (req, res) =>{
// 	res.render('managementUser');
// })//managementUser


/*****************	  
		POST
******************/
app.post('/create', (req, res) => {
	redirect('/');
});



//OK
app.post('/login', (req, res) => {
	let user = db.searchUser(req.body.name, req.body.password);
	if (user != undefined) {
		req.session = {user: user.id};
		if (user.role == "admin")
			req.session.admin = true;
		res.redirect('/');
		return;
	}
	res.status(404).redirect('/login');
});//login


//ne renvoi pas les donnes dans template
//ajout reg exp pour les tel
//ajout reg exp pour pwd avec les espace au milieux en plus d'un trim pour les esapces autour
//ajout id user dans session
app.post('/signup', (req, res) => {
	let data = req.body;
	data.name = data.name.trim();
	data.password = data.password.trim();
	let user = db.searchUser(data.name.trim(), data.password.trim());
	if (user !== undefined) {
		data.messageError = "username déjà utilisé !";
		res.render('registerForm', data);
		return;
	}
	if (data.password === undefined || data.password !== data.checkPassword ||
		data.password.length < 8 && data.password.length > 100) {
		data.messageError = "Le mot de passe doit avoir entre 8 et 100 caractères.";
		res.render('registerForm', data);
		return;
	}

	let justify = data.justify.split('-');
	if (justify === undefined || justify[0] < 1960 || 
		(new Date().getFullYear() - parseInt(justify[0])) < 18) {
		data.messageError = "Majorité requise. Tes parents n'aimeraint pas que tu sois ici...";
		res.render('registerForm', data);
		return;
	}

	data.tel = data.tel.trim();
	if (data.tel === undefined || !regExTelFr.test(data.tel) || !regExTel.test(data.tel)) {
		data.messageError = "Numéro de téléphone invalide";
		res.render('registerForm', data);
		return;
	}
	user = db.createUser(data);
	req.session = {authenticated: true, user: user.id};
	res.redirect('/');
});


app.post('/addNarg', (req, res) => {

})


let isEmpty = function (string) {
	return string.length === 0 && string[0] === undefined;
}//isEmtpy


app.use( function (req, res, next) {
	res.status(404).redirect('error');
})//error


app.listen(3000, () => console.log('listening on http://127.0.0.1:3000'));