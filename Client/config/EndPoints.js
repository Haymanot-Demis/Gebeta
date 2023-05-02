const DISHES_URL = "http://localhost:3000/dishes";
const ORDERS_URL = "http://localhost:3000/orders";
const LOUNGES_URL = "http://localhost:3000/lounges";
const USERS_URL = "http://localhost:3000/users";
const GALLERY_URL = "http://localhost:3000/gallery";
const SIGNUP_URL = "http://localhost:3000/users/signup";
const SIGNIN_URL = "http://localhost:3000/users/signin";
const LOGOUT_URL = "http://localhost:3000/users/logout";
const axiosInstance = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export {
	DISHES_URL,
	ORDERS_URL,
	LOUNGES_URL,
	USERS_URL,
	GALLERY_URL,
	SIGNIN_URL,
	SIGNUP_URL,
	axiosInstance,
};
