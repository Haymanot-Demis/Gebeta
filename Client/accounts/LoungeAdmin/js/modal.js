const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const saveBtn = document.querySelector(".modal-btn.save-btn");
const inputs = modal.querySelectorAll("input");
const selects = modal.querySelectorAll("select");
const desc = modal.querySelector("textarea");
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

openModalBtn.addEventListener("click", openModal);

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

closeModalBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", () => {
  closeModal();
});

// overlay.addEventListener("click", closeModal);
