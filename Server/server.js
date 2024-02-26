require("dotenv").config();
const app = require("./app");
const configs = require("./config/configs");

const PORT = configs.port;
app.listen(PORT, () => {
	console.log("Server is running at port " + PORT);
});
