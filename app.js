const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 2000;

//view engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")));

//bodyParser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => res.render("contact", { layout: false }));

app.post("/send", (req, res) => {
	const output = `<p>You have a new contact request</p>
    <h3>contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
	async function main() {
		// let testAccount = await nodemailer.createTestAccount();
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: "adrien.goyette@ethereal.email", // generated ethereal user
				pass: "P5wb673aUnnK7mAkBq", // generated ethereal password
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: '"Nodemailer contact 👻" <adrien.goyette@ethereal.email>', // sender address
			to: "stephennwac007@gmail.com", // list of receivers
			subject: "Hello from node_contact ✔", // Subject line
			text: "Hello world?", // plain text body
			html: output, // html body
		});

		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		
		res.render('contact', { layout: false });
	};
	main().catch(console.error);
});

app.listen(PORT, () => console.log("listening on port" + PORT));
// Name	Adrien Goyette
// Username	adrien.goyette@ethereal.email (also works as a real inbound email address)
// Password	P5wb673aUnnK7mAkBq
