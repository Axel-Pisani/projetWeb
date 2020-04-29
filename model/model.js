let sql = require('better-sqlite3');
// let db = sql('../model/db.narguile', { verbose: console.log });
let db = sql('../model/db.narguile');


/*    CRUDS USER ADMIN    */
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

// /*    CRUDS MANAGEMENT USER    */
exports.getUser = function () {
	let query = db.prepare('SELECT * FROM users;').all();
	return query;
}

// exports.updateUser = function (id) {}//update
exports.deleteUser = function (id) {
	let query = db.prepare('DELETE FROM users WHERE id = ?;').get(id);
}//delete

exports.searchUser = function (name, password) {
	let query = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(name, password);
	return query;
}//search



/*    CRUDS MANAGEMENT NAGUILE    */


/*    METHOD    */

exports.getNarguile = function () {
	let narguile = db.prepare('SELECT * FROM narguile;').all();
	return narguile;
}//getNarguile

exports.searchNargile = function (id) {
	let narguile = db.prepare('SELECT *, '+
		 'm.description AS "mancheDesc", ' +
		 't.description AS "tuyauDesc", ' +
		 'd.description AS "diffuseurDesc", ' +
		 'te.description AS "teteDesc" ' +
		'FROM narguile n ' +
		 'JOIN manche m ON n.idManche = m.id ' +
		 'JOIN tuyau t ON n.idTuyau = t.id ' +
		 'JOIN diffuseur d ON n.idDiffuseur = d.id ' +
		 'JOIN tete te ON n.idTete = te.id ' +
		'WHERE n.id = ?').get(id);
	
	// let query = db.prepare('SELECT * FROM manche WHERE id = ? ;').get(narguile.idManche);
	// delete narguile.idManche;
	// narguile.mancheDesc = query.description;
	// narguile.manchePhoto = query.photo;

	// query = db.prepare('SELECT * FROM tuyau WHERE id = ? ;').get(narguile.idTuyau);
	// delete narguile.idTuyau;
	// narguile.tuyauDesc = query.description;
	// narguile.tuyauPhoto = query.photo;

	// query = db.prepare('SELECT * FROM tete WHERE id = ? ;').get(narguile.idTete);
	// delete narguile.idTete;
	// narguile.teteDesc = query.description;
	// narguile.tetePhoto = query.photo;
	
	// query = db.prepare('SELECT * FROM diffuseur WHERE id = ? ;').get(narguile.idDiffuseur);
	// delete narguile.idDiffuseur;
	// narguile.diffuseurDesc = query.description;
	// narguile.diffuseurPhoto = query.photo;
	
	return narguile;
}


exports.getUsernameOfUser = function (username) {
	let query = db.prepare('SELECT * FROM users WHERE name = ?;').all(username);
	return query;
}

