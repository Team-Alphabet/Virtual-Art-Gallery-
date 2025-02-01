const nodeMailer = require('nodemailer');

const sentEmail = async (options) => {
    // const transporter = nodeMailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     auth: {
    //         user: process.env.SMTP_MAIL,
    //         pass: process.env.SMTP_PASS
    //     }
    // });

    const transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "5a7651676b32db",
            pass: "3f18efe16f42b3"
        }
    });
    const mailOptions = {
        from: 'samajdarsoumyajeet0@gmail.com',
        to: options.to,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sentEmail;