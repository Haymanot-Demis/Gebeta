var url = new URL(location.href);
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const saveBtn = document.querySelector(".modal-btn.save-btn");
const image = document.querySelector("input[type='file']");
const autoGrid = document.querySelector(".auto-grid");
autoGrid.removeEventListener;
console.log(autoGrid);
import { GALLERY_URL } from "../../../config/EndPoints.js";
import { createCustomElement } from "../js/helpers.js";

var EndPoint = "/dishes/";
var id = url.searchParams.get("id");

if (url.searchParams.get("from").slice(1, -1) == "mylounge") {
	EndPoint = "/lounges/";
	id = url.searchParams.get("id").slice(1, -1);
}
console.log(EndPoint, id);

try {
	const response = await axios.get(GALLERY_URL + EndPoint + id);
	let images = response.data;
	console.log(images);
	for (let data of images) {
		let li = createCustomElement("li");
		let a = createCustomElement("a", { href: "#" });
		a.classList.add("profile");
		let btns = createCustomElement("div");
		btns.classList.add("btns");
		let deleteBtn = createCustomElement("button", { innerText: "Delete" });
		deleteBtn.classList.add("delete");
		deleteBtn.classList.add("button-9");
		deleteBtn.addEventListener("click", () => {
			DeletePhoto(li, data._id);
		});
		let replaceBtn = createCustomElement("button", { innerText: "Replace" });
		replaceBtn.classList.add("button-9");
		replaceBtn.classList.add("replace");
		replaceBtn.addEventListener("click", () => {
			console.log(data.image);
			ReplacePhoto(li, data._id, new FormData());
		});
		let img = createCustomElement("img", {
			src: data.image,
			alt: data.object.name + "Image",
		});

		btns.append(deleteBtn, replaceBtn);
		a.addEventListener("click", (e) => {
			e.preventDefault();
		});
		a.append(btns, img);
		li.append(a);
		autoGrid.append(li);
	}
} catch (error) {
	console.log(error);
}

const openModal = function () {
	// modal.style.top = "50%";
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModal = function () {
	modal.style.top = "initial";
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

openModalBtn.addEventListener("click", openModal);

closeModalBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", async () => {
	let formdata = new FormData();
	let files = Array.from(image.files);

	files.forEach((file) => {
		formdata.append("images", file);
	});
	formdata.append("object", id);

	try {
		const response = await axios.post(GALLERY_URL + EndPoint + id, formdata, {
			headers: {
				"Content-Type": "multipart/form-data", // optional
			},
		});
	} catch (error) {
		console.log(error);
	}
	closeModal();
});

image.addEventListener("change", () => {
	for (let i = 0; i < image.files.length; i++) {
		let uploadContainer = createCustomElement("div");
		uploadContainer.classList.add("upload-container");
		let avatarUpload = createCustomElement("div");
		avatarUpload.classList.add("avatar-upload");
		let avatarPreview = createCustomElement("div");
		avatarPreview.classList.add("avatar-preview");
		let imagePreview = createCustomElement("div", {
			id: "imagePreview",
		});
		let img = createCustomElement("img", {
			src: URL.createObjectURL(image.files[i]),
		});
		imagePreview.appendChild(img);
		avatarPreview.appendChild(imagePreview);
		avatarUpload.appendChild(avatarPreview);
		uploadContainer.appendChild(avatarUpload);
		modal.querySelector("header").appendChild(uploadContainer);
	}
	image.onload = () => {
		image.files.forEach((file) => {
			URL.revokeObjectURL(URL.createObjectURL(file));
		});
	};
});

function DeletePhoto(elem, id) {
	axios.delete(GALLERY_URL + EndPoint + id).then((response) => {
		console.log(response);
	});
	elem.remove();
}

function ReplacePhoto(elem, id, formData) {
	modal.style.top = window.scrollY + "px";
	openModal();
	let cloned = saveBtn.cloneNode(true);
	saveBtn.parentNode.replaceChild(cloned, saveBtn);
	image.multiple = false;
	cloned.addEventListener("click", async (e) => {
		let formdata = new FormData();
		formdata.append("images", image.files[0]);
		try {
			const response = await axios.put(GALLERY_URL + EndPoint + id, formdata, {
				headers: {
					"Content-Type": "multipart/form-data", // optional
				},
			});
			console.log(response);
			alert("Photo has been replaced");
		} catch (error) {
			console.log(error);
		}
		closeModal();
	});
	console.log(cloned);
}
