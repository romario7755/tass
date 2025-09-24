import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailVerificationOptions {
  to: string;
  verificationUrl: string;
  name?: string;
}

export interface PasswordResetOptions {
  to: string;
  resetUrl: string;
  name?: string;
}

export async function sendEmailVerification({ to, verificationUrl, name }: EmailVerificationOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <onboarding@resend.dev>`,
      to: [to],
      subject: 'Vérifiez votre adresse email',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Vérification email</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Vérifiez votre adresse email</h1>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                ${name ? `Bonjour ${name},` : 'Bonjour,'}
              </p>
              <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.5;">
                Merci de vous être inscrit ! Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                Vérifier mon email
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all;">${verificationUrl}</p>
              <p style="margin-top: 20px;">
                Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    return { success: false, error };
  }
}

export async function sendPasswordReset({ to, resetUrl, name }: PasswordResetOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <onboarding@resend.dev>`,
      to: [to],
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Réinitialisation mot de passe</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Réinitialisation de votre mot de passe</h1>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                ${name ? `Bonjour ${name},` : 'Bonjour,'}
              </p>
              <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.5;">
                Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="display: inline-block; background-color: #dc3545; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                Réinitialiser mon mot de passe
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p>Ce lien expire dans 1 heure pour des raisons de sécurité.</p>
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all;">${resetUrl}</p>
              <p style="margin-top: 20px;">
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    return { success: false, error };
  }
}