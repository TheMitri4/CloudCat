var express = require('express');
var router = express.Router();
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'Express' });
});

// форма регистрации

router.get('/register', function(req, res, next) {
	res.render('register');
});

// авторизация пользователя

router.post('/login', function(req, res, next) {
	console.log(req.body);
	let options = {
		method: 'POST',
		uri: 'http://localhost:3000/api/login',
		form: {
			login: req.body.login,
			password: req.body.password
		}
	}
	rp(options)
		.then(function(result){
			let apiResponse = JSON.parse(result);
			if(apiResponse.status === 200){
				res.cookie("login", apiResponse.data.login);
				res.cookie("token", apiResponse.data.token);
				res.cookie("enterprise", apiResponse.data.enterprise);
				res.redirect("/main-page");
			}
			else if(apiResponse.status === 403){
				res.cookie("error_message", apiResponse.message);
				res.redirect("/error");
			}
			else{
				res.cookie("error_message", "Необработанная ошибка, статус " + apiResponse.status);
				res.redirect("/error");
			}
		})
		.catch(function(err){
			console.log(err);
			res.send('Ошибка');
		})
		.then(function(result){
			res.send(result);
		})
});

// Получаем главную страницу

router.get('/main-page', function(req, res, next) {
	console.log(req.cookies);
	let login = req.cookies.login;
	let enterprise = req.cookies.enterprise;
	let token = req.cookies.token;

	res.render('main-page', { login: login, enterprise: enterprise, token: token });
});

router.get('/lk', function(req, res, next) {
	res.render('lk', { courses: [{ name: 'Глава 6', content: 'Привет, меня зовут контент, и я тут не просто так!'}] } );
});

module.exports = router;
