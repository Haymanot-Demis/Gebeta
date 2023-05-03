const DISHES_URL = "https://aastu-gebeta.onrender.com/dishes";
const ORDERS_URL = "https://aastu-gebeta.onrender.com/orders";
const LOUNGES_URL = "https://aastu-gebeta.onrender.com/lounges";
const USERS_URL = "https://aastu-gebeta.onrender.com/users";
const GALLERY_URL = "https://aastu-gebeta.onrender.com/gallery";
const SIGNUP_URL = "https://aastu-gebeta.onrender.com/users/signup";
const SIGNIN_URL = "https://aastu-gebeta.onrender.com/users/signin";
const LOGOUT_URL = "https://aastu-gebeta.onrender.com/users/logout";
const Client_URL = "https://aastu-gebeta-w24u.onrender.com";
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
	Client_URL,
};
