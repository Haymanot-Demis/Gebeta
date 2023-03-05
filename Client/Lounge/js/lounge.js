const url = new URL(location.href);
const id = url.searchParams.get("id");
import { DISHES_URL, LOUNGES_URL } from "../../config/EndPoints.js";
import sliderImageManager from "../../script/sliderImageManager.js";
import display from "../../script/displayDishesCard.js";
lounge();

async function lounge() {
  try {
    const response = await axios.get(LOUNGES_URL + `/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const lounge = response.data;

    const loune_images = await axios.get(
      "http://localhost:3000/lounges/gallery/" + lounge._id
    );

    const images = loune_images.data;

    document.head.querySelector("title").innerText += " " + lounge.name;
    sliderImageManager(images);
    const dishes = await axios.get(DISHES_URL);
    const foods = dishes.data.filter((dish) => {
      return dish.type == "cooked-food" && dish.lounge._id == lounge._id;
    });
    console.log(dishes.data);

    const drinks = dishes.data.filter((dish) => {
      return dish.type == "drinks" && dish.lounge._id == lounge._id;
    });

    display(
      foods,
      foods.length > 6 ? 6 : foods.length,
      "Dishes in " + lounge.name,
      0
    );
    console.log(drinks);
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
