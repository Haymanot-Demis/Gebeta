import { DISHES_URL, LOUNGES_URL, ORDERS_URL } from "../config/EndPoints.js";

export default async function getDishes() {
  try {
    const response = await axios.get(LOUNGES_URL);
    const lounges = response.data;
    return lounges;
  } catch (error) {
    console.log(error);
  }
}
