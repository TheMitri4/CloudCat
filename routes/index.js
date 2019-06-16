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
		uri: 'https://cloud-cat.herokuapp.com/api/login',
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
				res.redirect("/lk");
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
	var courses;
	var userinfo;

	console.log("//////////lk")

	// Получение списка курсов
	var options = {
		method: 'POST',
		uri: 'https://cloud-cat.herokuapp.com/api/courses',
		body: {
			token: req.cookies.token
		},
		json: true
	}
	rp(options)
		.then(function(result){
			console.log(result);
			if(result.status === 200){
				result.data.courses = JSON.parse(result.data.courses);
				courses = result.data.courses;
				console.log("ROUTES COURSES" + JSON.stringify(courses))
			}
			else{
				res.cookie("error_message", "Необработанная ошибка, статус " + result.status);
				res.redirect("/error");
			}
		})
		.catch(function(err){
			// console.log(err);
			res.send('Ошибка');
		})
		.then(() => {
			res.render("lk", { courses: courses, userinfo: userinfo});
		})


	// Получение даных о пользовтаеле
	// options = {
	// 	method: 'POST',
	// 	uri: 'https://cloud-cat.herokuapp.com/api/userinfo',
	// 	body: {
	// 		token: req.cookies.token
	// 	}
	// }
	// rp(options)
	// 	.then(function(result){
	// 		// // let apiResponse = JSON.parse(result);
	// 		// if(result.status === 200){
	// 		// 	userinfo.login = result.data.login;
	// 		// 	userinfo.fname = result.data.fname;
	// 		// 	userinfo.lname = result.data.lname;
	// 		// 	userinfo.enterprise = result.data.enterprise;
	// 		// 	userinfo.isAdmin = result.data.isAdmin;
	// 		// 	console.log("ROUTES userinfo" + JSON.stringify(userinfo))
	// 		// }
	// 		// else{
	// 		// 	res.cookie("error_message", "Необработанная ошибка, статус " + apiResponse.status);
	// 		// 	res.redirect("/error");
	// 		// }
	// 	})
	// 	.catch(function(err){
	// 		// console.log(err);
	// 		// res.send('Ошибка');
	// 	})
		// .then(() => {
		// 	// res.render("lk", { courses: courses, userinfo: userinfo});
		// })






	// res.render('lk', { courses: [{ name: 'Глава 6', content: 'Привет, меня зовут контент, и я тут не просто так!'}] } );
});

// Получаем страницу купса
router.get('/course', function(req, res, next) {
	res.render('course', {
							presentation: 'https://nsportal.ru/sites/default/files/2015/12/01/zherihova_yulya.pptx'
						});
});

module.exports = router;
