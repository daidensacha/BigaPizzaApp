// utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure env is loaded even if server hasn't called dotenv yet
dotenv.config();

function buildTransport() {
  const provider = (process.env.EMAIL_PROVIDER || 'console').toLowerCase();
  console.log('[email] provider picked:', provider);

  if (provider === 'mailtrap') {
    const host = process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io';
    const port = Number(process.env.MAILTRAP_PORT || 2525);
    const user = process.env.MAILTRAP_USER;
    const pass = process.env.MAILTRAP_PASS;

    console.log('[email] MAILTRAP_HOST:', host, 'PORT:', port);
    if (!user || !pass) {
      console.warn('[email] Missing MAILTRAP_USER or MAILTRAP_PASS');
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: false, // STARTTLS will upgrade
      auth: { user, pass },
      logger: true, // verbose while we debug
      debug: true, // verbose while we debug
    });
  }

  if (provider === 'sendgrid') {
    // Classic SMTP for SendGrid
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASS, // your SendGrid API key
      },
      logger: true,
      debug: true,
    });
  }

  // Default: console transport (no external send)
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
    logger: true,
    debug: true,
  });
}

// Lazily create the transporter AFTER envs are available
let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = buildTransport();
  // Show final resolved options once (helps diagnose)
  console.log('[email] transporter.options:', _transporter.options);
  return _transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || 'Biga Pizza <no-reply@bigapizza.local>';

  const info = await transporter.sendMail({ from, to, subject, html, text });

  // Helpful logging in dev
  const provider = (process.env.EMAIL_PROVIDER || 'console').toLowerCase();
  console.log('[email] response:', info?.response);
  console.log('[email] messageId:', info?.messageId);
  console.log('[email] accepted:', info?.accepted);
  console.log('[email] rejected:', info?.rejected);
  if (provider === 'console' || provider === 'mailtrap') {
    console.log('[email] provider:', provider);
    console.log('[email] to:', to, 'subject:', subject);
    if (info?.message) console.log(info.message.toString());
  }

  return info;
}

// Optional: call once on startup (from server.js) to test connectivity
export async function verifyEmailTransport() {
  try {
    const transporter = getTransporter();
    const ok = await transporter.verify();
    console.log('[email] transporter.verify():', ok);
    if (!ok) {
      console.warn('[email] VERIFY returned false (not always supported).');
    }
  } catch (e) {
    console.error('[email] verify failed:', e);
  }
}
