const url = new URL(location.href);
const id = url.searchParams.get("id");
import { DISHES_URL, LOUNGES_URL } from "../../config/EndPoints.js";
import sliderImageManager from "../../script/sliderImageManager.js";
import display from "../../script/displayDishesCard.js";
var response = "";
var Dish = "";
try {
  response = await axios.get(DISHES_URL + `/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  Dish = response.data;
  console.log(Dish);
} catch (error) {
  console.log(error);
}

//
dish();
comments();
let orderBtn = document.querySelector(".detail-container .button");
let incerement = document.getElementById("increment");
let decerement = document.getElementById("decrement");
incerement.onclick = () => {
  stepper(incerement);
};
decerement.onclick = () => {
  stepper(decerement);
};
orderBtn.onclick = orderOnline;

async function dish() {
  try {
    const dish_images = await axios.get(
      "http://localhost:3000/lounges/gallery/" + Dish._id
    );

    const images = dish_images.data;

    document.head.querySelector("title").innerText += " " + Dish.name;
    sliderImageManager(images);

    const detailContainer = document.querySelector(".detail-container");

    console.log(detailContainer);
    const description = document.createElement("div");
    description.classList.add("desc");
    const detail = document.createElement("div");
    detail.classList.add("detail");
    const h2 = document.createElement("h2");
    description.innerHTML =
      `<h2 class="dishname">${Dish.name}</h2>` + Dish.description;
    const table = document.createElement("table");

    const tr1 = document.createElement("tr");
    const tr2 = document.createElement("tr");
    const tr3 = document.createElement("tr");
    const tr4 = document.createElement("tr");
    const tr5 = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.innerText = "Dish Name";
    const th2 = document.createElement("th");
    th2.innerText = "Dish Type";
    const th3 = document.createElement("th");
    th3.innerText = "Dish Category";
    const th4 = document.createElement("th");
    th4.innerText = "Price Per Item";
    const th5 = document.createElement("th");
    th5.innerText = "Lounge";

    tr1.appendChild(th1);
    tr2.appendChild(th2);
    tr3.appendChild(th3);
    tr4.appendChild(th4);
    tr5.appendChild(th5);

    const td1 = document.createElement("td");
    td1.innerText = Dish.name;
    const td2 = document.createElement("td");
    td2.innerText = Dish.type;
    const td3 = document.createElement("td");
    td3.innerText = Dish.category;
    const td4 = document.createElement("td");
    td4.innerText = Dish.price;
    const td5 = document.createElement("td");
    td5.innerText = Dish.lounge.name;

    tr1.appendChild(td1);
    tr2.appendChild(td2);
    tr3.appendChild(td3);
    tr4.appendChild(td4);
    tr5.appendChild(td5);

    table.appendChild(tr1);
    table.appendChild(tr2);
    table.appendChild(tr3);
    table.appendChild(tr4);
    table.appendChild(tr5);
    detail.appendChild(table);

    const button = document.createElement("button");
    const a = document.createElement("a");
    a.innerText = "Order Online";
    button.classList.add("button");
    button.appendChild(a);
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#orderform");

    detailContainer.prepend(description);
    detailContainer.prepend(detail);
    // detailContainer.appendChild(button);
  } catch (error) {
    console.log(error);
  }
}

function comments() {
  const commentContainer = document.getElementById("commentContainer");
  const comments = Dish.comment;
  let h3 = document.createElement("h3");
  h3.innerText = "Comments on this dish";
  console.log(comments);
  let i = 1;
  for (let comment of comments) {
    let commentInside = document.createElement("div");
    commentInside.classList.add("commentInside");
    let image = document.createElement("img");
    image.src = "../images/person2.jpg";
    let commentBody = document.createElement("p");
    commentBody.classList.add("bord-text");
    commentBody.innerText = comment.comment;
    commentInside.appendChild(image);
    commentInside.appendChild(commentBody);
    commentContainer.prepend(commentInside);
    i++;
    if (i > 4) {
      break;
    }
  }
  commentContainer.parentNode.prepend(h3);
}

function stepper(btn) {
  const myInput = document.getElementById("my-input");
  let id = btn.getAttribute("id");
  let min = myInput.getAttribute("min");
  let max = myInput.getAttribute("max");
  let step = myInput.getAttribute("step");
  let val = myInput.getAttribute("value");
  let calcStep = id == "increment" ? step * 1 : step * -1;
  let newValue = parseInt(val) + calcStep;

  if (newValue >= min && newValue <= max) {
    myInput.setAttribute("value", newValue);
  }
}

function orderOnline() {
  const count = document.getElementsByName("count");
  const delivery = document.getElementsByName("delivery");
  const formGroup = document.querySelector(".form-group.location");
  const time = document.querySelector(".form-group.time");
  var deliveryValue = "";
  for (let btn of delivery) {
    btn.onclick = (elm) => {
      deliveryValue = btn.value;
      console.log(deliveryValue);
      if (deliveryValue.trim().toLocaleLowerCase() == "delivery") {
        formGroup.style.display = "block";
      } else {
        formGroup.style.display = "none";
      }
    };
  }
}
