import { DISHES_URL } from "./../../../config/EndPoints.js";
// import { action } from "./modal.js";

async function deleteBtnAction(btn) {
	let id = btn.id.slice(1);
	const tr = document.getElementById(id);
	tr.remove();
	let response = await axios.delete(DISHES_URL + "/" + id);
}

async function editBtnAction(btn) {
	// action(btn);
}

async function saveEditBtnAction(btn) {
	let response = await axios.put(DISHES_URL + "/" + btn.id.slice(1));
	console.log(response);
}
export { deleteBtnAction, editBtnAction, saveEditBtnAction };
