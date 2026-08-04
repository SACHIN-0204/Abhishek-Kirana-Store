const path = require('path');
const dotenv = require('dotenv');
const nodeMailer = require('nodemailer');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sendEmail = async (to, subject, html) => {
    const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    if (!user || !pass) {
        throw new Error('Email credentials are not configured. Set EMAIL_USER/EMAIL_PASS or GMAIL_USER/GMAIL_PASS in the backend environment file.');
    }

    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user,
                pass
            }
        });

        const mailOptions = {
            from: user,
            to,
            subject,
            html,
            text: html.replace(/<[^>]*>/g, '')
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
