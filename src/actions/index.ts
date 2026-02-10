import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import nodemailer from 'nodemailer';

// Helper to create transporter with specific Gmail/Vercel settings
const getTransporter = () => {
  return nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST,
    port: Number(import.meta.env.SMTP_PORT),
    secure: false, // Must be false for port 587
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASS,
    },
    tls: {
      // Essential for Gmail on serverless environments
      rejectUnauthorized: false,
      minVersion: "TLSv1.2"
    },
  });
};

export const server = {
  sendEmail: defineAction({
    input: z.object({
      fullname: z.string(),
      email: z.string().email(),
      contact: z.string(),
      zip: z.string(),
      message: z.string(),
    }),
    handler: async (input) => {
      const transporter = getTransporter();
      const adminMail = {
        from: `"Website Form" <${import.meta.env.SMTP_USER}>`,
        to: "askmeanything@soup4change.com",
        replyTo: input.email,
        subject: `New Contact: ${input.fullname}`,
        text: `Name: ${input.fullname}\nEmail: ${input.email}\nContact: ${input.contact}\nZip: ${input.zip}\nMessage: ${input.message}`,
      };

      try {
        await transporter.sendMail(adminMail);
        return { success: true };
      } catch (err: any) {
        console.error("ADMIN EMAIL ERROR:", err);
        throw new Error(`Failed to send admin email: ${err.message}`);
      }
    },
  }),

  sendThankYouEmail: defineAction({
    input: z.object({
      email: z.string().email(),
      fullname: z.string(),
    }),
    handler: async (input) => {
      const transporter = getTransporter();
      const userMail = {
        from: `"soup4changes" <${import.meta.env.SMTP_USER}>`,
        to: input.email,
        subject: "Thanks for contacting us!",
        text: `Hi ${input.fullname},\n\nWe received your message and will get back to you soon.`,
      };

      try {
        await transporter.sendMail(userMail);
        return { success: true };
      } catch (err: any) {
        throw new Error(`Failed to send thank you email: ${err.message}`);
      }
    },
  }),

};