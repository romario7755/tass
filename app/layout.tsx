import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TASS-AUTO - Plateforme Premium de Véhicules d'Exception | Achat & Vente Auto",
  description: "🚗 TASS-AUTO : La marketplace #1 pour l'achat et la vente de véhicules d'occasion premium. ✅ Véhicules vérifiés ✅ Paiements sécurisés ✅ Garantie 6 mois. Trouvez votre voiture idéale !",
  keywords: "achat voiture occasion, vente voiture, véhicules premium, automobiles d'exception, plateforme automobile, voiture d'occasion, auto occasion, marché automobile",
  authors: [{ name: "TASS-AUTO Team" }],
  creator: "TASS-AUTO",
  publisher: "TASS-AUTO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tass-auto.fr'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
    },
  },
  openGraph: {
    title: "TASS-AUTO - Plateforme Premium de Véhicules d'Exception",
    description: "Découvrez TASS-AUTO, la plateforme premium pour l'achat et la vente de véhicules d'exception. Véhicules vérifiés, transactions sécurisées, service client 24/7.",
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://enre.fr',
    siteName: "TASS-AUTO",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TASS-AUTO - Plateforme Premium de Véhicules',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "TASS-AUTO - Plateforme Premium de Véhicules d'Exception",
    description: "Découvrez TASS-AUTO, la marketplace #1 pour l'achat et la vente de véhicules premium. Véhicules vérifiés, paiements sécurisés.",
    images: ['/og-image.jpg'],
    creator: '@enre_auto',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-code-google',
    yandex: 'verification-code-yandex',
    yahoo: 'verification-code-yahoo',
  },
  category: 'automobile',
  classification: 'Plateforme automobile',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TASS-AUTO",
              "description": "Plateforme premium pour l'achat et la vente de véhicules d'exception",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://enre.fr",
              "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://enre.fr"}/logo.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+33-1-23-45-67-89",
                "contactType": "customer service",
                "availableLanguage": "French"
              },
              "sameAs": [
                "https://twitter.com/enre_auto",
                "https://facebook.com/enre.auto",
                "https://linkedin.com/company/enre"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
