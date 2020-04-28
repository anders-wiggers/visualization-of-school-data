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
	} else {
		db.specificSchool(req.query.school, req.query.year, (data) => {
			res.send(data);
		});
	}
});

module.exports = router;
