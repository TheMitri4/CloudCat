class LoginForm{
	constructor(container){
		this.container = container;
		this.loginInput = container.querySelector('.login-block__login');
		this.passwordInput = container.querySelector('.login-block__password');
		this.submitButon = container.querySelector('.login-block__submit-button');
	}
	
	loginQuery(){
		let xhr = new XMLHttpRequest();
		
	}
}

let loginForm = document.querySelector('.login-block');

let test = new LoginForm(loginForm);