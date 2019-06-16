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
                            db.run(`INSERT INTO users ('login', 'password', 'token', 'fname', 'lname', 'isAdmin', 'enterprise') 
                            VALUES ('${login}', '${password}', '000000', '${fname}', '${lname}', '1', '${enterprise}')`);
                            
                            // TODO: Надо сделать проверочный SELECT по этому пользователю и вернуть токен и логин с БД
                            let response = new Objects.Response(200, "Insert admin DATA OK", new Objects.SqlRegisterAdminData(login, '000000'));
                            resolve(response);
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
}

module.exports = sql;