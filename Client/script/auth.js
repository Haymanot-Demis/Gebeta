import { DISHES_URL, USERS_URL, axiosInstance } from "../config/EndPoints.js";
async function getUser() {
	try {
		let response = await axiosInstance.get(USERS_URL);
		console.log(response);
		return response?.data?.user;
	} catch (error) {
		console.log(error);
	}
}

function authorize(user) {
	console.log(user);
	const loginContainer = document.querySelector(".login-container");
	loginContainer.firstElementChild.classList.add("hidden");
	loginContainer.lastElementChild.classList.add("hidden");
	let profile_link = document.createElement("a");
	// profile_pic = new File(user.profile);
	// console.log(profile_pic.exists());
	if (user.role.indexOf("admin") != -1) {
		profile_link.href =
			"http://127.0.0.1:5500/Client/accounts/LoungeAdmin/loungeAdmin.html";
	} else if (user.role.indexOf("loungeadmin") != -1) {
		profile_link.href =
			"http://127.0.0.1:5500/Client/accounts/LoungeAdmin/loungeAdmin.html";
	} else {
		profile_link.href =
			"http://127.0.0.1:5500/Client/accounts/Users/order.html";
	}
	profile_link.innerText = user.firstname[0];
	profile_link.style =
		"font-size:60px;vertical-align: middle;position:absolute;transform:translate(-50%, -50%);top:50%;left:50%;";
	loginContainer.append(profile_link);
	loginContainer.style =
		"background-color:red;width:100px;height:100px;border-radius:50px;";
}

export { getUser, authorize };
