require('dotenv').config();
const Mailjet = require('node-mailjet');

// ⚡ Connexion Mailjet
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

/**
 * Envoi d'un mail via Mailjet
 */
async function sendMail({ to, subject, html }) {
  const timestamp = new Date().toISOString();

  try {
    const fromEmail = process.env.SITE_EMAIL || 'noreply@tondomaine.com';
    const fromName = process.env.SITE_NAME || 'Iventello';

    if (!to) throw new Error('Adresse email destinataire introuvable.');

    const message = {
      Messages: [
        {
          From: { Email: fromEmail, Name: fromName },
          To: [{ Email: to, Name: 'Client' }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    };

    console.log(`[${timestamp}] 📨 Envoi mail à ${to}`);

    const response = await Promise.race([
      mailjet.post('send', { version: 'v3.1' }).request(message),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout Mailjet 10s')), 10000))
    ]);

    console.log(`[${timestamp}] ✅ Mail envoyé`);
    return { success: true, response: response.body };
  } catch (err) {
    console.error(`[${timestamp}] ❌ Erreur mail :`, err.message);
    if (err.response?.body) console.error('Détails Mailjet :', JSON.stringify(err.response.body, null, 2));
    return { success: false, error: err };
  }
}

/**
 * Test de connexion à Mailjet
 */
async function testMailjetConnection() {
  try {
    const response = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: { Email: process.env.SITE_EMAIL, Name: process.env.SITE_NAME },
            To: [{ Email: 'djeutchouruxel@gmail.com', Name: 'Moi' }],
            Subject: 'Test Mailjet',
            TextPart: 'Ceci est un test',
            HTMLPart: '<h3>Ceci est un test</h3>'
          }
        ]
      });

    console.log('✅ Mailjet response:');
    console.log(JSON.stringify(response.body, null, 2)); // corps de la réponse lisible
  } catch (err) {
    console.error('❌ Mailjet error:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err);
    }
  }
}

module.exports = { mailjet, sendMail, testMailjetConnection };
