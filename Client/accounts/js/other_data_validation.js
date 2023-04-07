import { setError, escapeHtml, password } from "./username_pass_validation.js";
const FnameField = document.getElementById("fname");
const LnameField = document.getElementById("lname");
const confirmPassField = document.getElementById("confirmPass");
const profileField = document.getElementById("profile");
const nameRegExp = /[a-zA-Z]{3,30}/;
const allowed = ["jpg", "png", "gif", "jpeg"];

let firstname;
let lastname;
let confirm_pass;
let profile;

function validateName(input) {
	firstname = FnameField.value.trim();
	firstname = escapeHtml(firstname);
	lastname = LnameField.value.trim();
	lastname = escapeHtml(lastname);

	let name = input.value.trim();
	name = escapeHtml(name);
	console.log(name);
	if (!name) {
		setError(input, "Name Field is Required");
		return false;
	} else if (!nameRegExp.test(name)) {
		setError(input, "Name must contain only alphabetic values");
		return false;
	} else {
		const parent = input.parentNode;
		const small = parent.querySelector("span");
		small.innerText = "";
		small.classList.remove("error");
		small.classList.add("success");
		return true;
	}
}

function confirmPassword() {
	confirm_pass = confirmPassField.value.trim();
	confirm_pass = escapeHtml(confirm_pass);
	console.log(confirm_pass);
	if (!confirm_pass) {
		setError(confirmPassField, "Reenter the password again here");
		return false;
	} else if (confirm_pass != password) {
		setError(confirmPassField, "Passwords do not match");
		return false;
	} else {
		const parent = confirmPassField.parentNode;
		const small = parent.querySelector("span");
		small.innerText = "";
		small.classList.remove("error");
		small.classList.add("success");
		return true;
	}
}

function validateProfile() {
	profile = profileField.files[0];
	console.log(profile);
	if (!profile) {
		setError(profileField, "Profile image is Required");
		return false;
	} else if (allowed.indexOf(profile.type.split("/")[1]) == -1) {
		setError(
			profileField,
			"Invalid image fiel format, must be in" + allowed.join(",")
		);
		return false;
	} else {
		const parent = profileField.parentNode;
		const small = parent.querySelector("span");
		small.innerText = "";
		small.classList.remove("error");
		small.classList.add("success");
		return true;
	}
}

export {
	FnameField,
	LnameField,
	confirmPassField,
	profileField,
	validateName,
	validateProfile,
	confirmPassword,
	firstname,
	lastname,
	profile,
};
