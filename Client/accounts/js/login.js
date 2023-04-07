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

submit.onclick = async (e) => {
	console.log(usernameField.value, passwordField.value);
	e.preventDefault();
	const result = validatePassword() && validateUsername();
	console.log(result);
	if (result) {
		try {
			const response = await axios.post(
				form.action,
				{
					username,
					password,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer Token",
					},
				}
			);
			const small = form.parentNode.querySelector("small");
			localStorage.setItem("token", response.data.token);
			console.log(small, response);
			if (response.data.success) {
				small.classList.remove("err");
				small.classList.add("success");
				small.innerText = response.data.status;
				console.log(small.innerHTML);
				// location.href =  "http://127.0.0.1:5500/Client/accounts/LoungeAdmin/dishes.html";
				// window.history.go(-1);
			}
		} catch (e) {
			const small = form.parentNode.querySelector("small");
			small.classList.remove("success");
			small.classList.add("err");
			small.innerText = "Username or Passowrd is Incorrect";
			console.log(small.innerHTML);
			console.log(e.response.data);
		}
	}
};
