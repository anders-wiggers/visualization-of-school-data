let express = require('express');
let router = express.Router();
let db = require('../database/db').database;

router.get('/all-schools', (req, res) => {
	db.getAllSchools((data) => {
		res.send(data);
	});
});

router.get('/school', (req, res) => {
	console.log(req.query);

	if (!req.query.year) {
		console.log('no year');
		db.specificSchool(req.query.school, (data) => {
			res.send(data);
		});
	} else if (!req.query.school) {
		console.log('no year');
		db.specificYear(req.query.year, (data) => {
			res.send(data);
		});
	} else if (req.query.school && req.query.year) {
		db.specificSchools(req.query.school, req.query.year, (data) => {
			res.send(data);
		});
	}
});

function illigalInput(data) {
	return false;
}

router.get('/combine', (req, res, next) => {
	let data = req.query.data;
	let school = req.query.school;
	let year = req.query.year;

	//test for legal input query for safy
	if (illigalInput(data)) return res.status(400).send('Error in input');

	// Test for multiply data entries
	if (data) {
		try {
			data = data.split(':');
		} catch (error) {
			return res.status(400).send('Error in input');
		}
	} else {
		data = null;
	}

	// Test for drill command
	for (d in data) {
		try {
			data[d] = data[d].split('>');
		} catch (error) {}
	}

	db.combineData([ data, school, year ], (data) => {
		res.send(data);
	});
});

module.exports = router;
