import { DISHES_URL, LOUNGES_URL, ORDERS_URL } from "../config/EndPoints.js";

export default async function getDishes() {
  try {
    const response = await axios.get(DISHES_URL);
    const dishes = response.data;
    return dishes;
  } catch (error) {
    console.log("err", error);
  }
}
