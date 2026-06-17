// mailer.js
import nodemailer from 'nodemailer';

// Maak de transporter aan met de SMTP-instellingen
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Vervang door de SMTP-host van jouw provider (bijv. smtp.gmail.com)
  port: 465,                  // Vaak 587 voor STARTTLS, of 465 for SSL
  secure: true,              // true voor poort 465, false voor andere poorten
  auth: {
    user: 'stageatehb@gmail.com', // Jouw e-mailadres
    pass: 'iawx pavu ygxp qlzs' // Jouw e-mailwachtwoord (of app-specifiek wachtwoord)
  }
});

export default transporter;