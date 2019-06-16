var express = require('express');
var router = express.Router();
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'Express' });
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
			res.send(result);
		})
		.catch(function(err){
			console.log(err);
			res.send('Ошибка');
		})
});

// Получаем главную страницу

router.get('/main-page', function(req, res, next) {
	res.render('main-page', { login: 'Express' });
});

// Получаем страницу купса
router.get('/course', function(req, res, next) {
	res.render('course', {
							presentation: 'https://nsportal.ru/sites/default/files/2015/12/01/zherihova_yulya.pptx'
						});
});

module.exports = router;
