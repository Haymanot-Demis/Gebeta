function createCustomElement(tagName, options) {
	Element = document.createElement(tagName);
	for (let key in options) {
		Element[key] = options[key];
	}
	return Element;
}

function attachEventListner(elements, event, eventListner, ...rest) {
	for (let i = 0; i < elements.length; i++) {
		elements[i].addEventListener(event, () => {
			eventListner(elements[i]);
		});
	}
}

function rowEventListner(rows, elemTochangeDisplay) {
	for (let i = 1; i < rows.length; i++) {
		rows[i].addEventListener("mouseenter", (e) => {
			makeVisble(elemTochangeDisplay[i - 1]);
		});

		rows[i].addEventListener("mouseleave", (e) => {
			makeInVisble(elemTochangeDisplay[i - 1]);
		});
	}
}

function makeVisble(elem) {
	elem.style.display = "flex";
}

function makeInVisble(elem) {
	elem.style.display = "none";
}

function validate(value, regexp = "") {
	if (!value) {
		return "required";
	}
	// if (regexp.test(value)) {
	//   return "invalid";
	// }
	return true;
}

export {
	makeInVisble,
	makeVisble,
	attachEventListner,
	createCustomElement,
	rowEventListner,
	validate,
};
