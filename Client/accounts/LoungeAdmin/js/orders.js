import { deleteBtnAction, editBtnAction } from "./eventListners.js";
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
	ORDERS_URL,
	DISHES_URL,
	axiosInstance,
} from "../../../config/EndPoints.js";

try {
	let response = await axiosInstance.get(ORDERS_URL);
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

lists[3].classList.add("hovered");

try {
	var response = await axiosInstance.get(ORDERS_URL + "/loungeAdmin/all"); // + loungeId
	var Orders = response.data;

	var Delivered = Orders.filter((order) => {
		return order.status.toLowerCase() === "delivered";
	});
	var Pending = Orders.filter((order) => {
		return order.status.toLowerCase() === "pending";
	});
} catch (error) {
	console.log(error);

	if (error?.response?.status == 401) {
		location.href = "http://127.0.0.1:5500/Client/accounts/login.html";
	}
}

let thead = createCustomElement("thead");
let tr = createCustomElement("tr");
let td = createCustomElement("td", { innerText: "#" });
let td1 = createCustomElement("td", { innerText: "User" });
let td2 = createCustomElement("td", { innerText: "Dish" });
let td3 = createCustomElement("td", { innerText: "Quantity" });
let td4 = createCustomElement("td", { innerText: "Price" });
let td5 = createCustomElement("td", { innerText: "Delivery Info" });
let td6 = createCustomElement("td", { innerText: "Time" });
let td7 = createCustomElement("td", { innerText: "Status" });

tr.append(td, td1, td2, td3, td4, td5, td6, td7);
thead.appendChild(tr);
tabularData.querySelector("table").append(thead);
tabularData.querySelector("table").append(createCustomElement("tbody"));
let tbody = tabularData.querySelector("table").querySelector("tbody");

let i = display(Pending, 1);
display(Delivered, i);

function display(orders, i) {
	for (let order of orders) {
		tr = createCustomElement("tr", {
			id: order._id,
		});
		tr.classList.add("visible");

		td = createCustomElement("td", { innerText: i });
		td1 = createCustomElement("td", {
			innerText: order.user?.firstname + " " + order.user?.lastname,
		});
		td2 = createCustomElement("td", { innerText: order.dish?.name });
		td3 = createCustomElement("td", {
			innerText: order.quantity,
		});
		td4 = createCustomElement("td", { innerText: order.totalPrice });
		td5 = createCustomElement("td", { innerText: order.deliveryType });
		td6 = createCustomElement("td", { innerText: order.timeToCome });

		let select = createCustomElement("select", {
			id: order._id,
			style: "transition:2s",
		});
		let option1 = createCustomElement("option", {
			innerText: "Pending",
			vlaue: "Pending",
		});
		let option2 = createCustomElement("option", {
			innerText: "Delivered",
			value: "Delivered",
		});
		order.status.toLowerCase() == "pending"
			? (option1.selected = true)
			: (option2.selected = true);
		select.append(option1, option2);
		select.addEventListener("change", () => {
			EventListener(select);
		});
		select.addEventListener("click", () => {
			moveDown(select);
		});
		td7 = createCustomElement("td");
		td7.append(select);
		tr.append(td, td1, td2, td3, td4, td5, td6, td7);
		tbody.append(tr);
		i++;
	}
	return i;
}

async function EventListener(elem) {
	try {
		let res = await axiosInstance.put(ORDERS_URL + "/loungeAdmin/" + elem.id, {
			status: elem.value,
		});
	} catch (error) {
		if (error?.response?.status == 401) {
			location.href = "http://127.0.0.1:5500/Client/accounts/login.html";
		}
	}
}

/*
async function moveDown(elem) {
	if (elem.value.toLowerCase() == "pending") {
		elem.addEventListener("change", () => {
			elem.parentElement.parentElement.style.transitionDuration = "2s";
			let tr = elem.parentElement.parentElement;
			let parentElement = tr.parentElement;
			elem.parentElement.parentElement.classList.add("hidden");
			elem.parentElement.parentElement.classList.remove("visible");
			elem.value = "Delivered";
			setTimeout(() => {
				tr.remove();
			}, 2000);
			tr.classList.add("visible");
			tr.classList.remove("hidden");
			parentElement.append(tr);
			// parentElement.insertBefore(tr, document.getElementById(Delivered[0]._id));
		});
	}
} */
