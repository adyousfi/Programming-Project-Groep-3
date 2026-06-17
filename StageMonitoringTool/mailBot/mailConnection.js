// mailer.js
const nodemailer = require('nodemailer');

// Maak de transporter aan met de SMTP-instellingen
const transporter = nodemailer.createTransport({
  host: 'smtp.voorbeeld.com', // Vervang door de SMTP-host van jouw provider (bijv. smtp.gmail.com)
  port: 587,                  // Vaak 587 voor STARTTLS, of 465 for SSL
  secure: false,              // true voor poort 465, false voor andere poorten
  auth: {
    user: 'jouw-email@voorbeeld.nl', // Jouw e-mailadres
    pass: 'jouw-wachtwoord-of-app-wachtwoord' // Jouw e-mailwachtwoord (of app-specifiek wachtwoord)
  }
});

// Exporteer de transporter zodat andere bestanden hem kunnen importeren
module.exports = transporter;