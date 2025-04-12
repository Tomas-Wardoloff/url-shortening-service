import { MailtrapClient } from "mailtrap";

if (!process.env.MAILTRAP_API_TOKEN)
  throw new Error("Mailtrap API token is not defined");

if (!process.env.MAILTRAP_SENDER_EMAIL)
  throw new Error("Mailtrap sender email is not defined");

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

export const sender = {
  email: process.env.MAILTRAP_SENDER_EMAIL,
  name: process.env.MAILTRAP_SENDER_NAME,
};
