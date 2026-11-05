import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

async function send({ to, subject, html }) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) console.error("Resend error:", error);
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

const details = (b) => `
  <table cellpadding="6" style="border-collapse:collapse">
    <tr><td><b>Studio</b></td><td>${esc(b.studioTitle)}</td></tr>
    <tr><td><b>Date</b></td><td>${esc(b.date)}</td></tr>
    <tr><td><b>Time</b></td><td>${esc(b.startTime)} - ${esc(b.endTime)}</td></tr>
    <tr><td><b>Total</b></td><td>$${esc(b.totalPrice)}</td></tr>
    <tr><td><b>Status</b></td><td>${esc(b.status)}</td></tr>
  </table>`;

export async function sendBookingCreatedEmails(booking) {
  await Promise.all([
    send({
      to: booking.userEmail,
      subject: "Booking request received - StudioSpace",
      html: `<h2>Your booking request is received</h2>
        <p>It is pending until the host confirms it.</p>${details(booking)}`,
    }),
    send({
      to: booking.hostEmail,
      subject: "New booking request - StudioSpace",
      html: `<h2>You have a new booking request</h2>
        <p>Open your dashboard to confirm it.</p>${details(booking)}`,
    }),
  ]);
}

export async function sendBookingConfirmedEmail(booking) {
  await send({
    to: booking.userEmail,
    subject: "Your booking is confirmed - StudioSpace",
    html: `<h2>Your booking is confirmed</h2>${details(booking)}`,
  });
}
