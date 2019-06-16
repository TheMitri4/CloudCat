var Objects = require("./objects");

var sql = {

    // Функция инициализация соединения с базой
    init: function(){
        return new Promise((resolve, reject) => {
            // Подключаем базу
            var sqlite3 = require('sqlite3').verbose();
            var db = new sqlite3.Database('db.sqlite');

            // Смотрим на объект базы
            if(db)
            {
                // Если открылась, резолвим ответ
                let response = new Objects.Response(200, "База ОК", new Objects.SqlInitData(db));
                resolve(response);
            }
            else
            {
                // Иначе реджектим с ошибкой
                let response = new Objects.Error2(400, "База -KO");
                reject(response);
            }
        })
    },

    // Функция проверки корректности данных для входа
    login: function(login, password){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    initResponse.data.db.get(`SELECT * FROM users WHERE login = '${login}' AND password = '${password}'`, [], function(err, row){
                        if(row)
                        {
                            let response = new Objects.Response(200, "Login DATA OK", new Objects.SqlLoginData(row.login, row.token, row.enterprise));
                            resolve(response);
                        }
                        else{
                            let response = new Objects.Error2(403, `Неверные данны для входа!`);
                            resolve(response);
                        }
                    })
                });
        })
    },

    // Функция регистрации администраторов предприятия
    registerAdmin: function(fname, lname, login, password, enterprise){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    let db = initResponse.data.db;
                    // Проверяем на сущесвтование записи с таким же логином
                    db.get(`SELECT * FROM users WHERE login = '${login}'`, [], function(err, row){
                        // Если существует
                        if(row)
                        {
                            // Отдаем ошибку
                            let response = new Objects.Error2(400, `Пользователь ${login} уже существует!`);
                            resolve(response);
                        }
                        else
                        {
                            // Иначе создаем новую запись admina
                            // TODO: генерация токена (по любому алгоритму)
                            require('crypto').randomBytes(12, function(err, buffer) {
                                var token = buffer.toString('hex');
                                db.run(`INSERT INTO users ('login', 'password', 'token', 'fname', 'lname', 'isAdmin', 'enterprise') 
                                VALUES ('${login}', '${password}', '${token}', '${fname}', '${lname}', '1', '${enterprise}')`);
                                
                                // TODO: Надо сделать проверочный SELECT по этому пользователю и вернуть токен и логин с БД
                                let response = new Objects.Response(200, "Insert admin DATA OK", new Objects.SqlRegisterAdminData(login, token));
                                resolve(response);
                            })
                        }
                    })
                });
        })
    },

    registerUser: function(login, enterprise){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    let db = initResponse.data.db;
                    db.get(`SELECT * FROM users WHERE login = '${login}'`, [], function(err, row){
                        // Если существует
                        if(row)
                        {
                            // Отдаем ошибку
                            let response = new Objects.Error2(400, `Пользователь ${login} уже существует!`);

                            // TODO FIX: надо бы reject отдавать, но почемуто catch в api обрабатывается и продожает идти дальше поцепочке!
                            // TODO FIX: Пока так, в api делаем проверку на response.status
                            resolve(response);
                        }
                        else
                        {
                            // Иначе создаем новую запись usera
                            // Токен оставляем пустым так как отдаем только логин-пароль (сгененрится при 1 входе)
                            // Fname и Lname тоже, на будет потом как то заполнить (сейчас форма предполгает отсутвие этих полей)
                            // TODO: Сгенерить пароль
                            db.run(`INSERT INTO users ('login', 'password', 'token', 'fname', 'lname', 'isAdmin', 'enterprise') 
                            VALUES ('${login}', '${login}', '', '', '', '0', '${enterprise}')`);
                            
                            // TODO: Надо сделать проверочный SELECT по этому пользователю и вернуть пароль и логин с БД
                            let response = new Objects.Response(200, "Insert user DATA OK", new Objects.SqlRegisterUserData(login, login));
                            resolve(response);
                        }
                    })
                });
        })
    },

    getCourses: function(token){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    let db = initResponse.data.db;
                    db.get(`SELECT * FROM users WHERE token = '${token}' LIMIT 1`, [], function(err, row){
                        if(row)
                        {
                            db.all(`SELECT * FROM courses WHERE enterprise = '${row.enterprise}'`, [], function(err, rowss){
                                console.log(JSON.stringify(rowss));
                                let response = new Objects.Response(200, "Courses DATA", new Objects.SqlCoursesData(JSON.stringify(rowss)));
                                resolve(response);
                            });
                        }
                        else
                        {
                            // Отдаем ошибку
                            let response = new Objects.Error2(302, `Курсы отстутвуют`);

                            // TODO FIX: надо бы reject отдавать, но почемуто catch в api обрабатывается и продожает идти дальше поцепочке!
                            // TODO FIX: Пока так, в api делаем проверку на response.status
                            resolve(response);
                        }
                    })
                });
        })
    },

    getCourse: function(id, token){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    let db = initResponse.data.db;
                    db.get(`SELECT * FROM users WHERE token = '${token}' LIMIT 1`, [], function(err, row){
                        console.log("USER:" + JSON.stringify(row));
                        if(row)
                        {
                            db.get(`SELECT * FROM courses WHERE id = '${id}'`, [], function(err, rowCourse){
                                console.log("COURSE:" + JSON.stringify(rowCourse));
                                // Доступ возможен если 
                                if(row.enterprise == rowCourse.enterprise)
                                {
                                    let response = new Objects.Response(200, "Courses DATA", new Objects.SqlCourseData(rowCourse));
                                    resolve(response);
                                }
                                // Иначе нет доступа
                                else
                                {
                                    let response = new Objects.Error2(403, "Ошибка доступа к курсам");
                                    resolve(response);
                                }
                            });
                        }
                        else
                        {
                            // Отдаем ошибку
                            let response = new Objects.Error2(302, `Курсы отстутвуют`);

                            // TODO FIX: надо бы reject отдавать, но почемуто catch в api обрабатывается и продожает идти дальше поцепочке!
                            // TODO FIX: Пока так, в api делаем проверку на response.status
                            resolve(response);
                        }
                    })
                });
        })
    },

    createCourse: function(course, token){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    let db = initResponse.data.db;
                    db.get(`SELECT * FROM users WHERE token = '${token}' LIMIT 1`, [], function(err, row){
                        console.log("USER:" + JSON.stringify(row));
                        if(row)
                        {
                            course = JSON.parse(course);
                            console.log("PARSED:course");
                            console.log(course);
                            if(row.enterprise === course.enterprise){
                                console.log("ENTERPRISE OK" + course.name + row.login);
                                db.run(`INSERT INTO courses ('name', 'content', 'enterprise', 'author')
                                VALUES ('${course.name}', '${course.content}', '${course.enterprise}', '${row.login}')`, [], function(err){
                                    console.log("Courses inside");
                                    // Ошибки нет
                                    if(err === null){
                                        // Костыль
                                        var response = new Objects.Response(200, "Courses inserted data", new Objects.Error2(200, "insert OK"));
                                    }
                                    // Иначе нет доступа
                                    else
                                    {
                                        var response = new Objects.Error2(403, "Ошибка при создании записи");
                                    }
                                    console.log("COURSE insert sql:" + JSON.stringify(response));
                                    resolve(response);
                                });
                            }
                        }
                        else
                        {
                            // Отдаем ошибку
                            let response = new Objects.Error2(302, `Токен не доступен в базе`);

                            // TODO FIX: надо бы reject отдавать, но почемуто catch в api обрабатывается и продожает идти дальше поцепочке!
                            // TODO FIX: Пока так, в api делаем проверку на response.status
                            resolve(response);
                        }
                    })
                });
        })
    },

    userInfo: function(token){
        return new Promise((resolve, reject) => {
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    initResponse.data.db.get(`SELECT * FROM users WHERE token = '${token}'`, [], function(err, row){
                        if(row)
                        {
                            let response = new Objects.Response(200, "Userifno DATA OK", new Objects.SqlUserInfo(row.login, row.fname, row.lname, row.enterprise, row.isAdmin));
                            resolve(response);
                        }
                        else{
                            let response = new Objects.Error2(403, `Неверный токен!`);
                            resolve(response);
                        }
                    })
                });
        })
    },
}

module.exports = sql;