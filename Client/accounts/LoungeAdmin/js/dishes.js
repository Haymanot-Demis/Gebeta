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
	openModal,
	update,
	saveBtn,
	modal,
	overlay,
	desc,
	inputs,
	selects,
	flag,
} from "./modal.js";
import { DISHES_URL, ORDERS_URL } from "../../../config/EndPoints.js";

var deleteBtns;
var editBtns;

try {
	let response = await axios.get(ORDERS_URL);
	var orders = response.data;
	response = await axios.get(DISHES_URL + "/comments/all");
	var comments = response.data;
	console.log(comments);
} catch (error) {
	console.log(error);
}
console.log(cardNumbers);
cardNumbers[2].innerText = comments.length;
cardNumbers[1].innerText = orders.length;
cardNumbers[3].innerText =
	"$" +
	orders.reduce((total, order) => {
		return total + order.totalPrice;
	}, 0);

try {
	var response;
	lists[2].classList.add("hovered");
	response = await axios.get("http://localhost:3000/dishes");
	const dishes = response.data;
	response = await axios.get("http://localhost:3000/lounges");
	const lounges = response.data;

	// lounge options
	for (let i = 0; i < lounges.length; i++) {
		let option = createCustomElement("option", {
			value: lounges[i].name,
			id: lounges[i]._id,
			innerText: lounges[i].name,
		});

		selects[1].append(option);
	}

	tabularData.querySelector(".title").innerText = "Dishes";
	tabularData.querySelector("table").innerHTML = "";

	let thead = createCustomElement("thead");
	let tr = createCustomElement("tr");
	let td = createCustomElement("td", { innerText: "#" });
	let td1 = createCustomElement("td", { innerText: "Name" });
	let td2 = createCustomElement("td", { innerText: "Price" });
	let td3 = createCustomElement("td", { innerText: "Description" });
	let td4 = createCustomElement("td", { innerText: "Category" });
	// let td5 = createCustomElement("td", { innerText: "Quantity" });
	let td6 = createCustomElement("td", { innerText: "Image" });
	let td7 = createCustomElement("td", { innerText: "Lounge" });

	tr.append(td, td1, td2, td3, td4, td6, td7);
	thead.appendChild(tr);
	tabularData.querySelector("table").append(thead);
	tabularData.querySelector("table").append(createCustomElement("tbody"));
	let tbody = tabularData.querySelector("table").querySelector("tbody");

	let i = 1;
	for (let dish of dishes) {
		tr = createCustomElement("tr", {
			id: dish._id,
			title: "Double Click to edit this dish",
		});

		td = createCustomElement("td", { innerText: i });
		td1 = createCustomElement("td", { innerText: dish.name });
		td2 = createCustomElement("td", { innerText: dish.price });
		td3 = createCustomElement("td", {
			innerText: dish.description.split(" ").slice(0, 10).join(" "),
		});
		td4 = createCustomElement("td", { innerText: dish.category });
		td6 = createCustomElement("td");

		let img = createCustomElement("img", {
			src: dish.image,
			alt: dish.name + "image",
			height: 130,
			width: 200,
		});

		let deleteBtn = createCustomElement("button", {
			innerText: "Delete",
			id: "E" + dish._id,
			class: "delete-btn",
		});
		deleteBtn.classList.add("delete-btn");
		deleteBtn.classList.add("button-9");
		deleteBtn.setAttribute("role", "button");
		let editBtn = createCustomElement("button", {
			innerText: "Edit",
			id: "D" + dish._id,
			class: "edit-btn",
		});
		editBtn.classList.add("edit-btn");
		editBtn.classList.add("button-9");
		editBtn.setAttribute("role", "button");
		let div = createCustomElement("div", {
			id: "C" + dish._id,
			class: "btn-div",
			style: "display:none;justify-content:space-evenly",
		});
		div.classList.add("btn-div");
		div.append(deleteBtn, editBtn);
		td6.append(img, div);

		td7 = createCustomElement("td", { innerText: dish.lounge?.name });
		tr.append(td, td1, td2, td3, td4, td6, td7);
		tbody.append(tr);
		i++;
	}

	if (details.lastElementChild == recentCustomers) {
		details.removeChild(details.lastElementChild);
	}

	details.style.gridTemplateColumns = "1fr";
	details.style.padding = "50px";
	let rows = tabularData.querySelector("table").querySelectorAll("tr");

	deleteBtns = document.querySelectorAll(".delete-btn");
	editBtns = document.querySelectorAll(".edit-btn");
	//attaching event listeners to the edit buttons
	for (let i = 0; i < editBtns.length; i++) {
		editBtns[i].addEventListener("click", (event) => {
			edittingActions(dishes[i], inputs, selects, desc, event);
		});
		rows[i + 1].addEventListener("dblclick", (event) => {
			edittingActions(dishes[i], inputs, selects, desc, event);
		});
	}

	attachEventListner(deleteBtns, "click", deleteBtnAction);
	// attachEventListner(editBtns, "click", editBtnAction);
	// attachEventListner(rows, "dblclick", editBtnAction);

	rowEventListner(rows);
} catch (error) {
	console.log(error);
}

function edittingActions(dish, inputs, selects, desc, event) {
	console.log(dish);
	openModal(event);
	flag.innerText = "Editing";
	saveBtn.id = dish._id;
	inputs[0].value = dish.name;
	inputs[1].parentNode.nextElementSibling
		.querySelector("#imagePreview")
		.querySelector("img").src = dish.image;

	console.log(dish.image);
	inputs[2].checked = dish.isfasting;
	inputs[3].checked = !dish.isfasting;
	inputs[4].value = dish.price;
	console.log(inputs[4]);
	desc.innerText = dish.description;
	update();
}

export { deleteBtns, editBtns };
