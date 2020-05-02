/***********
	MODULE
************/

let sql = require('better-sqlite3');
let db = sql('../model/db.narguile');


/***************************
    CRUDS USER ADMIN    
****************************/
exports.createUser = function (data) {
	let query = db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,?);')
		.run(null, data.name, data.password, data.justify, data.address, data.tel,'user');
	return query;
}//create

exports.readUser = function (id) {
	let query = db.prepare('SELECT * FROM users WHERE id = ?;').get(id);
	return query; 
};//read

exports.updateUser = function (data) {
	let query = db.prepare('UPDATE users SET name = ?, password = ?, justify = ?, address = ?, tel = ? WHERE id = ?;')
				  .run(data.name, data.password, data.justify, 
					   data.address, data.tel, data.id);
	return query;
};//update

/***************************
	CRUDS MANAGEMENT USER
****************************/
exports.getUsers = function () {
	let query = db.prepare('SELECT * FROM users;').all();
	return query;
}

exports.deleteUser = function (id) {
	let query = db.prepare('DELETE FROM users WHERE id = ?;').get(id);
}//delete

exports.searchUser = function (name, password) {
	let query = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(name, password);
	return query;
}//search



/*    CRUDS MANAGEMENT NAGUILE    */

// exports.insertManche = function (data) {
// 	let 	return query;
// }

// exports.insertTuyau = function (data) {
// 	let query = 	return query;
// }

// exports.insertTete = function (data) {
// 	let query = 

// 	return query;
// }

// exports.insertDiffuseur = function (data) {
// 	let query = 

// 	return query;
// }

exports.createNarg = function (data) {
	let manche = db.prepare('INSERT INTO manche VALUES (?,?,?,?);')
				   .run(null, data.mancheQuant, data.mancheDesc, data.manchePict);
	
	let tete = db.prepare('INSERT INTO tete VALUES (?,?,?,?)')
				 .run(null, data.teteQuant, data.teteDesc, data.tetePict);
	
	let tuyau = db.prepare('INSERT INTO tuyau VALUES (?,?,?,?)')
				  .run(null, data.tuyauQuant, data.tuyauDesc, data.tuyauPict);
	
	let diffuseur = db.prepare('INSERT INTO diffuseur VALUES (?,?,?,?)')
					  .run(null, data.diffuseurQuant, data.diffuseurDesc, data.diffuseurPict);
	
	let query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);')
				  .run(null, data.nargQuant, data.marque, data.reference, manche.lastInsertRowid, 
				  	tuyau.lastInsertRowid, tete.lastInsertRowid, diffuseur.lastInsertRowid, data.nargPict);
	return query;
}

exports.getNarguileManagement = function () {
	let query = db.prepare('SELECT *, '+
		 'te.quantity AS "teteQuant", ' +
		 'te.description AS "teteDesc", ' +
		 'm.description AS "mancheDesc", ' +
		 'm.quantity AS "mancheQuant", ' +
		 't.description AS "tuyauDesc", ' +
		 't.quantity AS "tuyauQuant", ' +
		 'd.description AS "diffuseurDesc", ' +
		 'd.quantity AS "diffuseurQuant" ' +
		'FROM narguile n ' +
		 'JOIN manche m ON n.idManche = m.id ' +
		 'JOIN tuyau t ON n.idTuyau = t.id ' +
		 'JOIN diffuseur d ON n.idDiffuseur = d.id ' +
		 'JOIN tete te ON n.idTete = te.id ;').all();
	return query;
}



/*    METHOD    */

exports.getNarguile = function () {
	let narguile = db.prepare('SELECT * FROM narguile;').all();
	return narguile;
}//getNarguile

exports.getUsers = function () {
	let users = db.prepare('SELECT * FROM users;').all();
	return users;
}//getNarguile

exports.searchNargile = function (id) {
	let narguile = db.prepare('SELECT *, '+
		 'te.quantity AS "teteQuant", ' +
		 'te.description AS "teteDesc", ' +
		 'm.description AS "mancheDesc", ' +
		 'm.quantity AS "mancheQuant", ' +
		 't.description AS "tuyauDesc", ' +
		 't.quantity AS "tuyauQuant", ' +
		 'd.description AS "diffuseurDesc", ' +
		 'd.quantity AS "diffuseurQuant" ' +
		'FROM narguile n ' +
		 'JOIN manche m ON n.idManche = m.id ' +
		 'JOIN tuyau t ON n.idTuyau = t.id ' +
		 'JOIN diffuseur d ON n.idDiffuseur = d.id ' +
		 'JOIN tete te ON n.idTete = te.id ' +
		'WHERE n.id = ?').get(id);
	return narguile;
}


exports.getGout = function () {
	let query = db.prepare('SELECT * FROM gout;').all();
	return query;
}//getTuyau


exports.getTuyau = function () {
	let query = db.prepare('SELECT * FROM tuyau;').all();
	return query;
}//getTuyau

exports.getManche = function () {
	let query = db.prepare('SELECT * FROM manche;').all();
	return query;
}//getTuyau

exports.getTete = function () {
	let query = db.prepare('SELECT * FROM tete;').all();
	return query;
}//getTuyau

exports.getDiffuseur = function () {
	let query = db.prepare('SELECT * FROM diffuseur;').all();
	return query;
}//getDiffuseur


exports.getUsernameOfUser = function (username) {
	let query = db.prepare('SELECT * FROM users WHERE name = ?;').all(username);
	return query;
}

