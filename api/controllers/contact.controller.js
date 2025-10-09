import nodemailer from "nodemailer";

export const sendInterestEmail = async (req, res) => {
  const { landlordEmail, userName, userEmail, listingTitle, message } = req.body;

  if (!landlordEmail || !userName || !userEmail || !listingTitle) {
    return res.status(400).json({ success: false, message: "Missing fields!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"EstateStack" <${process.env.MAIL_USER}>`,
      to: landlordEmail,
      subject: `Interest in your property: ${listingTitle}`,
      text: `
Hello,

${userName} (${userEmail}) is interested in your property: "${listingTitle}".

Message from user:
${message || "No additional message provided."}

Please get in touch with the user for further discussion.

Regards,
EstateStack Team
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
};
