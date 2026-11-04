import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#101114] text-[#eceff1] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-2">404 - Seite nicht gefunden</h2>
      <p className="text-sm text-[#8a94a6] mb-4">Die angeforderte Ressource existiert nicht.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-[#fea000] text-[#10131a] text-xs font-semibold hover:bg-[#fea000]/90 transition-colors"
      >
        Zurück zur Hauptseite
      </Link>
    </div>
  );
}
