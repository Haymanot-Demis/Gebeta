import { DISHES_URL, LOUNGES_URL, ORDERS_URL } from "../config/EndPoints.js";

export default async function getDishes() {
  try {
    const response = await axios.get(ORDERS_URL);
    const orders = response.data;
    return orders;
  } catch (error) {
    console.log(error);
  }
}
