import { motion, useAnimationFrame } from 'framer-motion';
import { TransportTicket } from './types';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';

interface TicketDetailsProps {
  ticket: TransportTicket;
  onClose: () => void;
}

export default function TicketDetails({ ticket, onClose }: TicketDetailsProps) {
  const [hue, setHue] = useState(0);
  const requestRef = useRef<number | null>(null);

  // Animation de la couleur optimisée
  useAnimationFrame((t) => {
    if (requestRef.current) {
      setHue((prev) => (prev + 0.1) % 360);
    }
    requestRef.current = requestAnimationFrame(() => {});
  });

  // Création d'une chaîne de caractères contenant toutes les informations du ticket
  const ticketInfo = JSON.stringify({
    id: ticket.id,
    //type: ticket.type,
    //ligne: ticket.ligne,
    //destination: ticket.destination,
    //date: ticket.date,
    //heure: ticket.heure,
    //validite: ticket.validite,
    //prix: ticket.prix,
    //utilisateur: ticket.utilisateur,
    //validated: ticket.validated,
    //validatedAt: ticket.validatedAt
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: [
            `0 0 30px 10px hsla(${hue}, 100%, 70%, 0.3)`,
            `0 0 50px 20px hsla(${hue}, 100%, 50%, 0.2)`
          ]
        }}
        transition={{
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
        style={{
          background: `linear-gradient(135deg, hsla(${hue}, 50%, 98%, 1), white)`,
        }}
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative"
      >
        <div className="overflow-y-auto p-4 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 
            className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
            style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
          >
            Détails du Ticket
          </h2>
          
          <div className="flex flex-col items-center space-y-4 sm:space-y-8">
            {/* QR Code avec animation */}
            <motion.div 
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: `linear-gradient(135deg, hsla(${hue}, 50%, 98%, 1), white)`,
              }}
            >
              {/* Première vague */}
              <motion.div
                className="absolute inset-0 z-0"
                animate={{
                  background: [
                    `radial-gradient(circle at 30% 30%, hsla(${hue}, 100%, 70%, 0.3) 0%, transparent 70%)`,
                    `radial-gradient(circle at 70% 70%, hsla(${hue}, 100%, 70%, 0.3) 0%, transparent 70%)`
                  ],
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1]
                }}
              />
              {/* Deuxième vague */}
              <motion.div
                className="absolute inset-0 z-0"
                animate={{
                  background: [
                    `radial-gradient(circle at 70% 30%, hsla(${(hue + 60) % 360}, 100%, 70%, 0.3) 0%, transparent 70%)`,
                    `radial-gradient(circle at 30% 70%, hsla(${(hue + 60) % 360}, 100%, 70%, 0.3) 0%, transparent 70%)`
                  ],
                  scale: [1.5, 1, 1.5],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1]
                }}
              />
              {/* Effet de brillance */}
              <motion.div
                className="absolute inset-0 z-0"
                animate={{
                  background: [
                    `linear-gradient(45deg, transparent 0%, hsla(${hue}, 100%, 70%, 0.4) 50%, transparent 100%)`,
                    `linear-gradient(45deg, transparent 100%, hsla(${hue}, 100%, 70%, 0.4) 50%, transparent 0%)`
                  ],
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative z-10 flex flex-col items-center space-y-2 sm:space-y-4 p-4 sm:p-8">
                <motion.div
                  className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-xl"
                  animate={{
                    boxShadow: [
                      `0 0 30px 10px hsla(${hue}, 100%, 70%, 0.4)`,
                      `0 0 50px 15px hsla(${hue}, 100%, 50%, 0.2)`
                    ],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    },
                    y: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      rotate: [0, -2, 2, 0],
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      rotate: {
                        duration: 0.5,
                        repeat: 0
                      }
                    }}
                  >
                    <QRCodeSVG
                      value={ticketInfo}
                      size={200}
                      level="H"
                      includeMargin
                      className="rounded-lg"
                      bgColor="#FFFFFF"
                      fgColor={`hsla(${hue}, 70%, 30%, 1)`}
                    />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center space-y-1 sm:space-y-2 backdrop-blur-md bg-white/40 px-4 sm:px-8 py-2 sm:py-4 rounded-xl"
                  animate={{
                    boxShadow: [
                      `0 0 20px 5px hsla(${hue}, 100%, 70%, 0.2)`,
                      `0 0 30px 8px hsla(${hue}, 100%, 50%, 0.1)`
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                >
                  <p 
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                  >
                    Scannez pour vérifier la validité
                  </p>
                  <p className="text-xs text-gray-600">QR Code unique pour ce ticket</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Informations du ticket */}
            <motion.div 
              className="w-full rounded-xl p-4 sm:p-6"
              animate={{
                backgroundColor: `hsla(${hue}, 30%, 97%, 1)`,
                boxShadow: [
                  `0 0 20px 5px hsla(${hue}, 100%, 70%, 0.1)`,
                  `0 0 30px 10px hsla(${hue}, 100%, 50%, 0.05)`
                ]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ligne</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.ligne}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">N° Paiement</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.numeroPaiement}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Heure</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.heure}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Validité</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.validite} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID Transaction</p>
                    <p 
                      className="font-medium text-sm sm:text-base"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.transactionId}
                    </p>
                  </div>
                </div>
              </div>
              <motion.div 
                className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t"
                style={{ borderColor: `hsla(${hue}, 30%, 90%, 1)` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Prix</p>
                    <p 
                      className="text-2xl sm:text-3xl font-bold"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.prix}F CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Utilisateur</p>
                    <p 
                      className="text-base sm:text-lg font-medium"
                      style={{ color: `hsla(${hue}, 70%, 30%, 1)` }}
                    >
                      {ticket.utilisateur}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 