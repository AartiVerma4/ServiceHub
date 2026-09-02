const { Resend } = require("resend");
const twilio = require("twilio");

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const emailFrom = process.env.EMAIL_FROM || "ServiceHub <noreply@servicehub.in>";

// Initialize Twilio
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_NUMBER;
const twilioClient = (twilioSid && twilioAuthToken) ? twilio(twilioSid, twilioAuthToken) : null;

/**
 * Send Transactional Email
 */
async function sendEmail({ to, subject, html, text }) {
  console.log(`[Email Service] Attempting to send email to ${to}. Subject: "${subject}"`);
  if (!resend) {
    console.log(`[Email Mock] RESEND_API_KEY not configured. Email preview:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Text): ${text || "N/A"}`);
    return { mock: true, success: true };
  }

  try {
    const response = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html: html || text,
      text: text
    });
    console.log(`[Email Service] Email sent successfully via Resend. ID:`, response.id || response.data?.id);
    return { success: true, id: response.id || response.data?.id };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send email via Resend:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Transactional SMS
 */
async function sendSMS({ to, body }) {
  console.log(`[SMS Service] Attempting to send SMS to ${to}.`);
  if (!twilioClient || !twilioFrom) {
    console.log(`[SMS Mock] TWILIO credentials not configured. SMS preview:`);
    console.log(`To: ${to}`);
    console.log(`Message: ${body}`);
    return { mock: true, success: true };
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from: twilioFrom,
      to
    });
    console.log(`[SMS Service] SMS sent successfully via Twilio. SID:`, message.sid);
    return { success: true, sid: message.sid };
  } catch (err) {
    console.error(`[SMS Service Error] Failed to send SMS via Twilio:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * High-level notification helpers
 */

async function sendBookingConfirmation(booking, customerUser) {
  const subject = `Booking Confirmed: ${booking.bookingId}`;
  const text = `Hi ${customerUser.name || "Customer"},\n\nYour service booking ${booking.bookingId} has been created for ${booking.scheduledDate} at ${booking.timeSlot}.\n\nThank you for choosing ServiceHub!`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${customerUser.name || "Customer"},</h2>
      <p>Your service booking <strong>${booking.bookingId}</strong> has been successfully confirmed!</p>
      <ul>
        <li><strong>Scheduled Date:</strong> ${booking.scheduledDate}</li>
        <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
        <li><strong>Total Amount:</strong> ₹${booking.pricing.totalAmount}</li>
      </ul>
      <p>We are matching you with the nearest home service expert.</p>
      <br/>
      <p>Best regards,<br/><strong>ServiceHub Team</strong></p>
    </div>
  `;

  await sendEmail({ to: customerUser.email, subject, html, text });
  if (customerUser.phone) {
    await sendSMS({
      to: customerUser.phone,
      body: `Hi ${customerUser.name}, booking ${booking.bookingId} is confirmed for ${booking.scheduledDate} (${booking.timeSlot}). - ServiceHub`
    });
  }
}

async function sendProviderAssigned(booking, customerUser, providerUser) {
  // Notify Customer
  const customerSubject = `Provider Assigned for Booking ${booking.bookingId}`;
  const customerText = `Hi ${customerUser.name},\n\nService expert ${providerUser.name} has been assigned to your booking ${booking.bookingId} on ${booking.scheduledDate}.\n\nContact: ${providerUser.phone || "N/A"}`;
  const customerHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${customerUser.name},</h2>
      <p>A service expert has been assigned to your booking <strong>${booking.bookingId}</strong>!</p>
      <p><strong>Provider Name:</strong> ${providerUser.name}</p>
      <p><strong>Provider Phone:</strong> ${providerUser.phone || "N/A"}</p>
      <br/>
      <p>You can chat with them live on the ServiceHub app.</p>
    </div>
  `;
  await sendEmail({ to: customerUser.email, subject: customerSubject, html: customerHtml, text: customerText });

  // Notify Provider
  const providerSubject = `New Job Assigned: ${booking.bookingId}`;
  const providerText = `Hi ${providerUser.name},\n\nYou have been assigned a new job ${booking.bookingId} for ${booking.scheduledDate} (${booking.timeSlot}).\n\nClient: ${customerUser.name}, Address: ${booking.address.street}, ${booking.address.city}`;
  const providerHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${providerUser.name},</h2>
      <p>You have been assigned a new job <strong>${booking.bookingId}</strong>!</p>
      <ul>
        <li><strong>Client:</strong> ${customerUser.name}</li>
        <li><strong>Scheduled Date:</strong> ${booking.scheduledDate}</li>
        <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
        <li><strong>Address:</strong> ${booking.address.street}, ${booking.address.city}</li>
      </ul>
      <p>Please log in to your Provider Dashboard to manage this job.</p>
    </div>
  `;
  await sendEmail({ to: providerUser.email, subject: providerSubject, html: providerHtml, text: providerText });

  if (customerUser.phone) {
    await sendSMS({
      to: customerUser.phone,
      body: `ServiceHub: Expert ${providerUser.name} is assigned to booking ${booking.bookingId}. Contact: ${providerUser.phone}`
    });
  }
  if (providerUser.phone) {
    await sendSMS({
      to: providerUser.phone,
      body: `ServiceHub: New job ${booking.bookingId} assigned for ${booking.scheduledDate} (${booking.timeSlot}). Client: ${customerUser.name}`
    });
  }
}

async function sendStatusUpdate(booking, customerUser, status) {
  const subject = `Booking Update: ${booking.bookingId} is ${status.toUpperCase()}`;
  const text = `Hi ${customerUser.name},\n\nYour booking ${booking.bookingId} status has been updated to: ${status}.\n\nThank you,\nServiceHub`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${customerUser.name},</h2>
      <p>The status of your booking <strong>${booking.bookingId}</strong> has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
      <p>Thank you for using ServiceHub!</p>
    </div>
  `;
  await sendEmail({ to: customerUser.email, subject, html, text });
}

async function sendRefundInitiated(booking, customerUser, refundAmount) {
  const subject = `Refund Initiated for Booking ${booking.bookingId}`;
  const text = `Hi ${customerUser.name},\n\nA refund of ₹${refundAmount} has been initiated for booking ${booking.bookingId} (Cancelled).\n\nIt should reflect in your account in 5-7 business days.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${customerUser.name},</h2>
      <p>Your booking <strong>${booking.bookingId}</strong> was cancelled, and a refund has been initiated.</p>
      <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>
      <p>The amount should be credited to your original payment method in 5-7 business days.</p>
    </div>
  `;
  await sendEmail({ to: customerUser.email, subject, html, text });

  if (customerUser.phone) {
    await sendSMS({
      to: customerUser.phone,
      body: `ServiceHub: A refund of ₹${refundAmount} has been initiated for cancelled booking ${booking.bookingId}.`
    });
  }
}

async function sendPasswordResetOTP(email, resetUrl) {
  const subject = `Reset Your Password - ServiceHub`;
  const text = `Please reset your password using the following link:\n\n${resetUrl}\n\nThis link is valid for 1 hour.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to complete the process:</p>
      <div style="margin: 20px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>This link is valid for 1 hour.</p>
    </div>
  `;
  await sendEmail({ to: email, subject, html, text });
}

module.exports = {
  sendEmail,
  sendSMS,
  sendBookingConfirmation,
  sendProviderAssigned,
  sendStatusUpdate,
  sendRefundInitiated,
  sendPasswordResetOTP
};
