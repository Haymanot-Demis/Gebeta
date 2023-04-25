import { getUser, authorize } from "./auth.js";
const user = await getUser();
if (user) {
	authorize(user);
}
