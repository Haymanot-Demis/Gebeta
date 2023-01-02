import display from "../../script/displayDishesCard.js";

lounges();

async function lounges() {
  try {
    const response = await axios.get("http://localhost:3000/dishes");
    const dishes = response.data;
    display(
      dishes,
      dishes.length > 12 ? 12 : dishes.length,
      "What do you want to eat?"
    );
  } catch (error) {
    console.log(error.message);
  }
}
