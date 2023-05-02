import { lists } from "../LoungeAdmin/js/common-elements.js";
import { axiosInstance } from "../../config/EndPoints.js";

console.log(lists[lists.length - 1]);
lists[lists.length - 1].onclick = async () => {
	localStorage.removeItem("token");
	location.href = "http://127.0.0.1:5500/Client/index.html";
};
