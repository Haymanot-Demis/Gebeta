import {
  DISHES_URL,
  ORDERS_URL,
  USERS_URL,
  LOUNGES_URL,
} from "../config/EndPoints.js";
import displayDishesCard from "./displayDishesCard.js";
import displayLoungesCard from "./displayLoungesCard.js";
var grid_count = 0;
// const alone_grid = document.getElementById("alone-grid");
// const alone_grid_item_scrolle = document.getElementById("alone-grid-item");
// const alone_card = document.getElementById("alone-card");
// const imc = document.getElementById("imc");
// const card_image = document.getElementById("alone-card-img");
// const alone_card_content = document.getElementById("alone-card-content");
// const alone_card_header = document.getElementById("alone-card-header");
// const alone_card_text = document.getElementById("alone-card-text");
// const alone_card_btn = document.getElementById("alone-card-btn");
// const link = alone_card_btn.querySelector("a");
dishes();

async function dishes() {
  try {
    let response = await axios.get(DISHES_URL);
    const dishes = response.data;
    dishes.sort((dish1, dish2) => dish2.orderCount - dish1.orderCount);
    displayDishesCard(
      dishes,
      dishes.length > 12 ? 12 : dishes.length,
      "Choose Your Best Dish",
      grid_count
    );

    response = await axios.get(LOUNGES_URL);
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
