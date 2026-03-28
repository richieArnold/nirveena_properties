const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAdminNotification = async (customerData, projectName) => {
  const mailOptions = {
    from: `"Nirveena Enquiries" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Property Enquiry: ${projectName || "General Enquiry"}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2>New Enquiry Received</h2>
        <p>A customer has shown interest in <strong>${projectName || "a property"}</strong>.</p>
        <hr />
        <h3>Customer Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${customerData.first_name} ${customerData.last_name}</li>
          <li><strong>Email:</strong> ${customerData.email}</li>
          <li><strong>Contact:</strong> ${customerData.contact}</li>
        </ul>
        <p>Please follow up with the lead via the Admin Dashboard.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin notified via email");
  } catch (error) {
    console.error("Email failed to send:", error);
  }
};

module.exports = { sendAdminNotification };
