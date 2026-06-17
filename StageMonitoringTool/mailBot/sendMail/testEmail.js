// send-test.js
import transporter from '../mailConnection.js';

// Definieer de e-mailopties
const mailOptions = {
  from: '"Je Naam of Bedrijf" <stageatehb@gmail.com>', // Afzender (moet vaak matchen met de auth user)
  to: 'hysenaj.jon@hotmail.com',                         // Ontvanger
  subject: 'Dit is een test e-mail!',                  // Onderwerp
  text: 'Hallo! Dit is een simpele tekstversie van de mail.', // Tekstversie
  html: '<h1>Hallo!</h1><p>Dit is een <b>HTML-versie</b> van de test-mail.</p>' // HTML-versie
};

// Functie om de mail te versturen
async function sendMail() {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail succesvol verzonden!');
    console.log('Bericht ID:', info.messageId);
  } catch (error) {
    console.error('Er is iets misgegaan bij het verzenden:', error);
  }
}

// Voer de functie uit
sendMail();