import { mailtrapClient, sender } from "../config/mailtrap.js";

async function sendVerificationEmail(userEmail: string, token: string) {
  if (!process.env.MAILTRAP_TEMPLATE_ID)
    throw new Error("Mailtrap template ID is not defined");

  const recipient = [{ email: userEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: process.env.MAILTRAP_TEMPLATE_ID,
      template_variables: {
        email: `${userEmail}`,
        verificationLink: `http://localhost:3000/api/auth/verify-email?email=${userEmail}&token=${token}`,
        year: "2025",
      },
    });
  } catch (error: any) {
    throw new Error("Failed to send verification email");
  }
}

export default sendVerificationEmail;
