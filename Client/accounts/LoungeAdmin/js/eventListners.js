import { DISHES_URL } from "./../../../config/EndPoints.js";

async function deleteBtnAction(btn) {
  let id = btn.id.slice(1);
  const tr = document.getElementById(id);
  tr.remove();
  let response = await axios.delete(DISHES_URL + "/" + id);
}

async function editBtnAction(btn) {
  location.assign(
    "http://127.0.0.1:5500/Gebeta/Client/accounts/LoungeAdmin/editDish.html?id=" +
      btn.id.slice(1)
  );
}

async function saveEditBtnAction(btn) {
  let response = await axios.put(DISHES_URL + "/" + btn.id.slice(1));
  console.log(response);
}
export { deleteBtnAction, editBtnAction, saveEditBtnAction };
