const url = new URL(location.href);
const id = url.searchParams.get("id");
import {
	DISHES_URL,
	GALLERY_URL,
	LOUNGES_URL,
	axiosInstance,
} from "../../config/EndPoints.js";
import sliderImageManager from "../../script/sliderImageManager.js";
import display from "../../script/displayDishesCard.js";
import getDishes from "../../script/getDishes.js";
import { getUser, authorize } from "../../script/auth.js";
var user = await getUser();
lounge();
menu();
async function lounge() {
	try {
		const response = await axiosInstance.get(LOUNGES_URL + `/${id}`);

		const lounge = response.data;
		console.log(lounge);

		const loune_images_res = await axiosInstance.get(
			GALLERY_URL + "/lounges/" + lounge._id
		);
		const loune_images = loune_images_res.data;
		console.log(loune_images);
		const images = loune_images.data;

		document.head.querySelector("title").innerText += " " + lounge.name;
		sliderImageManager(loune_images);
		const dishes = await getDishes();
		console.log(dishes);
		const foods = dishes.filter((dish) => {
			return dish.type == "cooked-food" && dish.lounge._id == lounge._id;
		});

		const drinks = dishes.filter((dish) => {
			return dish.type == "drinks" && dish.lounge._id == lounge._id;
		});
		console.log(foods);
		console.log(drinks);
		display(
			foods,
			foods.length > 6 ? 6 : foods.length,
			"Dishes in " + lounge.name,
			0
		);

		display(
			drinks,
			drinks.length > 6 ? 6 : drinks.length,
			"Drinks in " + lounge.name,
			0
		);
	} catch (error) {
		console.log(error);
	}
}

async function menu() {
	const menu = document.querySelector(".menu");
	const accordion_inputs = menu.querySelectorAll("input[type='button']");
	const dishes = await getDishes();
	const hot_drinks = [];
	const soft_drinks = [];
	const fruit_products = [];
	const other_cold_drinks = [];
	const meals = [];

	const meals_elem = document.getElementById("meals");
	meals_elem.innerHTML = "";
	const hots_elem = document.getElementById("hot-drinks");
	hots_elem.innerHTML = "";
	const soft_elem = document.getElementById("soft-drinks");
	soft_elem.innerHTML = "";
	const fruits_elem = document.getElementById("fruits");
	fruits_elem.innerHTML = "";
	const others_elem = document.getElementById("other-cold-drinks");
	other_cold_drinks.innerHTML = "";

	for (let dish of dishes) {
		let li = document.createElement("li");
		let a = document.createElement("a");
		if (dish.type == "cooked-food") {
			meals.push(dish);
			a.href = "http://127.0.0.1:5500/Client/Dishes/dish.html?id=" + dish._id;
			a.innerText = dish.name;
			li.appendChild(a);
			meals_elem.appendChild(li);
		} else if (dish.category == "Hot Drink") {
			hot_drinks.push(dish);
			a.href = "http://127.0.0.1:5500/Client/Dishes/dish.html?id=" + dish._id;
			a.innerText = dish.name;
			li.appendChild(a);
			hots_elem.appendChild(li);
		} else if (dish.category == "Soft Drinks") {
			soft_drinks.push(dish);
			a.href = "http://127.0.0.1:5500/Client/Dishes/dish.html?id=" + dish._id;
			a.innerText = dish.name;
			li.appendChild(a);
			soft_drinks.appendChild(li);
		} else if (dish.category == "Fruits") {
			fruit_products.push(dish);
			a.href = "http://127.0.0.1:5500/Client/Dishes/dish.html?id=" + dish._id;
			a.innerText = dish.name;
			li.appendChild(a);
			fruits_elem.appendChild(li);
		} else if (dish.category == "Cold Drinks") {
			other_cold_drinks.push(dish);
			a.href = "http://127.0.0.1:5500/Client/Dishes/dish.html?id=" + dish.id;
			a.innerText = dish.name;
			li.appendChild(a);
			others_elem.appendChild(li);
		}
	}

	accordion_inputs.forEach((radio_btn) => {
		radio_btn.onclick = () => {
			if (radio_btn.classList.contains("checked")) {
				radio_btn.classList.remove("checked");
			} else {
				radio_btn.classList.add("checked");
			}
			for (let i = 0; i < accordion_inputs.length; i++) {
				if (
					accordion_inputs[i].name == radio_btn.name &&
					accordion_inputs[i].id != radio_btn.id
				) {
					accordion_inputs[i].classList.remove("checked");
				}
			}
		};
	});
}
