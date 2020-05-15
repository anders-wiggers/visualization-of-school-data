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

	db.run(`
		CREATE TABLE IF NOT EXISTS scented_students
		(id INTEGER PRIMARY KEY)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS scented_absence
		(id INTEGER PRIMARY KEY)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS scented_well_being
		(id INTEGER PRIMARY KEY)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS scented_planned_hours
		(id INTEGER PRIMARY KEY)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS scented_socieconomic
		(id INTEGER PRIMARY KEY)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS scented_competence_coverage
		(id INTEGER PRIMARY KEY)
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

	static addScentedWidget(table, array, callback) {
		let select = '';

		for (let a of array) {
			let add;
			if (a < 0) add = `m${a * -1}`;
			else add = `_${a}`;
			select = `${select} , ${add}`;

			db.run(
				`
				ALTER TABLE ${table}
				ADD COLUMN ${add} INTEGER
			`,
				(err) => {
					// console.log(err);
				}
			);
		}

		db.all(
			`
		        SELECT *
		        FROM ${table}
		        ORDER BY id DESC
		        LIMIT 1;
		`,
			(err, data) => {
				if (err) {
					this.addScentedWidget(table, array, callback);
				} else {
					let values = '';
					let tables = '';
					// console.log(data[0]);
					if (!data[0]) {
						// console.log('empty');
						for (let a of array) {
							let add;
							if (a < 0) add = `m${a * -1}`;
							else add = `_${a}`;
							values = `${values}, ${1}`;
							tables = `${tables}, ${add}`;
						}
					} else {
						for (let d in data[0]) {
							if (d === 'id') continue;

							let d_number;
							if (d[0] === 'm') {
								d_number = d.substr(1);
								d_number = `-${d_number}`;
							} else {
								d_number = d.substr(1);
							}
							// console.log('dnumb: ' + d_number);
							// console.log(array);
							if (array.includes(parseInt(d_number))) {
								values = `${values}, ${data[0][d] + 1}`;
							} else {
								values = `${values}, ${data[0][d]}`;
								// console.log('here');
							}
							tables = `${tables}, ${d}`;
						}
					}

					values = values.substr(1);
					tables = tables.substr(2);
					let query = `INSERT INTO ${table} (${tables})
								VALUES (${values})`;

					// console.log(query);
					db.run(query, (err, data) => {
						callback(data);
					});
				}
			}
		);
	}

	static getScentedWidget(table, callback) {
		db.all(
			`
		        SELECT *
		        FROM ${table}
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
