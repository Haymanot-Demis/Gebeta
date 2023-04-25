const url = new URL(location.href);
const id = url.searchParams.get("id");
const commnetArea = document.querySelector(".leaveComment textarea");
const submit = document.getElementById("submitComment");
import {
	DISHES_URL,
	LOUNGES_URL,
	axiosInstance,
} from "../../config/EndPoints.js";
import escapeHTML from "../../script/escapeHTML.js";

submit.onclick = async () => {
	let comment = escapeHTML(commnetArea.value);
	if (comment == "") {
		alert("Please fillout some commnet");
		return false;
	}

	try {
		const response = await axiosInstance.post(DISHES_URL + `/${id}/comments`, {
			comment,
		});
		location.reload();
		console.log(response.data);
	} catch (error) {
		if (error?.response?.status == 401) {
			location.href = "http://127.0.0.1:5500/Client/accounts/login.html";
		}
		console.log(error);
	}
};
