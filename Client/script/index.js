import {
	DISHES_URL,
	ORDERS_URL,
	USERS_URL,
	LOUNGES_URL,
	axiosInstance,
} from "../config/EndPoints.js";
import displayDishesCard from "./displayDishesCard.js";
import displayLoungesCard from "./displayLoungesCard.js";
import { getUser, authorize } from "./auth.js";
const user = await getUser();
if (user) {
	authorize(user);
}
var grid_count = 0;
dishes();

async function dishes() {
	try {
		let response = await axiosInstance.get(DISHES_URL);
		const dishes = response.data;
		dishes.sort((dish1, dish2) => dish2.orderCount - dish1.orderCount);
		displayDishesCard(
			dishes,
			dishes.length > 12 ? 12 : dishes.length,
			"Choose Your Best Dish",
			grid_count
		);

		response = await axiosInstance.get(LOUNGES_URL);
		const lounges = response.data;
		lounges.sort((lounge1, lounge2) => lounge2.rating - lounge1.rating);
		displayLoungesCard(
			lounges,
			lounges.length > 6 ? 6 : lounges.length,
			"See the Lounges",
			grid_count
		);
		console.log(lounges);
	} catch (error) {
		console.log(error);
	}
}
