/*************
	MODULE
**************/
let formidable = require('formidable');
let mustache = require ('mustache-express');
let crypto = require('crypto');
let bodyParser = require('body-parser');
let cookieSession = require('cookie-session');


/***********
	MODEL    
************/ 
let db = require('../model/model');


/*************
	EXPRESS
**************/
let express = require('express');
let app = express();

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');

/************************
		MIDDELWER    
*************************/ 
app.use('/views', express.static('../views'));
app.use('/model', express.static('../model'));
app.use('/assets', express.static('../model/assets'))
app.use(express.static('../model'));
app.use(express.static('../model/assets'));
app.use(bodyParser.urlencoded({ extended: false }));

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


/************   
	COOKIE
*************/
const MAX_AGE_COKKIE = new Date(Date.now() + 24*60*60*1000);
app.use(cookieSession({
	secure: false,
	expires: MAX_AGE_COKKIE,
	httpOnly: true,
	overwrite: true,
	keys: ['key1', 'key2']
}));

app.use((req, res, next) => {
	if(req.session.admin) {
		res.locals = {
			user: req.session.user,
			admin: true
		};
		return next();
	} else if (req.session.user) {
		res.locals = {
			user: req.session.user
		};
	}
	next();
});

/******************
		GET
******************/
app.get('/', (req, res) => {
	res.render('index');
});


app.get('/signup', (req, res) => {
	res.render('registerForm');
});

app.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/userSettings', isUser, (req, res) => {
	let user = db.readUser(req.session.user);
	res.render('userSettings', user);
});//managementUser


app.get('/listNarg', (req, res) => {
	let narg = db.getNarguile();
	res.render('listNarg', {narg});
});

app.get('/infoNarg/:id', (req, res) => {
	let narg = db.searchNargile(req.params.id);
	res.render('info-narg', narg);
});

app.get('/addNarg', isAdmin, (req, res) => {
	res.render('addNarg');
});


app.get('/intermediaryNargManagment', isAdmin, (req, res) => {
	let nargs = db.getNarguileManagement();
	res.render('intermediaryManagment', {nargs});
});

app.get('/dbNargset/:id', isAdmin, (req, res) => {
	let narg = db.searchNargile(req.params.id);
	res.render('dbManagment', {narg});
});

app.get('/userManagment', isAdmin, (req, res) => {
	// let users = db.
	res.render('dbManagment');
});

app.get('/rentalManagment', isAdmin, (req, res) => {
	// let  
	res.render('dbManagment');
});


/*****************
		POST
******************/
//methode non implémenté
app.post('/create', (req, res) => {
	redirect('/');
});

app.post('/login', (req, res) => {
	if (req.body.name == undefined || req.body.password == undefined) {
		let messageError = {messageError: "identifiant ou mot de passe manquant"};
		return res.status(404).render('login', messageError);
	}
	req.body.password = createHash(req.body.password);
	let user = db.searchUser(req.body.name, req.body.password);
	if (user != undefined) {
		req.session = {user: user.id};
		if (user.role == "admin")
			req.session.admin = true;
		return res.redirect('/');
	}
	let messageError = {messageError: "identifiant ou mot de passe manquant"};
	res.status(404).render('login', messageError);
});//login


//en cours d'implémentations
app.post('/signup', (req, res) => {	
	let dataIsCheck = verificationUserData(req.body);
	if (dataIsCheck.messageError !== undefined) {
		res.render('registerForm', dataIsCheck);
		return;
	}
	dataIsCheck.password = createHash(dataIsCheck.password);
	db.createUser(dataIsCheck);
	user = db.searchUser(dataIsCheck.name, dataIsCheck.password);
	req.session = {authenticated: true, user: user.id};
	res.redirect('/');
});

//en cours d'implémentations
app.post('/addNarg', isAdmin, (req, res) => {
 //    var form = new formidable.IncomingForm();
	// if (!req.files || Object.keys(req.files).length === 0)
 //    	return res.status(400).send('No files were uploaded.');

 //  	let sampleFile = req.files.image;
 //  	sampleFile.mv('../model/assets/' + req.files.image.name, function(err) {
	//     console.log(err)
	//     if (err)
	// 		return res.status(500).render(err);
 //  	});
});


app.post('/userSettings/:id', isRightUser, (req, res) => {
	req.body.id = req.params.id;
	let dataIsCheck = verificationUserData(req.body);
	if (dataIsCheck.messageError === undefined) {
		dataIsCheck.password = createHash(dataIsCheck.password);
		db.updateUser(dataIsCheck);
	}
	res.render('userSettings', dataIsCheck);
});


app.use((req, res, next) => {
	res.status(404).redirect('error');
	next();
});//error


/*********************
		METHOD
**********************/
let usernameIsAvailable = function (data) {
	data.name = data.name.trim();
	if (data.name === undefined) {
		data.messageError = "le username est manquant";
		return data;
	}
	let user = db.getUsernameOfUser(data.name);
	if (user.length != 0) {
		data.messageError = "username invalide";
	}
	return data;
}//usernameIsAvailable

let usernameIsUseed = function (data, userSessId) {
	data.name = data.name.trim();
	if (data.name === undefined) {
		data.messageError = "le username est manquant";
		return data;
	}
	let users = db.getUsernameOfUser(data.name);
	if (users.length != 0) {
		for (let i = 0; i < users.length; i++) {
			if (userSessId == users[i].id)
				return data;
		}
		data.messageError = "username ou mot de passe invalide";
	}
	return data;
}//usernameIsUseed

let passwordIsValide = function (data) {
	data.password = data.password.trim();
	if (data.password === undefined || data.password != data.checkPassword || 
		data.password.length < 8 && data.password.length > 100) {
			data.messageError = "Erreur mot passe : il doit contenir entre 8 à 100 caractères.";
			return data;
	}
}//checkingPassword

let justifyIsValide = function (data) {
	let justify = data.justify.split('-');
	if (justify === undefined || justify[0] < 1960 || 
		(new Date().getFullYear() - parseInt(justify[0])) < 18) {
		data.messageError = "Majorité requise. Tes parents n'aimeraint pas que tu sois ici...";
		return data;
	}
}//justifyIsValide

let telIsValide = function (data) {
	data.tel = data.tel.trim();
	if (data.tel === undefined/* || !regExTelFr.test(data.tel) || !regExTel.test(data.tel)*/) {
		data.messageError = "Numéro de téléphone invalide";
		return data;
	}
}//telIsValide

let verificationUserData = function (data, userSessId) {
	let messError = usernameIsAvailable(data);
	if (messError !== undefined)
		return data;

	messError = passwordIsValide(data);
	if (messError !== undefined) 
		return data;

	messError = justifyIsValide(data);
	if (messError !== undefined) 
		return data;

	messError = telIsValide(data);
	if (messError !== undefined) 
		return data;

	return data;
}//verificationUserData

let createHash = function (password) {
	let hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}//createHash


app.listen(3000, () => console.log('listening on http://127.0.0.1:3000'));