let sql = require('better-sqlite3');
// let db = sql('../model/db.narguile', { verbose: console.log });
let db = sql('../model/db.narguile');

/*	CRUDS USER ADMIN*/
exports.createUser = function (data) {
	let query = db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,?)')
		.run(null, data.name, data.pwd[0], data.justify, data.address, data.tel,'user');
	return query;
}//create

exports.readUser = function (id) {
	let query = db.prepare('SELECT * FROM ? WHERE id = ?').get(table, id);
	return query; 
};//read
// exports.update(id) {}//update
// exports.delete(id) {}//delete
// exports.search(data, table) {}//search


exports.getNarguile = function () {
	let narguile = db.prepare('SELECT * FROM narguile').all();
	return narguile;
}//getNarguile


let searchNargile = function (id) {
	let narguile = db.prepare("SELECT * FROM narguile WHERE id = ? ;").get(id);
	narguile.forEach((elemNarg) => {
		let regEx = new RegExp('id');
		if (regEx.test(Object.keys(elemNarg))) {
			console.log(elemNarg.idManche);
			let query = db.prepare('SELECT * FROM manche WHERE id = ? ;').get(elemNarg.idManche);
			delete elemNarg.idManche;
			elemNarg.mancheDesc = query.description;
			elemNarg.manchePhoto = query.photo;

			query = db.prepare('SELECT * FROM tuyau WHERE id = ? ;').get(elemNarg.idTuyau);
			delete elemNarg.idTuyau;
			elemNarg.tuyauDesc = query.description;
			elemNarg.tuyauPhoto = query.photo;

			query = db.prepare('SELECT * FROM tete WHERE id = ? ;').get(elemNarg.idTete);
			delete elemNarg.idTete;
			elemNarg.teteDesc = query.description;
			elemNarg.tetePhoto = query.photo;
			
			query = db.prepare('SELECT * FROM diffuseur WHERE id = ? ;').get(elemNarg.idDiffuseur);
			delete elemNarg.idDiffuseur;
			elemNarg.diffuseurDesc = query.description;
			elemNarg.diffuseurPhoto = query.photo;
		}//if
	});//forEach
	console.log(narguile);
	return narguile;
}


exports.searchNarg = function (id) {
	return searchNarg(id);
}//searchNarg

exports.searchUser = function (tel, data) {
	let query = db.prepare('SELECT * FROM users').all();
	query.forEach((user) => {
		if (address == user.address || 
			tel == user.tel ) 
			return query;
	});
	return null;
};//read
