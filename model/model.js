let sql = require('better-sqlite3');
let db = sql('../model/db.narguile', { verbose: console.log });

/*	CRUDS USER	*/
exports.createUser = function (data) {
	console.log(data);
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


/*
exports.getNarguile = function () {
	let narguile = db.prepare('SELECT * FROM narguile').all();
	let res = [];
	narguile.forEach((elmeNarg) => {
		let tabIndex = [];
		let query = 'SELECT * FROM manche WHERE id = ' + elmeNarg.idManche + ';';
		let elem = {
			
		} 


	})//forEach
	// console.log(narguile[]);
	// let manche = db.prepare('SELECT * FROM manche').get();
	// let tuyau = db.prepare('SELECT * FROM tuyau').get();
	// let tete = db.prepare('SELECT * FROM tete').get();
	// let diffuseur = db.prepare('SELECT * FROM diffuseur').get();
}//getNarguile
*/

exports.searchUser = function (tel, data) {
	let query = db.prepare('SELECT * FROM users').all();
	query.forEach((user) => {
		if (address == user.address || 
			tel == user.tel ) 
			return query;
	});
	return null;
};//read
