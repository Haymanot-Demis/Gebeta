const fs = require("fs").promises;
const path = require("path");

async function removeImage(image) {
	let remoteFilename = image.split("/").pop();
	let localFilename = remoteFilename.split("_")[0] + ".jpg";

	const imagePath = path.join(
		__dirname,
		"../uploads/loungeImages",
		localFilename
	);

	// Check if the file exists
	await fs.access(imagePath);

	// If the file exists, unlink it (delete)
	await fs.unlink(imagePath);

	console.log("Deleted successfully");
}

module.exports = {
	removeImage,
};
