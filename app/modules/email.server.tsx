import nodemailer from "nodemailer";

export async function sendEmail(htmlEmail: string) {
	const transporter = nodemailer.createTransport({
		host: "smtp-relay.brevo.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.STMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	});



	const info = await transporter.sendMail({
		// from-to emails should be different to allow
		// to add the sender to the contacts
		from: `"sbk.vents" <${process.env.NOTIFICATIONS_SENDER_EMAIL}>`,
		to: process.env.NOTIFICATIONS_RECIPIENT_EMAIL,
		subject: "New event created",
		html: htmlEmail,
	});

	console.log("Message sent: %s", JSON.stringify(info));
}
