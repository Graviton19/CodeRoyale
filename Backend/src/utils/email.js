import nodemailer from "nodemailer"

const mailSender = async (email, title, body) => {
	try {
	  // Create a Transporter to send emails

	  let transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		secure: true,
		auth: {
		  user: process.env.MAIL_USER,
		  pass: process.env.MAIL_PASS,
		}
	  });
	  // Send emails to users
	  let info = await transporter.sendMail({
		from: 'www.codeRoyale.in',
		to: email,
		subject: title,
		html: body,
	  });
	  console.log("Email info: ", info);
	  return info;
	} catch (error) {
	  console.log(error.message);
	}
  };

  export { mailSender }