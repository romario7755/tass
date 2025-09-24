import { Resend } from 'resend';
import * as crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateActivationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function sendActivationEmail(
  email: string,
  name: string,
  activationToken: string
) {
  const activationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${activationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <atassieromario5@gmail.com>`,
      to: [email],
      subject: 'Activez votre compte',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Activation de compte</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Bienvenue ${name} !</h1>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                Merci de vous être inscrit ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}"
                 style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                Activer mon compte
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all;">${activationUrl}</p>
              <p>Ce lien expirera dans 24 heures.</p>
              <p style="margin-top: 20px;">
                Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <atassieromario5@gmail.com>`,
      to: [email],
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
                Bonjour ${name},
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

export async function sendPurchaseConfirmationToBuyer(
  buyerEmail: string,
  buyerName: string,
  sellerEmail: string,
  sellerName: string,
  carInfo: {
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <atassieromario5@gmail.com>`,
      to: [buyerEmail],
      subject: 'Confirmation d\'achat - Informations du vendeur',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Confirmation d'achat</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Félicitations ${buyerName} !</h1>
            </div>

            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <strong>✅ Votre achat a été confirmé avec succès</strong>
            </div>

            <h3 style="color: #333;">Détails de l'article acheté :</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Titre :</strong> ${carInfo.title}</p>
              <p style="margin: 5px 0;"><strong>Marque :</strong> ${carInfo.brand}</p>
              <p style="margin: 5px 0;"><strong>Modèle :</strong> ${carInfo.model}</p>
              <p style="margin: 5px 0;"><strong>Année :</strong> ${carInfo.year}</p>
              <p style="margin: 5px 0;"><strong>Prix :</strong> ${carInfo.price.toLocaleString('fr-FR')} €</p>
            </div>

            <h3 style="color: #333;">Informations du vendeur :</h3>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Nom :</strong> ${sellerName}</p>
              <p style="margin: 5px 0;"><strong>Email :</strong> <a href="mailto:${sellerEmail}" style="color: #007bff;">${sellerEmail}</a></p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                Vous pouvez maintenant contacter le vendeur directement pour organiser la remise du véhicule.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
              <p>Merci pour votre confiance !</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation à l\'acheteur:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation à l\'acheteur:', error);
    return { success: false, error };
  }
}

export async function sendInvoiceEmailToBuyer(
  buyerEmail: string,
  buyerName: string,
  sellerName: string,
  paymentId: string,
  carInfo: {
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
  }
) {
  console.log(`📧 [FACTURE] Préparation de l'envoi à ${buyerEmail}`)
  const invoiceNumber = `INV-${Date.now()}-${paymentId.slice(-6).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('fr-FR');

  console.log(`📧 [FACTURE] Configuration email - Host: ${process.env.EMAIL_HOST}, User: ${process.env.EMAIL_USER}`)

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <atassieromario5@gmail.com>`,
      to: [buyerEmail],
      subject: `Facture #${invoiceNumber} - Achat confirmé`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #ddd;">
          <!-- En-tête de la facture -->
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">FACTURE</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Numéro: ${invoiceNumber}</p>
          </div>

          <!-- Informations générales -->
          <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
              <div>
                <h3 style="color: #333; margin-top: 0;">Facturé à :</h3>
                <p style="margin: 5px 0;"><strong>${buyerName}</strong></p>
                <p style="margin: 5px 0;">${buyerEmail}</p>
              </div>
              <div style="text-align: right;">
                <h3 style="color: #333; margin-top: 0;">Détails :</h3>
                <p style="margin: 5px 0;"><strong>Date :</strong> ${currentDate}</p>
                <p style="margin: 5px 0;"><strong>Vendeur :</strong> ${sellerName}</p>
                <p style="margin: 5px 0;"><strong>ID Transaction :</strong> ${paymentId.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <!-- Tableau des articles -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Description</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Quantité</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Prix unitaire</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">
                    <strong>${carInfo.title}</strong><br>
                    <small style="color: #666;">
                      ${carInfo.brand} ${carInfo.model} (${carInfo.year})
                    </small>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">1</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${carInfo.price.toLocaleString('fr-FR')} €</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><strong>${carInfo.price.toLocaleString('fr-FR')} €</strong></td>
                </tr>
              </tbody>
            </table>

            <!-- Total -->
            <div style="text-align: right; margin-top: 20px;">
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; display: inline-block; min-width: 250px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Sous-total :</span>
                  <span>${carInfo.price.toLocaleString('fr-FR')} €</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>TVA (0%) :</span>
                  <span>0,00 €</span>
                </div>
                <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #007bff;">
                  <span>TOTAL :</span>
                  <span>${carInfo.price.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>

            <!-- Statut du paiement -->
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <strong>✅ PAIEMENT CONFIRMÉ</strong><br>
              <small>Votre paiement a été traité avec succès</small>
            </div>

            <!-- Informations supplémentaires -->
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h4 style="margin-top: 0; color: #333;">Prochaines étapes :</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Le vendeur a été notifié de votre achat</li>
                <li>Vous recevrez sous peu les coordonnées du vendeur</li>
                <li>Contactez le vendeur pour organiser la remise du véhicule</li>
              </ul>
            </div>

            <!-- Pied de page -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
              <p>Merci pour votre confiance !</p>
              <p>Cette facture a été générée automatiquement le ${currentDate}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ [FACTURE] Erreur lors de l\'envoi de la facture à l\'acheteur:', error);
      return { success: false, error };
    }

    console.log(`✅ [FACTURE] Email envoyé avec succès à ${buyerEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ [FACTURE] Erreur lors de l\'envoi de la facture à l\'acheteur:', error);
    return { success: false, error };
  }
}

export async function sendSaleNotificationToSeller(
  sellerEmail: string,
  sellerName: string,
  buyerEmail: string,
  buyerName: string,
  carInfo: {
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Support'} <atassieromario5@gmail.com>`,
      to: [sellerEmail],
      subject: 'Vente confirmée - Informations de l\'acheteur',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Vente confirmée</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Félicitations ${sellerName} !</h1>
            </div>

            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <strong>🎉 Votre véhicule a été vendu avec succès</strong>
            </div>

            <h3 style="color: #333;">Détails de l'article vendu :</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Titre :</strong> ${carInfo.title}</p>
              <p style="margin: 5px 0;"><strong>Marque :</strong> ${carInfo.brand}</p>
              <p style="margin: 5px 0;"><strong>Modèle :</strong> ${carInfo.model}</p>
              <p style="margin: 5px 0;"><strong>Année :</strong> ${carInfo.year}</p>
              <p style="margin: 5px 0;"><strong>Prix de vente :</strong> ${carInfo.price.toLocaleString('fr-FR')} €</p>
            </div>

            <h3 style="color: #333;">Informations de l'acheteur :</h3>
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Nom :</strong> ${buyerName}</p>
              <p style="margin: 5px 0;"><strong>Email :</strong> <a href="mailto:${buyerEmail}" style="color: #007bff;">${buyerEmail}</a></p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                L'acheteur va probablement vous contacter pour organiser la remise du véhicule.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
              <p>Merci d'utiliser notre plateforme !</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de notification au vendeur:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification au vendeur:', error);
    return { success: false, error };
  }
}