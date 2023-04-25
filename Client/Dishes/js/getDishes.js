import { DISHES_URL, axiosInstance } from "../../config/EndPoints.js";
import display from "../../script/displayDishesCard.js";

lounges();

async function lounges() {
	try {
		const response = await axiosInstance.get(DISHES_URL);
		const dishes = response.data;
		dishes.sort((dish1, dish2) => dish2.orderCount - dish1.orderCount);

		const foods = dishes.filter((dish) => {
			return dish.type == "cooked-food";
		});
		console.log(dishes);

		const drinks = dishes.filter((dish) => {
			return dish.type == "drinks";
		});
		console.log(drinks);
		display(
			foods,
			foods.length > 6 ? 6 : foods.length,
			"What do you want to eat?",
			0
		);

		console.log(drinks);
		display(drinks, drinks.length > 6 ? 6 : drinks.length, "Drinks", 0);
	} catch (error) {
		console.log(error.message);
	}
}
