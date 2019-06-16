let showRegisterPopupButton = document.querySelector('.lk-button--new-user');
let registerPopupWrapper = document.querySelector('.login-block--register-popup__wrapper');
let registerPopup = document.querySelector('.login-block--register-popup');
let registerPopupLogin = document.querySelector('.login-block__input--register-popup');
let registerPopupSendButton = document.querySelector('.login-block__submit-button--register-popup');


showRegisterPopupButton.addEventListener('click', () => {
	registerPopupWrapper.classList.remove('hidden');
})

registerPopupWrapper.addEventListener('click', event => {
	if(event.target == registerPopup || registerPopup.contains(event.target)){
		return;
	}
	registerPopupWrapper.classList.add('hidden');
})

registerPopupSendButton.addEventListener('click', function(){
	event.preventDefault();
	let login = registerPopupLogin.value;
	if(!login){
		return;
	}

	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/register/user', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	let body = 'login=' + login;
	this.disabled = true;
	xhr.send(body);
	xhr.onload = function(){
		if(xhr.status != 200){
			return;
		}
		if(xhr.response.status == 403){
			this.disabled = false;
			console.log('error');
			return;
		}
		registerPopupWrapper.classList.add('hidden');
		this.disabled = false;
	}
	xhr.onerror = function(){
		this.disabled = false;
		console.log('error');
	}
})