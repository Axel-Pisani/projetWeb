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
		return next();
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
});


app.get('/listNarg', (req, res) => {
	let narg = db.getNarguile();
	res.render('listNarg', {narg});
});

app.get('/infoNarg/:id', (req, res) => {
	let narg = db.searchNargWithAllElement(req.params.id);
	narg.manche = db.getManche();
	narg.tuyau = db.getTuyau();
	narg.tete = db.getTete();
	narg.diffuseur = db.getDiffuseur();
	narg.gout = db.getGout();
	res.render('info-narg', narg);
});

app.get('/addNarg', isAdmin, (req, res) => {
	res.render('addNarg');
});

app.get('/shoppingcart/:id', isRightUser, (req, res) => {
	let rentals = db.getRental(req.params.id);
	for (let i = 0; i < rentals.length; ++i) {
		rentals[i].idNarg = db.searchNarg(rentals[i].idNarg);
		rentals[i].idManche = db.searchManche(rentals[i].idManche);
		rentals[i].idTete = db.searchTete(rentals[i].idTete);
		rentals[i].idTuyau = db.searchTuyau(rentals[i].idTuyau);
		rentals[i].idDiffuseur = db.searchDiffuseur(rentals[i].idDiffuseur);
		rentals[i].idGout = db.searchGout(rentals[i].idGout);
	}
	res.render('shoppingCart', {rentals});
});

app.get('/intermediaryNargManagment', isAdmin, (req, res) => {
	let nargs = db.getNarguileManagement();
	res.render('intermediaryManagment', {nargs});
});

app.get('/intermediaryUserManagment', isAdmin, (req, res) => {
	let users = db.getUsers();
	res.render('intermediaryManagment', {users});
});


app.get('/dbNargset/:id', isAdmin, (req, res) => {
	let narg = db.searchNargWithAllElement(req.params.id); 
	res.render('dbManagment', {narg});
});


app.get('/rentalManagment', isAdmin, (req, res) => {
	res.render('dbManagment');
});

app.get('/deleteUser/:id', isRightUser, (req, res) => {
	let deleteUser = db.deleteUser(req.params.id);
 	req.session = null;
	res.redirect('/');
});

/*****************
		POST
******************/
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
});


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


app.post('/addNarg', isAdmin, (req, res) => {
	let data = req.body;
	checkNewNarg(data);
	if (data.messageError == undefined) {
		let newNarg = db.createNarg(data);
		data.message = "nargrgilé enregistré!";
		return res.redirect('/infoNarg/' + newNarg.lastInsertRowid);
	}
	res.render('addNarg', data);
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

app.post('/updateNarg/:id', isAdmin, (req, res) => {
	let nargData = req.body;
	if (!checkQuantity(nargData.quantity) ||
		!checkMarqRef(nargData.marque) ||
		!checkMarqRef(nargData.reference)) {
		return res.render('dbManagment', nargData);
	}
	db.updateNarg(nargData);
	res.render('dbManagment', nargData);
});

app.post('/updateManche/:id', isAdmin, (req, res) => {
	let data = req.body;
	if (!checkQuantity(data.quantity) ||
		!checkDesc(data.description)) {
		return res.render('dbManagment', data);
	}
	db.updateManche(data);
	res.render('dbManagment', data);
});

app.post('/updateTuyau/:id', isAdmin, (req, res) => {
	let data = req.body;
	if (!checkQuantity(data.quantity) ||
		!checkDesc(data.description)) {
		return res.render('dbManagment', data);
	}
	db.updateTuyau(data);
	res.render('dbManagment', data);
});

app.post('/updateTete/:id', isAdmin, (req, res) => {
	let data = req.body;
	if (!checkQuantity(data.quantity) ||
		!checkDesc(data.description)) {
		return res.render('dbManagment', data);
	}
	db.updateTete(data);
	res.render('dbManagment', data);
});

app.post('/updateDiffuseur/:id', isAdmin, (req, res) => {
	let data = req.body;
	if (!checkQuantity(data.quantity) ||
		!checkDesc(data.description)) {
		return res.render('dbManagment', data);
	}
	db.updateDiffuseur(data);
	res.render('dbManagment', data);
});

app.post('/newRental/:id', isUser, (req, res) => {
	let dataRental = req.body;
	if (checkNewRental(dataRental)) {
		db.newRental(dataRental, req.session.user, req.params.id);
		return res.redirect('/shoppingcart/' + req.session.user);
	}
	res.redirect('/infoNarg/' + req.params.id);
});

app.use((req, res, next) => {
	res.status(404).redirect('error');
	next();
});//error


/*********************
		METHOD
**********************/

/*
	Method check rental
*/
let checkNewRental = function(rentalData) {
	if (rentalData == undefined) {
		rentalData.messageError = 'Données invalide.';
		return false;
	}
	for (let keyRental  in rentalData) {
		let valueRental = rentalData[keyRental];
		console.log(valueRental)
		if (0 == 0) {
			rentalData.messageError = 'Données invalide, merci de les vérifier';
			return false;
		}
		let regExDate = new RegExp('date');
		let regExTime = new RegExp('timming');
		if (regExDate.test(keyRental)) {
			let startDataRental = Date.parse(valueRental);
			if (typeof startDataRental == NaN || startDataRental < Date.now()) {
				rentalData.messageError = 'Date de location invalide.';
				return false;
			}
			rentalData.date = startDataRental;
		} 
		else if (regExTime.test(keyRental)) {
			let timmingLocation = valueRental.split(":");
			if (timmingLocation[0] > 24) {
				rentalData.messageError = 'Durée de location invalide.';
				return false;
			}
			rentalData.timming = timmingLocation[0] * 60 * 60;
		} else {
			if (parseInt(valueRental) == NaN) {
				rentalData.messageError = 'Un problème a été rencontré dans l\'enregistrement de votre commande. Merci de réessayer ultérieurement.';
				return false;
			}
		}
	}
	return true;
}


/*
	Method check narg
*/
let checkNewNarg = function (nargData) {
	if (nargData == undefined) {
		return nargData = {messageError: "aucune donnée spécifié"};
	}
	for (let nargKey in nargData) {
		let nargValue = nargData[nargKey];

		let regEx = new RegExp('Pict|Quant|Desc|marq|ref');
		if (regEx.test(nargKey)) {
			continue;
		}

		if (regEx.test(nargKey)) {
			if (!checkQuantity(nargValue)) 
				return nargData.messageError = 'la valeur : "' + nargValue + '" n\'est pas correcte';
			continue;
		}

		if (regEx.test(nargKey)) {
			if (!checkDesc(nargValue))
				return nargData.messageError = 'la valeur : "' + nargValue + '" est incorrecte';
			continue;
		}

		if (regEx.test(nargKey)) {
			if (!checkMarqRef(nargValue))
				return nargData.messageError = 'la valeur : "' + nargValue + '" est mauvaise ou trop longue';
			continue;
		}
	}
}

let checkQuantity = function (quantity) {
	let regExNumber = new RegExp('[0-9]');
	if (quantity == undefined || !regExNumber.test(quantity))
		return false;
	return true;
}

let checkDesc = function (dataString) {
	if (dataString == undefined || dataString.length > 200) 
			return false;
	return true;
}

let checkMarqRef = function (dataString) {
	let regExNumber = new RegExp('[0-9]');
	if (dataString == undefined || dataString.length > 100 || 
		regExNumber.test(dataString)) 
			return false;
	return true;
}

/*
	METHOD CHECK USER
*/
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
	let messError = usernameIsUseed(data, userSessId);
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