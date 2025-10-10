import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Export a function to send emails
export const sendEmail = async ({ to, subject, text }) => {
  try {
    const msg = {
      to, // recipient email
      from: process.env.SENDGRID_SENDER, // verified sender email in SendGrid
      subject,
      text,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.response ? error.response.body : error);
    throw error;
  }
};
