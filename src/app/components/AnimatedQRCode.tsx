import React from 'react';

interface AnimatedQRCodeProps {
  data: string;
}

const AnimatedQRCode: React.FC<AnimatedQRCodeProps> = ({ data }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">QR Code Animé</h2>
        <div className="w-64 h-64 bg-gray-200 animate-pulse">
          {/* Le QR code sera implémenté ici */}
        </div>
      </div>
    </div>
  );
};

export default AnimatedQRCode; 