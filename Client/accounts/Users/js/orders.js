import {
	tabularData,
	table,
	dashboardContainer,
} from "../../LoungeAdmin/js/common-elements.js";
import {
	Client_URL,
	DISHES_URL,
	ORDERS_URL,
	axiosInstance,
} from "../../../config/EndPoints.js";
import {
	createCustomElement,
	rowEventListner,
} from "../../LoungeAdmin/js/helpers.js";

import { openModal, closeModal } from "../../LoungeAdmin/js/modal.js";
import modalEvent from "./yesnomodal.js";
import { getUser } from "../../../script/auth.js";

var response;
var orders;
var Dish;

try {
	response = await axiosInstance.get(ORDERS_URL);
	orders = response.data;
	var Delivered = orders.filter((order) => {
		return order.status.toLowerCase() === "delivered";
	});
	var Pending = orders.filter((order) => {
		return order.status.toLowerCase() === "pending";
	});
} catch (error) {
	if (error?.response?.status == 401) {
		location.href = Client_URL + "/accounts/login.html";
	}
	console.error(error);
}

let thead = createCustomElement("thead");
let tr = createCustomElement("tr");
let td = createCustomElement("td", { innerText: "#" });
let td1 = createCustomElement("td", { innerText: "Dish" });
let td2 = createCustomElement("td", { innerText: "Lounge" });
let td3 = createCustomElement("td", { innerText: "Quantity" });
let td4 = createCustomElement("td", { innerText: "Price" });
let td5 = createCustomElement("td", { innerText: "Delivery Info" });
let td6 = createCustomElement("td", { innerText: "Scheduled for" });
let td7 = createCustomElement("td", { innerText: "Status" });
let td8 = createCustomElement("td", { innerText: "Action" });

tr.append(td, td1, td2, td3, td4, td5, td6, td7);
thead.appendChild(tr);
tabularData.querySelector("table").append(thead);
tabularData.querySelector("table").append(createCustomElement("tbody"));
let tbody = tabularData.querySelector("table").querySelector("tbody");

let i = display(Pending, 1);
display(Delivered, i);

var countElem = document.getElementById("my-input");
var mylocation = document.querySelector("#location");
var time = document.querySelector("#time");
var delivery = document.getElementsByName("delivery");
var locationFormGroup = document.querySelector(".form-group.location");
const price = document.getElementById("price");
var deliveryValue;
var deliveryLocation;
let orderBtn = document.querySelector(".order-btn");
let saveBtn = document.getElementById("save-btn");
let closeBtn = document.getElementById("close-btn");
let incerement = document.getElementById("increment");
let decerement = document.getElementById("decrement");
let formErr = document.querySelector(".form-err");
let delete_confirm = document.querySelector(".action");

console.log(orderBtn);

let saveBtnClone = saveBtn.cloneNode(true);
saveBtn.parentElement.replaceChild(saveBtnClone, saveBtn);
saveBtnClone.addEventListener("click", () => {
	onSave(Dish);
});

