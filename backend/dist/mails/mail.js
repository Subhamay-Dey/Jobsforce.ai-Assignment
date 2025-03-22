import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
});
export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error(`Email sending failed to ${to}:`, error);
        return false;
    }
};
