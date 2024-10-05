// import mail from "@sendgrid/mail";
// import { API_RESULT_CODE } from "constants/api";
// import { BaseResponse } from "interfaces/response";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { EnvConfig } from "services/envConfig";

// mail.setApiKey(EnvConfig.sendGridApiKey);

// const contact = async (req: NextApiRequest, res: NextApiResponse<BaseResponse>) => {
//     const body = req.body;
//     const message = `
//         Name: ${body.name}\r\n
//         Email: ${body.email}\r\n
//         Message: ${body.message}
//     `;
//     const data = {
//         to: "letrdo@gmail.com",
//         from: "DuyNH@runsystem.net",
//         subject: `[${body.email}] - ${body.subject}`,
//         text: message,
//         html: message.replace(/\r\n/g, "<br />"),
//     };
//     await mail.send(data);

//     res.status(200).json({
//         result: API_RESULT_CODE.OK,
//     });
// };

// export default contact;
/* eslint-disable prettier/prettier */
import nodemailer from "nodemailer";

export default async (req: any, res: any) => {
  if (req.method === "POST") {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP host, ví dụ smtp.gmail.com
      port: 587,
      secure: false,
      auth: {
        user: "hoangduytn1703@gmail.com", // Địa chỉ email của bạnasdasd
        pass: "txiv xbhp btjt sqwx", // Mật khẩu
      },
    });

    try {
      const mailOptions = {
        from: email,
        to: "hoangduytn1703@gmail.com",
        subject: `Message from ${name}: ${subject}`,
        text: `
        Name: ${name}\r\n
        Email: ${email}\r\n
        Message: ${message}
        `,
      };

      const result = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully", result: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to send email", error: error });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
