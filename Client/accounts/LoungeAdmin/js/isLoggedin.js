import { getUser } from "../../../script/auth.js";
isLoogedin();
async function isLoogedin() {
	let user = await getUser();
	if (!user) {
		location.href = "http://127.0.0.1:5500/Client/index.html";
	}
}
