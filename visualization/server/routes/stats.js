let express = require('express');
let router = express.Router();
let db = require('../database/statsDatabase').database;

router.get('/grades', (req, res, next) => {
	db.getScentedWidgetStat((data) => {
		res.send(data);
	});
});

router.post('/grades', (req, res, next) => {
	let arr;
	let fullArray = [];
	if (req.body.dataArray) {
		arr = req.body.dataArray;
	} else {
		res.status(400).send('wrong input');
	}

	for (let i = arr[0]; i < arr[1] + 1; i++) {
		fullArray.push(i);
	}

	db.addScentedWidgetStat(fullArray, (data) => {
		res.send(data);
	});
});

module.exports = router;
