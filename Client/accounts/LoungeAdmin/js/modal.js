const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const saveBtn = document.querySelector(".modal-btn.save-btn");
const inputs = modal.querySelectorAll("input");
const selects = modal.querySelectorAll("select");
const desc = modal.querySelector("textarea");
const flag = modal.querySelector(".flex").firstElementChild;
var formdata;
var error = false;

import { validate } from "./helpers.js";
import escapeHTML from "../../../script/escapeHTML.js";
import { DISHES_URL } from "../../../config/EndPoints.js";

const openModal = function (event) {
	console.log(window);
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
	modal.style.top = window.scrollY + "px";
};

openModalBtn.addEventListener("click", (event) => {
	openModal(event);
	flag.innerHTML = "Adding";
	saveBtn.addEventListener("click", async () => {
		if (!error) {
			const response = await axios.post(DISHES_URL, formdata);
		}
	});
});

const closeModal = function () {
	modal.querySelector("form").reset();
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
	inputs[1].parentNode.nextElementSibling
		.querySelector("#imagePreview")
		.querySelector("img").src = "../../images/camera.png";
};

closeModalBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", save);

// previewing image before upload
inputs[1].addEventListener("change", () => {
	inputs[1].parentNode.nextElementSibling
		.querySelector("#imagePreview")
		.querySelector("img").src = URL.createObjectURL(inputs[1].files[0]);
	inputs[1].onload = () => {
		URL.revokeObjectURL(URL.createObjectURL(inputs[1].files[0]));
	};
});

async function save() {
	formdata = new FormData();
	error = false;
	for (let i = 0; i < inputs.length; i++) {
		if (i == 1) {
			continue;
		}
		if (validate(escapeHTML(inputs[i].value ?? "")) == true) {
			inputs[i].parentElement?.classList.add("success");
			inputs[i].parentElement?.classList.remove("error");
		} else if (validate(escapeHTML(inputs[i].value ?? "")) == "required") {
			inputs[i].parentElement?.classList.add("error");
			inputs[i].parentNode.querySelector("small").innerText =
				"This field is required";
			error = true;
		} else if (validate(escapeHTML(inputs[i].value ?? "")) == "invalid") {
			inputs[i].parentElement?.classList.add("error");
			inputs[i].parentNode.querySelector("small").innerText =
				"Please conform to the field pattern";
			error = true;
		}
	}

	let file = inputs[1].files[0];
	if (file) {
		console.log(file);
		let extname = file.type.split("/")[1];
		console.log(extname);
		const allowed = ["png", "jpg", "jpeg"];
		console.log(allowed.indexOf(extname));
		if (allowed.indexOf(extname) == -1) {
			inputs[1].parentElement.classList.add("error");
			inputs[1].parentNode.parentNode.parentNode.parentNode.querySelector(
				"small"
			).innerText = "Invalid image file format";
			error = true;
		}
	}
	if (!file && flag.innerText == "Adding") {
		console.log(inputs[1].parentNode.parentNode.parentNode.parentNode);
		inputs[1].parentNode.parentNode.parentNode.parentNode.classList.add(
			"error"
		);
		inputs[1].parentNode.parentNode.parentNode.parentNode.querySelector(
			"small"
		).innerText = "Please upload an image";
		error = true;
	}

	for (let select of selects) {
		if (validate(escapeHTML(select.value)) == true) {
			select.parentElement?.classList.add("success");
		} else if (validate(escapeHTML(select.value)) == "required") {
			select.parentElement?.classList.add("error");
			select.parentNode.querySelector("small").innerText =
				"This field is required";
			error = true;
		} else if (validate(escapeHTML(select.value)) == "invalid") {
			select.parentElement?.classList.add("error");
			select.parentNode.querySelector("small").innerText =
				"Please conform to the field pattern";
			error = true;
		}
	}

	if (!error) {
		formdata.append("name", escapeHTML(inputs[0].value));
		formdata.append("image", inputs[1]?.files[0]);
		formdata.append("price", escapeHTML(inputs[4].value));
		formdata.append("type", escapeHTML(selects[0].value));
		formdata.append("lounge", escapeHTML(selects[1].value));
		console.log("lounge", selects[1].value);
		formdata.append("category", escapeHTML(selects[2].value));
		formdata.append("description", escapeHTML(desc.value));
		// closeModal();
	} else {
		console.log("no form data");
	}
}

async function update() {
	console.log("update");
	saveBtn.addEventListener("click", async () => {
		console.log("clicked");
		if (!error) {
			const response = await axios.put(DISHES_URL + "/" + saveBtn.id, formdata);
			closeModal();
		} else {
			console.log(error);
		}
	});
}

export {
	openModal,
	update,
	saveBtn,
	modal,
	overlay,
	inputs,
	selects,
	desc,
	flag,
};

// overlay.addEventListener("click", closeModal)
