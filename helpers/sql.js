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
            // Устанавливаем соединение с БД
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    // Тут операции с базой по проверке

                    // И ответ-заглушка
                    let response = new Objects.Response(200, "Логин дата ок", new Objects.SqlLoginData(`${login} ${password}`, "tokenFromSql"));
                    resolve(response);
                });
        })
    },

    registerAdmin: function(fname, lname, login, password, enterprise){
        return new Promise((resolve, reject) => {
            // Устанавливаем соединение с БД
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    let db = initResponse.data.db;
                    // Тут операции с базой по проверке
                    db.get(`SELECT * FROM users WHERE login = '${login}'`, [], function(err, row){
                        if(row)
                        {
                            let response = new Objects.Error2(400, `Пользователь ${login} уже существует!`);
                            resolve(response);
                        }
                        else
                        {
                            db.run(`INSERT INTO users ('login', 'password', 'token', 'fname', 'lname', 'isAdmin', 'enterprise') 
                            VALUES ('${login}', '${password}', '000000', '${fname}', '${lname}', '1', '${enterprise}')`);

                            let response = new Objects.Response(200, "After INSERT data", new Objects.SqlRegisterAdminData(login, '000000'));
                            resolve(response);
                        }
                    })
                });
        })
    },

    registerUser: function(login, enterprise){
        return new Promise((resolve, reject) => {
            // Устанавливаем соединение с БД
            sql.init()
                .catch(err => reject(err))
                .then(initResponse => {
                    // Тут операции с базой по проверке

                    // И ответ-заглушка
                    let response = new Objects.Response(200, "Регистр юзера дата ок", new Objects.SqlRegisterUserData(`${login} ${enterprise}`, "password User from SQL"));
                    resolve(response);
                });
        })
    },
}

module.exports = sql;