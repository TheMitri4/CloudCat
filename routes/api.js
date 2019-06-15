var express = require('express');
var router = express.Router();
var Api = require("./../helpers/apiObjects");

/* GET home page. */
router.get('/', function(req, res, next) {
	let response = new Api.Response(200, "Все ок", new Api.Default("Pong"));
	res.send(response);
});

router.get('/login', function(req, res, next) {
	let response = new Api.Response(200, "Все ок", new Api.Login(req.body.login, req.body.password));
	res.send(response);
});

module.exports = router;
