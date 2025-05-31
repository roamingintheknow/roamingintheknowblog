import type { NextApiRequest, NextApiResponse } from "next";
import { connectToAdminDatabase } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message } = req.body;

  if (!name || !email || !message || message.length < 10) {
    return res.status(400).json({ error: "Invalid form submission" });
  }

  try {
    // ✅ Save to DB
    const { db } = await connectToAdminDatabase();
    await db.collection("messages").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // ✅ Set up transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });

    // ✅ Email to YOU
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `📬 New Contact Message from ${name}`,
      html: `
        <h2>New Message from Roaming in the Know</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
        <hr />
        <small>This message was sent from your contact form.</small>
      `,
    });

    // ✅ Confirmation email to USER
    await transporter.sendMail({
      from: `"Roaming In The Know" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: "Thanks for reaching out to Roaming In The Know!",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px 0; margin: 0;">
      <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #dddddd; border-radius: 6px; color: #333333; font-size: 16px; line-height: 1.6;">
        <p style="margin-top: 0;">Hey ${name},</p>
        <p>Thanks for reaching out! We’ve received your message and will get back to you soon.</p>
        <p>Your message:</p>
        <blockquote style="border-left: 4px solid #cccccc; margin: 20px 0; padding-left: 16px; color: #555555; font-style: italic;">
          ${message}
        </blockquote>
        <p>Safe travels,<br/> Alia & Shawn </p>
<div style="margin-top: 40px; font-size: 14px; color: #444;">
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
<img src="https://www.roamingintheknow.com/logo1.png" alt="Roaming In The Know Logo" style="max-width: 90px; margin-bottom: 16px;" />
          <p style="margin: 0;"><strong>Alia & Shawn</strong>, Full-Time Travellers & Travel Content Creators</p>
          <p style="margin: 0;">Currently: Canada</p>
          <p style="margin: 0;">Web: <a href="https://www.roamingintheknow.com" style="color: #007BFF;">www.roamingintheknow.com</a></p>
          <p style="margin: 0;">Instagram: <a href="https://www.instagram.com/roamingintheknow" style="color: #007BFF;">@roamingintheknow</a></p>
        </div>


        <hr style="margin-top: 40px; border: none; border-top: 1px solid #eeeeee;" />
        <div style="font-size: 13px; color: #999999; text-align: center; margin-top: 20px;">
          You’re receiving this email because you submitted a message through our website contact form.
        </div>
      </div>
    </div>
  `,
    });

    res.status(200).json({ message: "Message and confirmation sent" });
  } catch (error) {
    console.error("❌ Contact API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
