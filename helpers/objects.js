// Общий объект ответа (для api, sql)
class Response {
    constructor(status, message, data){
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

// Общий объект ошибки (для api, sql)
class Error2 {
    constructor(status, message){
        this.status = status;
        this.message = message;
    }
}

// Общий объект сообщений (для api, sql)
class Message {
    constructor(message){
        this.message = message;
    }
}

// SQL DATA объект для передачи овтета sql.init
class SqlInitData {
    constructor(db){
        this.db = db;
    }
}

// SQL DATA объект для передачи ответа sql.login
class SqlLoginData {
    constructor(login, token){
        this.login = login;
        this.token = token;
    }
}

// Для экспорта
let Objects = {
    Response: Response,
    Error2: Error2,
    SqlInitData: SqlInitData,
    SqlLoginData: SqlLoginData,
    Message: Message,
}

module.exports = Objects;