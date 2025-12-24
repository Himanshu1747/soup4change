import nodemailer from 'nodemailer';

export const POST = async ({ request }: { request: Request }) => {
  console.log("USER:", import.meta.env.PUBLIC_EMAIL_USER);
  console.log("PASS:", import.meta.env.PUBLIC_EMAIL_PASS);
  try {
    const data = await request.formData();
    const fullname = data.get("fullname");
    const email = data.get("email");
    const phone = data.get("phone");
    const zip = data.get("zip");
    const message = data.get("message");

    // Create the transporter using Astro env variables
    const transporter = nodemailer.createTransport({
      host: import.meta.env.PUBLIC_EMAIL_HOST,
      port: import.meta.env.PUBLIC_EMAIL_PORT,
      service: 'gmail',
      auth: {
        user: import.meta.env.PUBLIC_EMAIL_USER,
        pass: import.meta.env.PUBLIC_EMAIL_PASS,
      },
    });

    // Send the mail
    await transporter.sendMail({
      from: `"${fullname}" <${email}>`, // This shows the user's name/email in the "From" section
      to: import.meta.env.PUBLIC_EMAIL_USER,    // HARDCODE THIS for testing
      subject: `New Contact Form: ${fullname}`,
      html: `
    <h3>New Contact Submission</h3>
    <p><strong>Name:</strong> ${fullname}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Zip Code:</strong> ${zip}</p>
    <p><strong>Message:</strong> ${message}</p>
  `,
    });

    return new Response(JSON.stringify({ message: "Sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error sending email" }), { status: 500 });
  }
};