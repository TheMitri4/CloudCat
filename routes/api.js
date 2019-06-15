var express = require('express');
var router = express.Router();
var Objects = require("../helpers/objects");
var Sql = require("../helpers/sql");

/* GET home page. */
router.post('/', function(req, res, next) {
	let response = new Objects.Response(200, "Все ок", new Objects.Message("Pong"));
	res.send(response);
});

router.post('/login', function(req, res, next) {
	Sql.login()
		.catch(err => res.send(err))
		.then(sqlResponse => {
			if(sqlResponse.status == 200){
				var response = sqlResponse;
			}else{
				var response = sqlResponse;
			}
			res.send(response);
		})
});

module.exports = router;
