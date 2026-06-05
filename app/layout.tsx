import type React from "react"
import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seed.music"

const faqItems = [
  {
    question: "What is Seed Music and how does it work?",
    answer:
      "Seed Music is an AI music generator landing page and studio preview for exploring prompt-to-song, lyric-to-song, and audio-reference workflows.",
  },
  {
    question: "Are Seed Music, Seed-Music, and seedmusic the same page?",
    answer:
      "Yes. Seed Music is the primary keyword for this page, while Seed-Music and seedmusic are alternate spellings used to find the same AI music workflow preview.",
  },
  {
    question: "Can I use Seed Music for commercial projects?",
    answer:
      "Commercial use depends on the generation provider and license terms connected to the final product. Review those terms before using any generated track commercially.",
  },
  {
    question: "Does Seed Music claim to be an official product?",
    answer:
      "No. Seed Music is an independent AI music generation landing page and is not affiliated with ByteDance, the Seed research team, or any other company unless explicitly stated.",
  },
]

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Seed Music",
    alternateName: ["SeedMusic", "Seed-Music", "seedmusic"],
    url: siteUrl,
    description:
      "Seed Music helps creators explore AI music generation workflows for prompts, lyrics, style controls, and audio-reference music previews.",
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#app`,
    name: "Seed Music",
    alternateName: ["SeedMusic", "Seed-Music", "seedmusic"],
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "Seed Music is an AI music generator studio preview for prompt-to-music, lyric-to-song, and audio-reference creative workflows.",
    isAccessibleForFree: true,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
]

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Seed Music AI Generator | Seed-Music Studio Preview",
  description:
    "Seed Music helps creators explore AI music workflows: prompt-to-song drafts, lyric ideas, style controls, and audio-reference previews for seedmusic creators.",
  keywords: [
    "Seed Music",
    "Seed-Music",
    "seedmusic",
    "SeedMusic",
    "Seed Music AI",
    "Seed-Music AI",
    "SeedMusic generator",
    "AI music generator",
    "AI song maker",
    "prompt to music",
    "lyric to song",
    "AI music",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Seed Music AI Generator | Seed-Music Studio Preview",
    description:
      "Explore Seed Music for prompt-to-song drafts, lyric ideas, style controls, and audio-reference AI music workflows.",
    siteName: "Seed Music",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Seed Music AI generator studio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seed Music AI Generator | Seed-Music Studio Preview",
    description:
      "Explore Seed Music AI workflows for prompts, lyrics, style controls, and audio-reference previews.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased bg-[#F7F5F3]`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
