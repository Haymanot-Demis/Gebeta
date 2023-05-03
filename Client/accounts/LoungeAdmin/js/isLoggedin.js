import { Client_URL } from "../../../config/EndPoints.js";
import { getUser } from "../../../script/auth.js";
isLoogedin();
async function isLoogedin() {
	let user = await getUser();
	if (!user) {
		location.href = Client_URL;
	}
}
