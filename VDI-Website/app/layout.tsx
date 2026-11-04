import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VDI 4640 Blatt 1 — Geologische Wärmeleitfähigkeitsmatrix',
  description: 'Interaktiver Vergleich und normgerechte Datenabfrage der Wärmeleitfähigkeit (λ in W/m·K) und Materialkennwerte nach VDI 4640 Blatt 1 (2010-06).',
  openGraph: {
    title: 'VDI 4640 Blatt 1 — Geologische Wärmeleitfähigkeitsmatrix',
    description: 'Interaktiver Vergleich und normgerechte Datenabfrage der Wärmeleitfähigkeit (λ in W/m·K) und Materialkennwerte nach VDI 4640 Blatt 1 (2010-06).',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VDI 4640 Blatt 1 — Geologische Wärmeleitfähigkeitsmatrix',
    description: 'Interaktiver Vergleich und normgerechte Datenabfrage der Wärmeleitfähigkeit (λ in W/m·K) und Materialkennwerte nach VDI 4640 Blatt 1 (2010-06).',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="de">
      <body suppressHydrationWarning className="bg-[#101114] text-[#eceff1] antialiased selection:bg-[#fea000]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
