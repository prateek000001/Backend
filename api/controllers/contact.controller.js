import nodemailer from "nodemailer";

export const sendInterestEmail = async (req, res) => {
  const { landlordEmail, userName, userEmail, listingTitle,message } = req.body;

  if (!landlordEmail || !userName || !userEmail) {
    return res.status(400).json({ success: false, message: "Missing fields!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: `"EstateStack" <${process.env.MAIL_USER}>`,
      to: landlordEmail,
      subject:`Interest in your property: ${listingTitle}`,
      text:`
Hello,

${userName} (${userEmail}) is interested in your property: "${listingTitle}".

Message from user:
${message}

Please get in touch with the user for further discussion.

Regards,  
EstateStack Team
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error });
  }
};
