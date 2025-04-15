import AnimatedQRCode from './components/AnimatedQRCode';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Générateur de QR Code Animé
        </h1>
        <AnimatedQRCode data="https://example.com" />
      </div>
    </main>
  );
}
