require("dotenv").config();
const app = require("./app");
const config = require("./config/config");

const PORT = config.port;
app.listen(PORT, () => {
	console.log("Server is running at port " + PORT);
});
