import {
	createCustomElement,
	attachEventListner,
	rowEventListner,
} from "./helpers.js";
import {
	dashboardContainer,
	details,
	tabularData,
	cardNumbers,
} from "./common-elements.js";
import { DISHES_URL, ORDERS_URL } from "../../../config/EndPoints.js";
try {
	var response = await axios.get(ORDERS_URL);
	var orders = response.data;
	var response = await axios.get(DISHES_URL + "/comments/all");
	var comments = response.data;
	console.log(comments);
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

let container, header, username, commentInside, body, img, mark, btn;
for (let comment of comments) {
	container = createCustomElement("div");
	container.classList.add("comment-container");
	header = createCustomElement("div");
	header.classList.add("comment-header");
	username = createCustomElement("p");
	username.classList.add("username");
	username.textContent =
		comment.author.firstname + " " + comment.author.lastname;
	header.appendChild(username);
	commentInside = createCustomElement("div");
	commentInside.classList.add("commentInside");
	img = createCustomElement("img", {
		src: comment.author.profileImage,
		alt: comment.author.name,
	});
	body = createCustomElement("p");
	body.classList.add("comment-body");
	body.classList.add("unread");
	body.textContent = comment.comment;
	commentInside.append(img, body);
	mark = createCustomElement("div");
	mark.classList.add("markasread");
	btn = createCustomElement("button");
	btn.classList.add("button-9");
	btn.innerText = "Mark as Read";
	mark.append(btn);

	container.append(header, commentInside, mark);
	tabularData.appendChild(container);
}
