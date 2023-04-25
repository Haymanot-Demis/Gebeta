import {
	DISHES_URL,
	LOUNGES_URL,
	ORDERS_URL,
	axiosInstance,
} from "../config/EndPoints.js";

export default async function getDishes() {
	try {
		const response = await axiosInstance.get(LOUNGES_URL);
		const lounges = response.data;
		return lounges;
	} catch (error) {
		console.log(error);
	}
}
