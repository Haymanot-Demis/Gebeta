var usernameField = document.getElementById("username");
var passwordField = document.getElementById("password");
const submit = document.getElementById("submit");
const form = document.querySelector("form");
let username = "";
let password = "";
import escapeHtml from "../../script/escapeHTML.js";

const usernameRgExp = /(^[a-zA-Z]+[a-zA-Z0-9.]+@([A-Za-z]+).([A-Za-z]+))$/;

function validate() {
	validatePassword();
	validateUsername();
	return validatePassword() && validateUsername();
}

function validateUsername() {
	username = usernameField.value.trim();
	username = escapeHtml(username);
	console.log(username);
	if (!username) {
		setError(usernameField, "Username/Email Field is Required");
		return false;
	} else if (!usernameRgExp.test(username)) {
		setError(
			usernameField,
			"Username/Email must contain only alphanumeric values"
		);
		return false;
	} else {
		const parent = usernameField.parentNode;
		const small = parent.querySelector("span");
		small.innerText = "";
		small.classList.remove("error");
		small.classList.add("success");
		return true;
	}
}

function validatePassword() {
	password = passwordField.value.trim();
	password = escapeHtml(password);
	console.log(password);
	if (password.length == 0) {
		setError(passwordField, "Password Field is Required");
		return false;
	} else {
		const parent = passwordField.parentNode;
		const small = parent.querySelector("span");
		small.innerText = "";
		small.classList.remove("error");
		small.classList.add("success");
		return true;
	}
}

function setError(inputField, error) {
	const parent = inputField.parentNode;
	const small = parent.querySelector("span");
	small.innerText = error;
	small.classList.remove("success");
	small.classList.add("error");
}

export {
	usernameField,
	passwordField,
	submit,
	form,
	username,
	password,
	setError,
	validate,
	validatePassword,
	validateUsername,
	escapeHtml,
};
