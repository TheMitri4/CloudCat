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
	Sql.login(req.body.login, req.body.password)
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

router.post('/register/admin', function(req, res, next) {
	Sql.registerAdmin(req.body.fname, req.body.lname, req.body.login, req.body.password, req.body.enterprise)
		.catch(err => res.send(err))
		.then(sqlResponse => {
			if(sqlResponse.status == 200){
				var response = sqlResponse;
			}else{
				var response = new Objects.Error2(sqlResponse.status, sqlResponse.message);
			}
			res.send(response);
		})
});

router.post('/register/user', function(req, res, next) {
	Sql.registerUser(req.body.login, req.body.enterprise)
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
