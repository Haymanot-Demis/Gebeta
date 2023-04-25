import {
	DISHES_URL,
	LOUNGES_URL,
	ORDERS_URL,
	axiosInstance,
} from "../config/EndPoints.js";

export default async function getDishes() {
	try {
		const response = await axiosInstance.get(DISHES_URL);
		const dishes = response.data;
		return dishes;
	} catch (error) {
		console.log("err", error);
	}
}
