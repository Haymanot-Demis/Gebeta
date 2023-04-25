import {
	DISHES_URL,
	LOUNGES_URL,
	ORDERS_URL,
	USERS_URL,
	axiosInstance,
} from "../config/EndPoints.js";

export default async function getDishes() {
	try {
		const response = await axiosInstance.get(USERS_URL);
		const users = response.data;
		return users;
	} catch (error) {
		console.log(error);
	}
}
