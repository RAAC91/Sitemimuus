import type { Metadata } from "next";
import { 
  Geist_Mono, 
  Poppins, 
  Marvel, 
  Black_Ops_One, 
  Bangers, 
  Permanent_Marker, 
  Dancing_Script, 
  Montserrat,
  Geologica,
} from "next/font/google";
import "./globals.css";
import "@/styles/mobile.css";
import { Toaster } from "@/components/ui/sonner"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { AuthProvider } from "@/providers/AuthProvider"
import { AppThemeProvider } from "@/providers/ThemeProvider"
import { PostHogProvider } from "@/providers/PostHogProvider"
import { GoogleAnalytics } from '@next/third-parties/google'
import { SchemaOrg } from "@/components/seo/SchemaOrg"

import { SiteBackground } from "@/components/layout/SiteBackground"
import MobileBottomNav from "@/components/layout/MobileBottomNav"
import { SpeedInsights } from "@vercel/speed-insights/next"

// --- FONTS ---
// Existing fonts (keeping them as they were used elsewhere)
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const geologica = Geologica({ subsets: ['latin'], variable: '--font-geologica', display: 'swap' });
const poppins = Poppins({ weight: ['400', '700', '900'], variable: '--font-poppins', subsets: ['latin'] });
const marvel = Marvel({ weight: ['400', '700'], variable: '--font-marvel', subsets: ['latin'] });
const blackOpsOne = Black_Ops_One({ weight: '400', variable: '--font-black-ops', subsets: ['latin'] });
const bangers = Bangers({ weight: '400', variable: '--font-bangers', subsets: ['latin'] });
const permanentMarker = Permanent_Marker({ weight: '400', variable: '--font-permanent-marker', subsets: ['latin'] });
const dancingScript = Dancing_Script({ variable: '--font-dancing-script', subsets: ['latin'] });
const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mimuus.com'),
  title: {
    default: "Mimuus | Garrafas Térmicas Personalizadas",
    template: "%s | Mimuus"
  },
  description: "Garrafas térmicas personalizadas de alta qualidade. Crie seu design único com nosso editor 3D. Mantém bebidas geladas por 24h e quentes por 12h. Frete grátis acima de R$ 150.",
  keywords: [
    // Principais PT-BR
    "garrafas personalizadas", "garrafa personalizada", "squeeze personalizado", "garrafa térmica personalizada",
    "garrafas térmicas personalizadas", "garrafa de água personalizada", "garrafa inox personalizada",
    "garrafa de aço inox personalizada", "garrafa térmica com nome", "garrafa com foto",
    "garrafinha personalizada", "garrafas customizadas", "garrafa customizada", "squeeze customizado",
    "garrafa com nome", "garrafa com logo", "cantil personalizado", "squeeze térmico personalizado",
    
    // Inglês
    "custom water bottles", "personalized water bottles", "custom bottles", "personalized bottles",
    "custom thermal bottles", "custom stainless steel bottles", "personalized insulated bottles",
    
    // Marcas
    "garrafa tipo stanley", "garrafa estilo stanley", "stanley personalizada", "alternativa stanley",
    "hydroflask personalizada", "contigo personalizada",
    
    // Presentes
    "presente personalizado", "presente criativo", "brinde personalizado", "brinde corporativo",
    "brinde empresarial", "lembrancinha personalizada", "presente dia das mães", "presente dia dos pais",
    
    // Corporativo
    "brindes corporativos personalizados", "brindes empresariais", "garrafa corporativa",
    "garrafa com logo empresa", "merchandising personalizado",
    
    // Esportes
    "garrafa academia", "garrafa treino", "garrafa crossfit", "garrafa fitness", "squeeze academia",
    
    // Características
    "garrafa térmica 500ml", "garrafa térmica 1 litro", "garrafa que mantém gelado",
    "garrafa sem BPA", "garrafa ecológica", "garrafa sustentável",
    
    // Personalização
    "criar garrafa personalizada", "personalizar garrafa online", "editor garrafa personalizada",
    
    // Compra
    "comprar garrafa personalizada", "garrafa personalizada online", "garrafa personalizada barato",
    
    // Long-tail
    "garrafa térmica personalizada com foto", "garrafa de aço inox personalizada com nome",
    "squeeze personalizado para academia", "garrafa personalizada frete grátis"
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://mimuus.com",
    siteName: "Mimuus",
    title: "Mimuus | Garrafas Térmicas Personalizadas",
    description: "Garrafas térmicas personalizadas de alta qualidade. Crie seu design único!",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimuus | Garrafas Térmicas Personalizadas",
    description: "Crie sua garrafa térmica personalizada com nosso editor 3D",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Abril+Fatface&family=Great+Vibes&family=Pacifico&family=Dancing+Script&family=Bebas+Neue&family=Fredoka:wght@400;600&family=Montserrat:wght@400;600&display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${geistMono.variable} ${geologica.variable} ${poppins.variable} ${marvel.variable} ${blackOpsOne.variable} ${bangers.variable} ${permanentMarker.variable} ${dancingScript.variable} ${montserrat.variable} font-sans antialiased selection:bg-rose-500 selection:text-white`}
      >
        <PostHogProvider>
          <AuthProvider>
            <AppThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SchemaOrg 
                type="Organization" 
                data={{
                  name: "Mimuus",
                  url: "https://mimuus.com",
                  logo: "https://mimuus.com/logo.png",
                  contact: "+5511999999999",
                  email: "contato@mimuus.com"
                }} 
              />
              <SiteBackground />
              {children}
              <Toaster />
              <CartDrawer />
              <MobileBottomNav />
            </AppThemeProvider>
          </AuthProvider>
        </PostHogProvider>
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId="G-XYZ123456" />
    </html>
  );
}
