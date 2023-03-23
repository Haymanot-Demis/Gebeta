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
import { DISHES_URL, ORDERS_URL } from "../../../config/EndPoints.js";
var response;
lists[5].classList.add("hovered");
try {
	response = await axios.get("http://localhost:3000/users/all");
	const users = response.data;
	response = await axios.get(ORDERS_URL);
	var orders = response.data;
	response = await axios.get(DISHES_URL + "/comments/all");
	var comments = response.data;
} catch (error) {
	console.log(error);
}

cardNumbers[2].innerText = comments.length;
cardNumbers[1].innerText = orders.length;
cardNumbers[3].innerText =
	"$" +
	orders.reduce((total, order) => {
		return total + order.totalPrice;
	}, 0);