function display(orders, i) {
	for (let order of orders) {
		tr = createCustomElement("tr", {
			id: order._id,
			title: "Double Click to edit this dish",
		});
		tr.classList.add("visible");

		td = createCustomElement("td", { innerText: i });
		td1 = createCustomElement("td", {
			innerText: order.user?.firstname + " " + order.dish?.name,
		});
		td2 = createCustomElement("td", { innerText: order.lounge?.name });
		td3 = createCustomElement("td", {
			innerText: order.quantity,
		});
		td4 = createCustomElement("td", { innerText: order.totalPrice });
		td5 = createCustomElement("td", { innerText: order.deliveryType });
		let date = new Date(order.timeToCome);
		let inseconds = date.getTime();
		let now = Date.now();
		let diff = inseconds - now;
		let isPassed = false;
		let msg = "";
		if (diff < 0) {
			isPassed = true;
			diff = -diff;
			if (diff < 60000) {
				msg = "Just seconds before";
			} else if (diff < 3600000) {
				msg = Math.floor(diff / 60000) + " minutes before";
			} else if (diff < 3600000 * 24) {
				msg = Math.floor(diff / 3600000) + " hours before";
			} else {
				msg = Math.floor(diff / (3600000 * 24)) + " days before";
			}
		} else {
			if (diff < 60000) {
				msg = "Just seconds later";
			} else if (diff < 60000) {
				msg = Math.floor(diff / 3600000) + " minutes later";
			} else if (diff < 3600000 * 24) {
				msg = Math.floor(diff / 3600000) + " hours later";
			} else {
				msg = Math.floor((diff / 3600000) * 24) + " days later";
			}
			msg =
				date.getDate() +
				"/" +
				(date.getMonth() + 1) +
				"/" +
				date.getFullYear() +
				"( " +
				msg +
				" )";
		}

		td6 = createCustomElement("td", { innerText: msg });

		let p = createCustomElement("p", {
			innerText: order.status.toLowerCase(),
			id: order._id,
			style: "background-color:green; border-radius:5px;padding:10px",
		});
		let td7 = createCustomElement("td");
		td7.append(p);

		let deleteBtn = createCustomElement("button", {
			innerText: "Delete",
			id: "D" + order._id,
		});
		deleteBtn.classList.add("delete-btn");
		deleteBtn.classList.add("button-9");
		deleteBtn.classList.add("trigger");
		deleteBtn.setAttribute("data-modal-trigger", "trigger-1");
		deleteBtn.setAttribute("role", "button");
		deleteBtn.addEventListener("click", () => {
			modalEvent(deleteBtn);
		});

		let editBtn = createCustomElement("button", {
			innerText: "Edit",
			id: "E" + order._id,
		});

		editBtn.classList.add("edit-btn");
		editBtn.classList.add("order-btn");
		editBtn.classList.add("btn-open");
		editBtn.classList.add("button-9");
		editBtn.setAttribute("role", "button");
		let div = createCustomElement("div", {
			id: "C" + order._id,
			class: "btn-div",
			style: "display:block;justify-content:space-evenly",
		});
		editBtn.addEventListener("click", () => {
			EditSetup();
			openModal();
		});
		div.classList.add("btn-div");
		div.append(deleteBtn, editBtn);
		td8 = createCustomElement("td");
		td8.append(div);
		tr.append(td, td1, td2, td3, td4, td5, td6, td7, td8);
		if (inseconds < now) {
			tr.style = "background-color:#efcc8a";
			p.style.backgroundColor = "#efcc8a";
		}
		if (p.innerText == "pending") {
			p.style.backgroundColor = "#efcc8a";
		}
		tbody.append(tr);
		i++;
	}

	let rows = tabularData.querySelector("table").querySelectorAll("tr");
	let btnsWrapper = document.querySelectorAll("tr .btn-div");
	let deleteBtns = document.querySelectorAll(".delete-btn");
	let editBtns = document.querySelectorAll(".edit-btn");
	//attaching event listeners to the edit buttons
	for (let i = 0; i < editBtns.length; i++) {
		rows[i + 1].addEventListener("dblclick", (event) => {
			EditSetup();
			openModal();
		});
	}

	// for (let i = 0; i < deleteBtns.length; i++) {
	// 	deleteBtns[i].addEventListener("click", (event) => {
	// 		console.log(confirm("yes or no"));
	// 		console.log("delete");
	// 	});
	// }
	return i;
}

async function reloadTable() {
	try {
		response = await axiosInstance.get(ORDERS_URL); // ORDERS_URL + userid
		orders = response.data;
	} catch (error) {
		if (error?.response?.status == 401) {
			location.href = Client_URL + "/accounts/login.html";
		}
		console.log(error);
	}
	let Delivered = orders.filter((order) => {
		return order.status.toLowerCase() === "delivered";
	});
	let Pending = orders.filter((order) => {
		return order.status.toLowerCase() === "pending";
	});
	let i = display(Pending, 1);
	display(Delivered, i);
}

