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

function rowEventListner(rows, url) {
  for (let i = 1; i < rows.length; i++) {
    rows[i].addEventListener("mouseenter", (e) => {
      makeVisble(rows[i]);
    });

    rows[i].addEventListener("mouseleave", (e) => {
      makeInVisble(rows[i]);
    });

    rows[i].addEventListener("dblclick", (e) => {
      location.assign(url + rows[i].id);
    });
  }
}

function makeVisble(elem) {
  elem.querySelector("div.btn-div").style.display = "flex";
}

function makeInVisble(elem) {
  elem.querySelector("div.btn-div").style.display = "none";
}

export {
  makeInVisble,
  makeVisble,
  attachEventListner,
  createCustomElement,
  rowEventListner,
};
