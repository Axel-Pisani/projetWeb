// "use strict"

/*************
	EXPRESS
**************/ 
let express = require('express');
let app = express();

let mustache = require ('mustache-express');

let fileUpload = require('express-fileupload');


app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');
app.use('/views', express.static('../views'));
app.use(express.static('../model'));

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

app.use(fileUpload());


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

let isAdmin = function (req, res, next) {
	if(req.session.admin != true) {
		res.redirect('/');
		return;
	}
	next();
}//isAuthenticated

let isUser = function (req, res, next) {
	if(req.session.user === undefined) {
		res.redirect('/');
		return;
	}
	next();
}//isAuthenticated

let isRightUser = function (req, res, next) {
	if(req.session.user != req.params.id) {
		res.redirect('/login');
		return;
	}
	next();
}//isAuthenticated

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

//ok
app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/addNarg', isAdmin, (req, res) => {
	res.render('addNarg');
})

app.get('/userSettings', isUser, (req, res) => {
	let user = db.readUser(req.session.user);
	res.render('userSettings', user);
})//managementUser


/*****************
		POST
******************/
app.post('/create', (req, res) => {
	redirect('/');
});

 
//OK
app.post('/login', (req, res) => {
	if (req.body.name == undefined || req.body.password == undefined) {}
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


let usernameIsValide = function (data) {
	data.name = data.name.trim();
	let user = db.getUsernameOfUser(data.name);
	if (user.length != 0) {
		data.messageError = "username ou mot de passe invalide";
		return data;
	}
	return true;
}//usernameIsValide

let passwordIsValide = function (data) {
	data.password = data.password.trim();
	if (data.password === undefined || data.password != data.checkPassword || 
		data.password.length < 8 && data.password.length > 100) {
			data.messageError = "Erreur mot passe : il ne contien pas 8 à 100 caractères.";
			return data;
	}
	return true;
}//checkingPassword

let justifyIsValide = function (data) {
	let justify = data.justify.split('-');
	if (justify === undefined || justify[0] < 1960 || 
		(new Date().getFullYear() - parseInt(justify[0])) < 18) {
		data.messageError = "Majorité requise. Tes parents n'aimeraint pas que tu sois ici...";
		return data;
	}
	return true;
}//justifyIsValide

let telIsValide = function (data) {
	data.tel = data.tel.trim();
	if (data.tel === undefined/* || !regExTelFr.test(data.tel) || !regExTel.test(data.tel)*/) {
		data.messageError = "Numéro de téléphone invalide";
		return data;
	}
	return true;
}//telIsValide

let verificationUserData = function (data) {
	let user = usernameIsValide(data);
	if (user.messageError !== undefined && user.id != data.id)
		return data;
	delete data.messageError;

	user = passwordIsValide(data);
	if (user.messageError !== undefined) 
		return data;

	user = justifyIsValide(data);
	if (user.messageError !== undefined) 
		return data;

	user = telIsValide(data);
	if (user.messageError !== undefined) 
		return data;

	return data;
}//verificationUserData


//ajout reg exp pour les tel
//ajout reg exp pour pwd avec les espace au milieux en plus d'un trim pour les esapces autour
app.post('/signup', (req, res) => {	
	let dataIsCheck = verificationUserData(req.body);
	console.log(dataIsCheck)
	if (dataIsCheck.messageError !== undefined) {
		res.render('registerForm', dataIsCheck);
		return;
	}
	user = db.createUser(dataIsCheck);
	req.session = {authenticated: true, user: user.id};
	res.redirect('/');
});


app.post('/addNarg', isAdmin, (req, res) => {
	console.log(req);
	console.log(req.files.image);
	if (!req.files || Object.keys(req.files).length === 0)
    	return res.status(400).send('No files were uploaded.');

  	let sampleFile = req.files.sampleFile;

  	sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
	    if (err)
			return res.status(500).send(err);

		res.send('File uploaded!');
  	});
});


app.post('/userSettings/:id', isRightUser, (req, res) => {
	req.body.id = req.params.id;
	let dataIsCheck = verificationUserData(req.body);
	if (dataIsCheck.messageError === undefined) {
		db.updateUser(dataIsCheck);
	}
	res.render('userSettings', dataIsCheck);
});


app.use((req, res, next) => {
	res.status(404).redirect('error');
	next();
});//error


app.listen(3000, () => console.log('listening on http://127.0.0.1:3000'));