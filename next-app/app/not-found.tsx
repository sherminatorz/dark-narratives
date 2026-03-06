import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0b] text-[#e8e8e8] font-sans">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-8xl font-bold text-[#b11226] font-serif mb-4">404</h1>
          <h2 className="text-3xl font-serif mb-4">Lost in the Shadows</h2>
          <p className="text-[#888888] text-lg mb-8 max-w-md">
            The page you&apos;re looking for has vanished without a trace.
          </p>
          <Link
            href="/en"
            className="px-6 py-3 bg-[#b11226] text-white rounded-lg hover:bg-[#d4182f] transition-colors"
          >
            Return to Safety
          </Link>
        </div>
      </body>
    </html>
  );
}
