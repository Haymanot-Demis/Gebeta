const url = new URL(location.href);
const id = url.searchParams.get("id");
import { LOUNGES_URL } from "../../config/EndPoints.js";
import sliderImageManager from "./sliderImageManager.js";
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
    console.log(lounge);
  } catch (error) {
    console.log(error);
  }
}
