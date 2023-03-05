import display from "../../script/displayLoungesCard.js";
import { LOUNGES_URL } from "../../config/EndPoints.js";

lounges();

async function lounges() {
  try {
    const response = await axios.get(LOUNGES_URL);
    const lounges = response.data;
    display(
      lounges,
      lounges.length > 12 ? 12 : lounges.length,
      "Where do you want to be?"
    );
  } catch (error) {
    console.log(error.message);
  }
}
