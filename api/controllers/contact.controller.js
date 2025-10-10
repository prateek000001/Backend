import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendInterestEmail = async (req, res) => {
  const { landlordEmail, userName, userEmail, listingTitle, message } = req.body;

  if (!landlordEmail || !userName || !userEmail || !listingTitle) {
    return res.status(400).json({ success: false, message: "Missing fields!" });
  }

  try {
    const msg = {
      to: landlordEmail,
      from: process.env.SENDGRID_SENDER,
      subject: `Interest in your property: ${listingTitle}`,
      text: `
Hello,

${userName} (${userEmail}) is interested in your property: "${listingTitle}".

Message from user:
${message || "No additional message provided."}

Regards,
EstateStack Team
      `,
    };

    await sgMail.send(msg);
    console.log("Email sent to:", landlordEmail);

    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
};
