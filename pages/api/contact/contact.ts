/* eslint-disable prettier/prettier */
import nodemailer from "nodemailer";

export default async (req, res) => {
  if (req.method === "POST") {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP host, ví dụ smtp.gmail.com
      port: 587,
      secure: false,
      auth: {
        user: "hoangduytn1703@gmail.com", // Địa chỉ email của bạn
        pass: "mqdj gfhk aejr gtuw", // Mật khẩu
      },
    });

    try {
      const mailOptions = {
        from: email,
        to: "hoangduytn1703@gmail.com",
        subject: `Message from ${name}: ${subject}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
      };

      const result = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully", result: result });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email", error: error });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
