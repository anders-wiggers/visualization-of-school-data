const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbName = path.join(__dirname, '../../../data/db/full_database.db');
const db = new sqlite3.Database(dbName);

class SchoolData {
	//Gets all schools
	static getAllSchools(callback) {
		db.all('SELECT * FROM INSTITUTION', (err, data) => {
			//console.log(data);
			callback(data);
		});
	}

	//Get a specific school with name and year
	static specificSchool(name, year, callback) {
		db.all('SELECT * FROM INSTITUTION WHERE NAME = ? AND YEAR = ?', [ name, year ], (err, data) => {
			callback(data);
		});
	}

	//Get a specific school with name
	static specificSchool(name, callback) {
		db.all('SELECT * FROM INSTITUTION WHERE NAME = ?', [ name ], (err, data) => {
			callback(data);
		});
	}

	//Get a specific year
	static specificYear(year, callback) {
		db.all('SELECT * FROM INSTITUTION WHERE YEAR = ?', [ year ], (err, data) => {
			callback(data);
		});
	}
}

module.exports = db;
module.exports.database = SchoolData;
