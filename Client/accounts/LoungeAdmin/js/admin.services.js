import { deleteBtnAction, editBtnAction } from "./eventListners.js";
import {
  dashboardContainer,
  lists,
  rows,
  details,
  tabularData,
  table,
  recentCustomers,
} from "./common-elements.js";

for (let i = 1; i <= 6; i++) {
  lists[i].addEventListener("click", () => {
    users(i);
  });
}

async function users(id) {
  var response;
  try {
    switch (id) {
      case 1:
        lists[id].classList.add("hovered");
        break;
      case 2:
        lists[id].classList.add("hovered");
        response = await axios.get("http://localhost:3000/dishes");
        const dishes = response.data;
        tabularData.querySelector(".title").innerText = "Dishes";
        tabularData.querySelector("table").innerHTML = "";

        let thead = createCustomElement("thead");
        let tr = createCustomElement("tr");
        let td = createCustomElement("td", { innerText: "#" });
        let td1 = createCustomElement("td", { innerText: "Name" });
        let td2 = createCustomElement("td", { innerText: "Price" });
        let td3 = createCustomElement("td", { innerText: "Description" });
        let td4 = createCustomElement("td", { innerText: "Category" });
        // let td5 = createCustomElement("td", { innerText: "Quantity" });
        let td6 = createCustomElement("td", { innerText: "Image" });
        let td7 = createCustomElement("td", { innerText: "Lounge" });

        tr.append(td, td1, td2, td3, td4, td6, td7);
        thead.appendChild(tr);
        tabularData.querySelector("table").append(thead);
        tabularData.querySelector("table").append(createCustomElement("tbody"));
        let tbody = tabularData.querySelector("table").querySelector("tbody");

        let i = 1;
        for (let dish of dishes) {
          tr = createCustomElement("tr", {
            id: dish._id,
            title: "Double Click to edit this dish",
          });

          td = createCustomElement("td", { innerText: i });
          td1 = createCustomElement("td", { innerText: dish.name });
          td2 = createCustomElement("td", { innerText: dish.price });
          td3 = createCustomElement("td", {
            innerText: dish.description.split(" ").slice(0, 10).join(" "),
          });
          td4 = createCustomElement("td", { innerText: dish.category });
          td6 = createCustomElement("td");

          let img = createCustomElement("img", {
            src: "../../images/" + dish.image,
            alt: dish.name + "image",
            height: 130,
            width: 200,
          });

          let deleteBtn = createCustomElement("button", {
            innerText: "Delete",
            id: "E" + dish._id,
            class: "delte-btn",
          });
          deleteBtn.classList.add("delete-btn");
          deleteBtn.classList.add("button-9");
          deleteBtn.setAttribute("role", "button");
          let editBtn = createCustomElement("button", {
            innerText: "Edit",
            id: "D" + dish._id,
            class: "edit-btn",
          });
          editBtn.classList.add("edit-btn");
          editBtn.classList.add("button-9");
          editBtn.setAttribute("role", "button");
          let div = createCustomElement("div", {
            id: "C" + dish._id,
            class: "btn-div",
            style: "display:none;justify-content:space-evenly",
          });
          div.classList.add("btn-div");
          div.append(deleteBtn, editBtn);
          td6.append(img, div);

          td7 = createCustomElement("td", { innerText: dish.lounge.name });
          tr.append(td, td1, td2, td3, td4, td6, td7);
          tbody.append(tr);
          i++;
        }

        if (details.lastElementChild == recentCustomers) {
          details.removeChild(details.lastElementChild);
        }

        details.style.gridTemplateColumns = "1fr";
        details.style.padding = "50px";
        let rows = tabularData.querySelector("table").querySelectorAll("tr");

        const deleteBtns = document.querySelectorAll(".delete-btn");
        const editBtns = document.querySelectorAll(".edit-btn");
        attachEventListner(deleteBtns, "click", deleteBtnAction, deleteBtns);
        attachEventListner(editBtns, "click", editBtnAction);
        rowEventListner(rows);
        break;
      case 3:
        lists[id].classList.add("hovered");
        response = await axios.get("http://localhost:3000/orders");
        const orders = response.data;
        console.log(orders);
        break;
      case 5:
        lists[id].classList.add("hovered");
        response = await axios.get("http://localhost:3000/users/all");
        const users = response.data;
        console.log(users);
        break;
      default:
        console.log(id, "not found");
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function createCustomElement(tagName, options) {
  Element = document.createElement(tagName);
  for (let key in options) {
    Element[key] = options[key];
  }
  return Element;
}

function rowEventListner(rows) {
  for (let i = 1; i < rows.length; i++) {
    rows[i].addEventListener("mouseenter", (e) => {
      makeVisble(rows[i]);
    });

    rows[i].addEventListener("mouseleave", (e) => {
      makeInVisble(rows[i]);
    });

    rows[i].addEventListener("dblclick", (e) => {
      location.assign(
        "http://127.0.0.1:5500/Gebeta/Client/accounts/LoungeAdmin/editDish.html?id=" +
          rows[i].id
      );
    });
  }
}

function attachEventListner(elements, event, eventListner, ...rest) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(event, () => {
      eventListner(elements[i]);
    });
  }
}

function makeVisble(elem) {
  elem.querySelector("div.btn-div").style.display = "flex";
}

function makeInVisble(elem) {
  elem.querySelector("div.btn-div").style.display = "none";
}
