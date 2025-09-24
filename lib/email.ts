import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendWelcomeEmailParams {
  email: string;
  name?: string | null;
}

export async function sendWelcomeEmail({ email, name }: SendWelcomeEmailParams) {
  try {
    const data = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Bienvenue ! Votre compte a été créé avec succès',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Bienvenue ${name || 'cher utilisateur'} !</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Votre compte a été créé avec succès. Vous pouvez maintenant profiter de tous nos services.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}"
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Accéder à votre compte
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            Merci de nous faire confiance !
          </p>
        </div>
      `,
    });

    console.log('Email de bienvenue envoyé:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return { success: false, error };
  }
}

interface SendLoginNotificationParams {
  email: string;
  name?: string | null;
}

export async function sendLoginNotification({ email, name }: SendLoginNotificationParams) {
  try {
    const data = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Nouvelle connexion à votre compte',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Connexion détectée</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Bonjour ${name || 'cher utilisateur'},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Nous vous informons qu'une connexion a été effectuée sur votre compte le ${new Date().toLocaleString('fr-FR')}.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Si cette connexion n'est pas de vous, veuillez nous contacter immédiatement.
          </p>
          <p style="color: #999; font-size: 14px; text-align: center;">
            Équipe de sécurité
          </p>
        </div>
      `,
    });

    console.log('Email de notification de connexion envoyé:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    return { success: false, error };
  }
}