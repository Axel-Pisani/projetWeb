/***********
	MODULE
************/

let sql = require('better-sqlite3');
let db = sql('../model/db.narguile');


/***************************
    CRUDS USER USERS    
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

exports.deleteUser = function (id) {
	let query = db.prepare('DELETE FROM location WHERE idUser = ?;').run(id);
	query = db.prepare('DELETE FROM users WHERE id = ?;').run(id);
	return query;
}//delete

exports.searchUser = function (name, password) {
	let query = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(name, password);
	return query;
}//search


/***************************
	CRUDS MANAGEMENT USER
****************************/
exports.getUsers = function () {
	let query = db.prepare('SELECT * FROM users;').all();
	return query;
}

exports.getRental = function (userID) {
	let query = db.prepare('SELECT * FROM location WHERE idUser = ? ;').all(userID);
	return query;
}

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


// id, idUser, idNarg, idManche, idTuyau, idTete, idGout, 
// idDiffuseur, startLoc, endLoc, isConfirmed
// exports.newRental = function (newRental) {
// 	let query = db.prepare('INSERT INTO location VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);')
// 				   .run(null, data.mancheQuant, data.mancheDesc, data.manchePict);
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
		 'te.photo AS "tetePhoto", ' +
		 'te.description AS "teteDesc", ' +
		 
		 'm.quantity AS "mancheQuant", ' +
		 'm.photo AS "manchePhoto", ' +
		 'm.description AS "mancheDesc", ' +
		 
		 't.quantity AS "tuyauQuant", ' +
		 't.photo AS "tuyauPhoto", ' +
		 't.description AS "tuyauDesc", ' +
		 
		 'd.quantity AS "diffuseurQuant", ' +
		 'd.photo AS "diffuseurPhoto", ' +
		 'd.description AS "diffuseurDesc" ' +
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
	quantityIsRight(narguile);
	return narguile;
}//getNarguile


exports.getUsers = function () {
	let users = db.prepare('SELECT * FROM users;').all();
	return users;
}//getNarguile


exports.updateNarg = function (nargData) {
	let query = db.prepare('UPDATE FROM narguile SET quantity = ? AND reference = ? AND marque = ? WHERE id = ?;')
				  .run(nargData.quantity, nargData.reference, nargData.marque, nargData.id);
	return query;
}

exports.updateTuyau = function (tuyauData) {
	let query = db.prepare('UPDATE FROM tuyau SET quantity = ? AND description = ? WHERE id = ?;')
				  .run(tuyauData.quantity, tuyauData.description, tuyauData.id);
	return query;
}
exports.updateManche = function (mancheData) {
	let query = db.prepare('UPDATE FROM manche SET quantity = ? AND description = ? WHERE id = ?;')
				  .run(mancheData.quantity, mancheData.description, mancheData.id);
	return query;
}
exports.updateTete = function (teteData) {
	let query = db.prepare('UPDATE FROM tete SET quantity = ? AND description = ? WHERE id = ?;')
				  .run(teteData.quantity, teteData.description, teteData.id);
	return query;
}
exports.updateDiffuseur = function (diffuseurData) {
	let query = db.prepare('UPDATE FROM tuyau SET quantity = ? AND description = ? WHERE id = ?;')
				  .run(diffuseurData.quantity, diffuseurData.description, diffuseurData.id);
	return query;
}


exports.searchNargWithAllElement = function (id) {
	let narguile = db.prepare('SELECT *, '+
		 'n.photo AS "nargPicture",' +
		 
		 'te.quantity AS "teteQuant",' +
		 'te.description AS "teteDesc", ' +
		 'te.photo AS "tetePhoto", ' +
		 
		 'm.quantity AS "mancheQuant", ' +
		 'm.description AS "mancheDesc", ' +
		 'm.photo AS "manchePhoto", ' +
		 
		 't.quantity AS "tuyauQuant", ' +
		 't.description AS "tuyauDesc", ' +
		 't.photo AS "tuyauPhoto", ' +
		 
		 'd.quantity AS "diffuseurQuant", ' +
		 'd.description AS "diffuseurDesc", ' +
		 'd.photo AS "diffuseurPhoto" ' +
		'FROM narguile n ' +
		 'JOIN manche m ON n.idManche = m.id ' +
		 'JOIN tuyau t ON n.idTuyau = t.id ' +
		 'JOIN diffuseur d ON n.idDiffuseur = d.id ' +
		 'JOIN tete te ON n.idTete = te.id ' + 
		'WHERE n.id = ? ;').get(id);
	return narguile;
}


exports.getGout = function () {
	let query = db.prepare('SELECT * FROM gout;').all();
	quantityIsRight(query);
	return query;
}//getTuyau


exports.getTuyau = function () {
	let query = db.prepare('SELECT * FROM tuyau;').all();
	quantityIsRight(query);
	return query;
}//getTuyau

exports.getManche = function () {
	let query = db.prepare('SELECT * FROM manche;').all();
	quantityIsRight(query);
	return query;
}//getTuyau

exports.getTete = function () {
	let query = db.prepare('SELECT * FROM tete;').all();
	quantityIsRight(query);
	return query;
}//getTuyau

exports.getDiffuseur = function () {
	let query = db.prepare('SELECT * FROM diffuseur;').all();
	quantityIsRight(query);
	return query;
}//getDiffuseur




exports.searchGout = function (id) {
	let query = db.prepare('SELECT * FROM gout WHERE id = ?;').get(id);
	return query;
}//searchTuyau

exports.searchNarg = function (id) {
	let query = db.prepare('SELECT * FROM narguile WHERE id = ?;').get(id);
	return query;
}//searchTuyau

exports.searchTuyau = function (id) {
	let query = db.prepare('SELECT * FROM tuyau WHERE id = ?;').get(id);
	return query;
}//searchTuyau

exports.searchManche = function (id) {
	let query = db.prepare('SELECT * FROM manche WHERE id = ?;').get(id);
	return query;
}//searchTuyau

exports.searchTete = function (id) {
	let query = db.prepare('SELECT * FROM tete WHERE id = ?;').get(id);
	return query;
}//searchTuyau

exports.searchDiffuseur = function (id) {
	let query = db.prepare('SELECT * FROM diffuseur WHERE id = ?;').get(id);
	return query;
}//searchDiffuseur





exports.getUsernameOfUser = function (username) {
	let query = db.prepare('SELECT * FROM users WHERE name = ?;').all(username);
	return query;
}

let quantityIsRight = function (data) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].quantity == 0) 
			data.splice(i, 1);
	}
}


let elementIsAvailable = function (data) {
	for (var i = 0; i < data.length; i++) {

		if (data[i].quantity == 0) 
			data.splice(i, 1);
	}
}