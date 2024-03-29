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
import {
	Client_URL,
	DISHES_URL,
	ORDERS_URL,
	axiosInstance,
} from "../../../config/EndPoints.js";
try {
	var response = await axiosInstance.get(ORDERS_URL);
	var orders = response.data;
	var response = await axiosInstance.get(DISHES_URL + "/comments/all");
	var comments = response.data;
	console.log(comments);
} catch (error) {
	if (error?.response?.status == 401) {
		location.href = Client_URL + "/accounts/login.html";
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
	mark = createCustomElement("div", { id: comment._id });
	mark.classList.add("markasread");
	btn = createCustomElement("button");
	btn.classList.add("button-9");
	btn.innerText = "Mark as Read";
	mark.append(btn);

	container.append(header, commentInside, mark);
	tabularData.appendChild(container);
}

let markasread = document.querySelectorAll(".markasread");
console.log(markasread);
attachEventListner(markasread, "click", (elem) => {
	elem.parentElement.querySelector(".comment-body").classList.remove("unread");
	// try {
	// 	axiosInstance.put(DISHES_URL + "" + "/comments/" + elem.id, {
	// 		read: true,
	// 	});
	// } catch (error) {
	// 	console.log(error);
	// }
});
