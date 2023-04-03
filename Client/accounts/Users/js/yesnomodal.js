export default function modalEvent(button) {
	const trigger = button.getAttribute("data-modal-trigger");
	// console.log('trigger', trigger)
	const modal = document.querySelector(`[data-modal=${trigger}]`);
	const contentWrapper = modal.querySelector(".content-wrapper");
	const close = modal.querySelector(".close");
	const actions = modal.querySelectorAll(".action");

	close.addEventListener("click", () => modal.classList.remove("open"));
	actions[0].addEventListener("click", () => modal.classList.remove("open")); // accept button action
	actions[1].addEventListener("click", () => modal.classList.remove("open")); // decline button action
	modal.addEventListener("click", () => modal.classList.remove("open"));
	contentWrapper.addEventListener("click", (e) => e.stopPropagation());

	modal.classList.toggle("open");
}
