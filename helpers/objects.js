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
    constructor(login, token, enterprise){
        this.login = login;
        this.token = token;
        this.enterprise = enterprise;
    }
}

// SQL DATA объект для передачи ответа sql.registerAdmin
class SqlRegisterAdminData {
    constructor(login, token){
        this.login = login;
        this.token = token;
    }
}

// SQL DATA объект для передачи ответа sql.registerAdmin
class SqlRegisterUserData {
    constructor(login, password){
        this.login = login;
        this.password = password;
    }
}

// SQL DATA объект для массива курсов по предприятию
class SqlCoursesData {
    constructor(courses){
        this.courses = courses;
    }
}

// SQL DATA объект для 1 курса по предприятию
class SqlCourseData {
    constructor(course){
        this.course = course;
    }
}

// SQL DATA userinfo
class SqlUserInfo {
    constructor(login, fname, lname, enterprise, isAdmin){
        this.login = login;
        this.fname = fname;
        this.lname = lname;
        this.enterprise = enterprise;
        this.isAdmin = isAdmin;
    }
}


// Для экспорта
let Objects = {
    Response: Response,
    Error2: Error2,
    SqlInitData: SqlInitData,
    SqlLoginData: SqlLoginData,
    Message: Message,
    SqlRegisterAdminData: SqlRegisterAdminData,
    SqlRegisterUserData: SqlRegisterUserData,
    SqlCoursesData: SqlCoursesData,
    SqlCourseData: SqlCourseData,
    SqlUserInfo: SqlUserInfo
}

module.exports = Objects;