let crypto = require('crypto');
let sqlite = require('better-sqlite3');
let db = new sqlite('../model/db.narguile');

function reset () {
	let query = db.prepare('DROP TABLE IF EXISTS location').run();
	query = db.prepare('DROP TABLE IF EXISTS narguile').run(); 
	query = db.prepare('DROP TABLE IF EXISTS users').run(); 
	query = db.prepare('DROP TABLE IF EXISTS manche').run(); 
	query = db.prepare('DROP TABLE IF EXISTS tuyau').run(); 
	query = db.prepare('DROP TABLE IF EXISTS tete').run(); 
	query = db.prepare('DROP TABLE IF EXISTS gout').run(); 
	query = db.prepare('DROP TABLE IF EXISTS diffuseur').run(); 

	query = db.prepare('CREATE TABLE users (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT,' +
		' name VARCHAR2(100) NOT NULL, ' +
		' password VARCHAR2(100) NOT NULL, ' +
		' justify DATE NOT NULL, ' +
		' address VARCHAR2(250) NOT NULL, ' +
		' tel INTEGER NOT NULL, ' +
		' role VARCHAR2(5) NOT NULL);').run();
	
	query = db.prepare('CREATE TABLE manche (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' quantity INTEGER CHECK(quantity >= 0), ' +
		' description VARCHAR2(200), ' +
		' photo VARCHAR2(200));').run();

	query = db.prepare('CREATE TABLE tuyau (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' quantity INTEGER CHECK(quantity >= 0), ' +
		' description VARCHAR2(200), ' +
		' photo VARCHAR2(200));').run();

	query = db.prepare('CREATE TABLE tete (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' quantity INTEGER CHECK(quantity >= 0), ' +
		' description VARCHAR2(200), ' +
		' photo VARCHAR2(200));').run();

	query = db.prepare('CREATE TABLE gout (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' quantity INTEGER CHECK(quantity >= 0), ' +
		' description VARCHAR2(200), ' +
		' photo VARCHAR2(200));').run();

	query = db.prepare('CREATE TABLE diffuseur (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' quantity INTEGER CHECK(quantity >= 0), ' +
		' description VARCHAR2(200), ' +
		' photo VARCHAR2(200));').run();

	query = db.prepare('CREATE TABLE narguile (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' quantity INTEGER CHECK(quantity >= 0) DEFAULT 0, ' +
		' marque VARCHAR2(50) NOT NULL, ' +
		' reference VARCHAR2(100) NOT NULL, ' +
		' idManche INTEGER NOT NULL REFERENCES manche, ' +
		' idTuyau INTEGER NOT NULL REFERENCES tuyau, ' +
		' idTete INTEGER NOT NULL REFERENCES tete, ' +
		' idDiffuseur INTEGER NOT NULL REFERENCES diffuseur, ' +
		' photo VARCHAR2(150));').run();

	query = db.prepare('CREATE TABLE location (' +
		' id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		' idUser INTEGER NOT NULL REFERENCES users, ' +
		' idNarg INTEGER NOT NULL REFERENCES narguile, ' +
		' idManche INTEGER NOT NULL REFERENCES manche, ' +
		' idTuyau INTEGER NOT NULL REFERENCES tuyau, ' +
		' idTete INTEGER NOT NULL REFERENCES tete, ' +
		' idGout INTEGER DEFAULT NULL REFERENCES gout, ' +
		' idDiffuseur INTEGER NOT NULL REFERENCES diffuseur, ' +
		' startLoc DATE NOT NULL, ' +
		' endLoc DATE NOT NULL, ' +
		' isConfirmed INTEGER NOT NULL CHECK(isConfirmed >= 0 AND isConfirmed <= 1) DEFAULT 0) ;').run();
}//reset()

let createHash = function (password) {
	let hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}//createHash

