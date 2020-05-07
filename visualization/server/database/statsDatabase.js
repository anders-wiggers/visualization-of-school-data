const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbName = path.join(__dirname, '../../../data/db/statistics.db');
const db = new sqlite3.Database(dbName);

db.serialize(() => {
	// Queries scheduled here will be serialized.
	db.run(`
    CREATE TABLE IF NOT EXISTS scented_mean_grade(
        id INTEGER PRIMARY KEY,
        mi_tr REAL,
        mi_tw REAL,
        mi_on REAL,
        ze REAL,
        one REAL,
        tw REAL,
        tr REAL,
        fo REAL,
        fi REAL,
        si REAL,
        se REAL,
        ei REAL,
        ni REAL,
        te REAL,
        el REAL,
        twe REAL
    )
`);
});

class statistics {
	static addScentedWidgetStat(array, callback) {
		let insertArray = [];
		let contained = [];
		let queryArray = [];
		for (let i = 0; i < 16; i++) {
			insertArray.push(0);
		}

		for (let i of array) {
			insertArray[i + 3] = 1;
		}

		db.all(
			`
		        SELECT *
		        FROM scented_mean_grade
		        ORDER BY id DESC
		        LIMIT 1;
		`,
			(err, data) => {
				for (let e in data[0]) {
					if (e === 'id') continue;
					contained.push(data[0][e]);
				}
				try {
					for (let i = 0; i < 16; i++) {
						queryArray[i] = contained[i] + insertArray[i];
					}

					db.run(
						`INSERT INTO scented_mean_grade (mi_tr, mi_tw, mi_on, ze, one, tw, tr, fo, fi, si, se, ei ,ni, te, el ,twe)
					VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
						queryArray
					);
				} catch (error) {
					db.run(
						`INSERT INTO scented_mean_grade (mi_tr, mi_tw, mi_on, ze, one, tw, tr, fo, fi, si, se, ei ,ni, te, el ,twe)
					VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
						insertArray
					);
				}
			}
		);

		callback('done');
	}

	static getScentedWidgetStat(callback) {
		db.all(
			`
		        SELECT *
		        FROM scented_mean_grade
		        ORDER BY id DESC
		        LIMIT 1;
		`,
			(err, data) => {
				callback(data);
			}
		);
	}
}
module.exports = db;
module.exports.database = statistics;
