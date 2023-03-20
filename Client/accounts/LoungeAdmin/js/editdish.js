const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const saveBtn = document.querySelector(".modal-btn.save-btn");
const inputs = modal.querySelectorAll("input");
const selects = modal.querySelectorAll("select");
const desc = modal.querySelector("textarea");

var formdata = new FormData();
var error = false;
import { validate } from "./helpers.js";
import escapeHTML from "../../../script/escapeHTML.js";
import { DISHES_URL } from "../../../config/EndPoints.js";

const openModal = function () {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

openModalBtn.addEventListener("click", () => {
	openModal();
	saveBtn.addEventListener("click", () => {
		console.log(openModalBtns);
		if (!error) {
			create(formdata);
		}
	});
});

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

closeModalBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", save);

async function save() {
	for (let input of inputs) {
		if (validate(escapeHTML(input.value)) == true) {
			input.parentElement?.classList.add("success");
		} else if (validate(escapeHTML(input.value)) == "required") {
			input.parentElement?.classList.add("error");
			input.parentNode.querySelector("small").innerText =
				"This field is required";
			error = true;
		} else if (validate(escapeHTML(input.value)) == "invalid") {
			input.parentElement?.classList.add("error");
			input.parentNode.querySelector("small").innerText =
				"Please conform to the field pattern";
			error = true;
		}
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
		formdata.append("category", escapeHTML(selects[2].value));
		formdata.append("description", escapeHTML(desc.value));
		closeModal();
	}
}

async function create(formdata) {
	const response = await axios.post(DISHES_URL, formdata);
}

async function update(formdata, id) {
	const response = await axios.pust(DISHES_URL + "/" + id, formdata);
}

async function action(btn) {
	btn.addEventListener("click", (e) => {
		openModal();
		saveBtn.addEventListener("click", () => {
			if (!error) {
				update(formdata, btn.id);
			}
		});
	});
}

export { action, openModal, update };

// overlay.addEventListener("click", closeModal)
