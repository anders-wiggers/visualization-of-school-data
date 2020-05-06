const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbName = path.join(__dirname, '../../../data/db/statistics.db');
const db = new sqlite3.Database(dbName);

db.serialize(() => {
	// Queries scheduled here will be serialized.
	db.run(`
        CREATE TABLE IF NOT EXISTS scented_widget_grade (id INTEGER PRIMARY KEY, value INTEGER)
        `);
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
		for (let i = 0; i > 16; i++) {
			insertArray.push(null);
		}

		db.run(
			`INSERT INTO scented_mean_grade (mi_tr, mi_tw, mi_on, ze, one, tw, tr, fo, fi, si, se, ei ,ni, te, el ,twe)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
			meanArray
		);

		callback('done');
	}

	static getScentedWidgetStat() {}
}

function calculateMean() {
	db.all('SELECT value FROM scented_widget_grade', (err, data) => {
		if (err) console.log(err);
		let counts = {};
		data.forEach(function(x) {
			counts[x.value] = (counts[x.value] || 0) + 1;
		});
	});
}

module.exports = db;
module.exports.database = statistics;
