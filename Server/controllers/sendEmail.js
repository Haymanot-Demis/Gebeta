const nodemailer = require("nodemailer");
const sendEmail = async (to, subject, text, from = "haymedin21@gmail.com") => {
	const transorter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "haymedin21@gmail.com",
			pass: "tucsfdgxtaprjypn",
		},
	});
	const info = await transorter.sendMail({
		from,
		to,
		subject,
		text,
	});
	return JSON.stringify(info);
};

module.exports = sendEmail;
