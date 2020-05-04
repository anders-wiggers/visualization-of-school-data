const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbName = path.join(__dirname, '../../../data/db/full_database.db');
const db = new sqlite3.Database(dbName);
const dbStructure = require('./school_database_stucture.json').INSTITUTION;

class SchoolData {
	//Gets all schools
	static getAllSchools(callback) {
		db.all('SELECT * FROM INSTITUTION', (err, data) => {
			//console.log(data);
			callback(data);
		});
	}

	//Get a specific school with name and year
	static specificSchools(name, year, callback) {
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

	//Fetch combined data from a shcool with inner join on datapoints
	static combineData(inputArray, callback) {
		let tablesToGet = '';

		let joinTables = '';

		//Test if query has data entries
		if (inputArray[0]) {
			for (let i of inputArray[0]) {
				//test if query has drill command
				if (Array.isArray(i)) {
					let drillMap = dbStructure[i[0]];
					let lastDrillPoint = '';
					for (let drill in i) {
						if (drill === '0') {
							//first join
							tablesToGet = `${tablesToGet}, ${i[0]}.* `;
							joinTables = `${joinTables}
									INNER JOIN ${i[0]}
									ON INSTITUTION.${i[0].toUpperCase()} = ${i[0]}.id
									`;
							lastDrillPoint = i[0];
						} else {
							//drill join
							let drillPoint = Object.keys(drillMap)[0];
							tablesToGet = `${tablesToGet}, ${drillPoint}.* `;
							joinTables = `${joinTables}
									INNER JOIN ${drillPoint}
									ON ${lastDrillPoint}.${i[drill]} = ${drillPoint}.id
									`;
							lastDrillPoint = drillPoint;
							drillMap = drillMap[drillPoint];
						}
					}
				} else {
					tablesToGet = `${tablesToGet}, ${i}.* `;
					joinTables = `${joinTables}
									INNER JOIN ${i}
									ON INSTITUTION.${i.toUpperCase()} = ${i}.id
									`;
				}
			}
		} else {
			//TODO get kommune data and adress and such :)
		}

		let querry = `SELECT INSTITUTION.NAME, INSTITUTION.YEAR ${tablesToGet}
					FROM INSTITUTION 
					${joinTables}
					WHERE NAME LIKE ?`;
		console.log(querry);
		db.all(querry, inputArray[1], (err, data) => {
			if (err) console.log(err);
			callback(data);
		});
	}
}

module.exports = db;
module.exports.database = SchoolData;