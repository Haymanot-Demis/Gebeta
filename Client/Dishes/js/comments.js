const url = new URL(location.href);
const id = url.searchParams.get("id");
const commnetArea = document.querySelector(".leaveComment textarea");
const submit = document.getElementById("submitCommnent");
import { DISHES_URL, LOUNGES_URL } from "../../config/EndPoints.js";
import escapeHTML from "../../script/escapeHTML.js";

submit.onclick = async () => {
  let comment = escapeHTML(commnetArea.value);
  if (comment == "") {
    alert("Please fillout some commnet");
    return false;
  }

  try {
    const response = await axios.post(
      DISHES_URL + `/${id}/comments`,
      {
        comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    location.reload();
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
