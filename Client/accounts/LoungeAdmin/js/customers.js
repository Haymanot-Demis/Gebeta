import {
	createCustomElement,
	attachEventListner,
	rowEventListner,
} from "./helpers.js";
import {
	dashboardContainer,
	lists,
	rows,
	details,
	tabularData,
	table,
	recentCustomers,
	cardNumbers,
} from "./common-elements.js";
import {
	DISHES_URL,
	ORDERS_URL,
	axiosInstance,
} from "../../../config/EndPoints.js";
var response;
lists[5].classList.add("hovered");
try {
	response = await axiosInstance.get("http://localhost:3000/users/all");
	const users = response.data;
	console.log(users);
	response = await axiosInstance.get(ORDERS_URL);
	var orders = response.data;
	response = await axiosInstance.get(DISHES_URL + "/comments/all");
	var comments = response.data;
} catch (error) {
	if (error?.response?.status == 401) {
		location.href = "http://127.0.0.1:5500/Client/accounts/login.html";
	}
	console.log(error);
}

cardNumbers[2].innerText = comments.length;
cardNumbers[1].innerText = orders.length;
cardNumbers[3].innerText =
	"$" +
	orders.reduce((total, order) => {
		return total + order.totalPrice;
	}, 0);
