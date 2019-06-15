class Response {
    constructor(status, message, data){
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

class Login {
    constructor(login, token){
        this.login = login;
        this.token = token;
    }
}

class Default {
    constructor(message){
        this.message = message;
    }
}

let Obj = {
    Response: Response,
    Login: Login,
    Default: Default
}

module.exports = Obj;