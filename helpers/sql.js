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
                    let response = new Objects.Response(200, "Логин дата ок", new Objects.SqlLoginData("loginfromSql", "tokenFromSql"));
                    resolve(response);
                });
        })
    }
}

module.exports = sql;