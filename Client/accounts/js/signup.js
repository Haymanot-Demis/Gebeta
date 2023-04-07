import {
	usernameField,
	passwordField,
	submit,
	form,
	username,
	password,
	validate,
	validatePassword,
	validateUsername,
} from "./username_pass_validation.js";

import {
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
} from "./other_data_validation.js";

submit.onclick = async (e) => {
	console.log(usernameField.value, passwordField.value);
	e.preventDefault();
	let result = validatePassword();
	console.log(result);
	result = validateUsername() && result;
	console.log(result);
	result = validateName(FnameField) && result;
	console.log(result);
	result = validateName(LnameField) && result;
	console.log(result);
	result = validateProfile() && result;
	console.log(result);
	result = confirmPassword() && result;

	console.log(result);
	if (result) {
		const formdata = new FormData();
		formdata.append("firstname", firstname);
		formdata.append("lastname", lastname);
		formdata.append("username", username);
		formdata.append("password", password);
		formdata.append("profileImage", profile);

		try {
			alert("jhkjhg");
			const response = await axios.post(form.action, formdata);
			console.log(response);
			alert("hhhh");
			const small = form.parentNode.querySelector("small");
			console.log(small, response.data.success);
			if (response.data.success) {
				small.classList.remove("err");
				small.classList.add("success");
				small.innerText = "Successfully Registered";
				// window.location.href = "http://127.0.0.1:5500/Gebeta/Client/index.html";
			}
		} catch (e) {
			const small = form.parentNode.querySelector("small");
			small.classList.remove("success");
			small.classList.add("err");
			small.innerText = "Server error";
			console.log(small.innerHTML);
			console.log(e);
		}
	}
};