function restart () {
	let password = "axel1998";
	let query = db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,?)')
				  .run(null, 'axel', createHash(password), '1998-04-02', '16 allees des pouilleux', '0762042543', 'admin');

  	password = 'mohammed';
	query = db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,?)')
				  .run(null, 'mohammed', createHash(password), '1998-04-02', 'chez lui', '0762042543', 'admin');

				  						//--MANCHE--//
	query = db.prepare('INSERT INTO manche VALUES (?,?,?,?)')
				  .run(null, 2, 'Manche Marrakech aluminium fin', '/assets/manche-marrakech-alu.jpg');

	query = db.prepare('INSERT INTO manche VALUES (?,?,?,?)')
				  .run(null, 2, 'Manche Vibe aluminium', '/assets/manche-aluminium-vibe.jpg');

	query = db.prepare('INSERT INTO manche VALUES (?,?,?,?)')
				  .run(null, 2, 'Manche Bamboo L verre', '/assets/manche-verre.jpg');

										//--TUYAU--//
	query = db.prepare('INSERT INTO tuyau VALUES (?,?,?,?)')
				  .run(null, 2, 'Tuyau en silicone flexible', '/assets/tuyau-silicone.jpg');
				  
	query = db.prepare('INSERT INTO tuyau VALUES (?,?,?,?)')
				  .run(null, 3, 'Tuyau en tissu', '/assets/tuyau-tissu.jpg');
				  
	query = db.prepare('INSERT INTO tuyau VALUES (?,?,?,?)')
				  .run(null, 3, 'Tuyau en plastique pliable', '/assets/tuyau-pliable.png');

										//--TETE--//
	query = db.prepare('INSERT INTO tete VALUES (?,?,?,?)')
				  .run(null, 1, 'Tête en céramique large', '/assets/ceramique-vortex.jpg');
	
	query = db.prepare('INSERT INTO tete VALUES (?,?,?,?)')
				  .run(null, 1, 'Tête en silicone flexible', '/assets/silicone-flexible.jpg');

	query = db.prepare('INSERT INTO tete VALUES (?,?,?,?)')
				  .run(null, 1, 'Tête en argile Brohood avec grille', '/assets/brohood.jpg');
				  
	query = db.prepare('INSERT INTO tete VALUES (?,?,?,?)')
				  .run(null, 1, 'Tête en terre cuite', '/assets/terre-cuite-plat.jpg');

	query = db.prepare('INSERT INTO tete VALUES (?,?,?,?)')
				  .run(null, 1, 'Tête en silicone avec adaptateur', '/assets/silicone.jpg');

				  						//--TABAC--//
	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya Cola Dragon', '/assets/tasteDragon.png');

	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya Hawaii', '/assets/tasteHawaii.png');

	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya Cactus', '/assets/tasteCactus.png');

	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya Love66', '/assets/tasteLove66.png');

	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya LadyKiller', '/assets/tasteLadyKiller.png');

	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya Pêche-Menthe', '/assets/tastePeachMinth.png');

	query = db.prepare('INSERT INTO gout VALUES (?,?,?,?)')
				  .run(null, 1, 'Aldalya Menthe-Citron', '/assets/tasteLemonMinth.png');

										//--DIFFUSEUR--//
	query = db.prepare('INSERT INTO diffuseur VALUES (?,?,?,?)')
				  .run(null, 1, 'Diffuseur en aluminium', '/assets/diff-aluminium.jpg');

	query = db.prepare('INSERT INTO diffuseur VALUES (?,?,?,?)')
				  .run(null, 1, 'Diffuseur en inox', '/assets/diff-inox.jpg');

	query = db.prepare('INSERT INTO diffuseur VALUES (?,?,?,?)')
				  .run(null, 1, 'Diffuseur en silicone', '/assets/diff-siliconne.jpg');

										//--CHICHA--//
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'El-Badia', 'Celeste X3', 1, 1, 1, 1, '/assets/celesteJunior2-0Violette.jpg');

	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'ODUMAN', 'N5-Z JUNIOR', 1, 1, 2, 1, '/assets/oduman-n5z-junior.png');
				  
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'BRODATOR', 'MINI 320', 1, 1, 2, 1, '/assets/mini-brodator-320.png');

	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'MYA', 'Mya Melina', 1, 1, 2, 1, '/assets/mya-melina.png');
				  
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'MASHISHA', 'MS Venom Camo', 1, 1, 2, 1, '/assets/ms-venom-camo.png');
				  
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'OCTOPUZ', 'Octopuz Nautiluz', 1, 1, 2, 1, '/assets/octopuz-nautiluz.png');
				  
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'El-Badia', 'Minotor', 1, 1, 2, 1, '/assets/minotor.png');
				  
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'ODUMAN', 'Gusto', 1, 1, 2, 1, '/assets/gusto.png');
				  
	query = db.prepare('INSERT INTO narguile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 'Scorpio', 'Stinger Carbon', 1, 1, 2, 1, '/assets/stinger-carbon.png');
	
	let date = Math.round(new Date().getTime()/1000);
	// id ,idUser, idNarg, idManche, idTuyau, idTete, idGout, 
	// idDiffuseur, startLoc, endLoc, isConfirmed
	query = db.prepare('INSERT INTO location VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
				  .run(null, 1, 1, 1, 1, 1, 1, 1, date, date + 3600, 0);


	query = db.prepare('SELECT * FROM users').all();
	console.log('users : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM manche').all();
	console.log('manche : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM tuyau').all();
	console.log('tuyau : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM tete').all();
	console.log('tete : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM gout').all();
	console.log('gout : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM diffuseur').all();
	console.log('diffuseur : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM narguile').all();
	console.log('narguile : ');
	console.log(query);
	console.log('\n');

	query = db.prepare('SELECT * FROM location').all();
	console.log('location : ');
	console.log(query);
	console.log('\n');
}//restart()

reset();
restart();