async function onSave(Dish) {
	const user = await getUser();
	let orderCount = countElem.value?.trim();
	let timeToCome = time.value?.trim();
	deliveryLocation = mylocation.value?.trim();
	let isValid = validDeliveryLocation(locationFormGroup, deliveryLocation);

	if (isValid) {
		let data = {};
		data.quantity = orderCount;
		data.deliveryType = deliveryValue;
		if (deliveryLocation) {
			data.palceToDeliver = deliveryLocation;
		}
		if (timeToCome != "") {
			data.timeToCome = timeToCome;
		}
		data.totalPrice = Dish?.price ?? 0 * parseInt(data.quantity);
		data.dish = Dish?._id;
		data.user = orders?.user?._id ?? user._id;
		data.lounge = orders?.lounge?._id;
		console.log(data);

		try {
			const response = await axiosInstance.put(
				ORDERS_URL + "/" + orderBtn.id?.slice(1),
				data
			);

			formErr.classList.add("hidden");
			formErr.innerText = "";
			console.log(response);
			console.log(response.status);
			// closeModal();
		} catch (error) {
			if (error?.response?.status == 401) {
				location.href = Client_URL + "/accounts/login.html";
			}
			formErr.classList.remove("hidden");
			formErr.innerText = error.response.data.msg;
			console.log(error);
		}
	} else {
		let small = document.createElement("small");
		small.id = "err-msg";
		small.style.color = "red";
		small.innerText = "Please enter delivery location";
		locationFormGroup.appendChild(small);
		mylocation.style.border = "1px solid red";
		alert("Please enter a valid order");
		return;
	}
}

delete_confirm.onclick = async () => {
	try {
		response = await axiosInstance.delete(
			ORDERS_URL + "/" + orderBtn.id?.slice(1)
		);
		console.log(response);
	} catch (error) {
		if (error?.response?.status == 401) {
			location.href = Client_URL + "/accounts/login.html";
		}
		console.log(error);
	}
};

incerement.onclick = () => {
	stepper(incerement, Dish?.price);
};
decerement.onclick = () => {
	stepper(decerement, Dish?.price);
};

mylocation.onkeydown = () => {
	const small = document.getElementById("err-msg");
	if (small) {
		locationFormGroup.removeChild(small);
		mylocation.style.border = "1px solid black";
	}
};

async function EditSetup() {
	try {
		response = await axiosInstance.get(
			ORDERS_URL + "/" + orderBtn.id?.slice(1)
		);
		console.log(response);
		Dish = response.data.dish;
	} catch (error) {
		if (error?.response?.status == 401) {
			location.href = Client_URL + "/accounts/login.html";
		}
		console.log(error);
	}
	price.value = Dish?.price ?? 0 * parseInt(countElem.value) + " ETB";
	deliveryValue = "";
	for (let btn of delivery) {
		btn.onclick = (elm) => {
			deliveryValue = btn.value;
			if (deliveryValue?.trim().toLocaleLowerCase() == "delivery") {
				locationFormGroup.style.display = "block";
			} else {
				locationFormGroup.style.display = "none";
			}
		};
	}
}

async function stepper(btn, dish_price) {
	const myInput = document.getElementById("my-input");
	let id = btn.getAttribute("id");
	let min = myInput.getAttribute("min");
	let max = myInput.getAttribute("max");
	let step = myInput.getAttribute("step");
	let val = myInput.getAttribute("value");
	let calcStep = id == "increment" ? step * 1 : step * -1;
	let newValue = parseInt(val) + calcStep;
	if (newValue >= min && newValue <= max) {
		myInput.setAttribute("value", newValue);
		price.value = newValue * dish_price ?? 0 + " ETB";
	}
}

function validDeliveryLocation(location, deliveryLocation) {
	if (location.style?.display == "block" && !deliveryLocation) {
		return false;
	}
	return true;
}
