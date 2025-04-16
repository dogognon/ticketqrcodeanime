import { motion } from 'framer-motion';
import { TransportTicket } from './types';

interface TicketItemProps {
  ticket: TransportTicket;
  onView: (ticket: TransportTicket) => void;
}

const isTicketExpired = (ticket: TransportTicket) => {
  const ticketDate = new Date(`${ticket.date} ${ticket.heure}`);
  const validityInMs = ticket.validite * 60 * 1000;
  const expirationDate = new Date(ticketDate.getTime() + validityInMs);
  return new Date() > expirationDate;
};

const getTicketColorScheme = (ticket: TransportTicket) => {
  if (isTicketExpired(ticket)) {
    return {
      header: 'bg-gray-400',
      text: 'text-gray-200',
      button: 'bg-gray-400 cursor-not-allowed',
      gradientFrom: '#9ca3af',
      gradientTo: '#6b7280',
      isExpired: true,
      isValidated: false
    };
  }

  if (ticket.validated) {
    if (ticket.validite <= 60) {
      return {
        header: 'bg-emerald-700',
        text: 'text-emerald-100',
        button: 'bg-emerald-700',
        gradientFrom: '#047857',
        gradientTo: '#065f46',
        isExpired: false,
        isValidated: true
      };
    } else if (ticket.validite <= 120) {
      return {
        header: 'bg-blue-700',
        text: 'text-blue-100',
        button: 'bg-blue-700',
        gradientFrom: '#1d4ed8',
        gradientTo: '#1e40af',
        isExpired: false,
        isValidated: true
      };
    } else {
      return {
        header: 'bg-violet-700',
        text: 'text-violet-100',
        button: 'bg-violet-700',
        gradientFrom: '#7e22ce',
        gradientTo: '#6b21a8',
        isExpired: false,
        isValidated: true
      };
    }
  } else {
    if (ticket.validite <= 60) {
      return {
        header: 'bg-emerald-600',
        text: 'text-emerald-100',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        gradientFrom: '#34d399',
        gradientTo: '#059669',
        isExpired: false,
        isValidated: false
      };
    } else if (ticket.validite <= 120) {
      return {
        header: 'bg-blue-600',
        text: 'text-blue-100',
        button: 'bg-blue-600 hover:bg-blue-700',
        gradientFrom: '#60a5fa',
        gradientTo: '#2563eb',
        isExpired: false,
        isValidated: false
      };
    } else {
      return {
        header: 'bg-violet-600',
        text: 'text-violet-100',
        button: 'bg-violet-600 hover:bg-violet-700',
        gradientFrom: '#a78bfa',
        gradientTo: '#7c3aed',
        isExpired: false,
        isValidated: false
      };
    }
  }
};

export default function TicketItem({ ticket, onView }: TicketItemProps) {
  const colorScheme = getTicketColorScheme(ticket);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={colorScheme.isExpired ? {} : { scale: 1.02, translateY: -5 }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Bordure animée */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(90deg, ${colorScheme.gradientFrom}, ${colorScheme.gradientTo}, ${colorScheme.gradientFrom})`,
          backgroundSize: '200% 100%',
          padding: '2px',
          opacity: colorScheme.isExpired ? 0.5 : 1
        }}
        animate={colorScheme.isExpired ? {} : {
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          duration: colorScheme.isValidated ? 4 : 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute inset-0 rounded-lg" />
      </motion.div>

      <div className={`relative overflow-hidden  rounded-lg ${colorScheme.isExpired ? 'opacity-75' : ''}`}>
        {/* En-tête avec logo et type de billet */}
        <div className={`${colorScheme.header} text-white p-3 sm:p-4 relative`}>
          {colorScheme.isExpired && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="transform -rotate-12 text-white/90 text-lg sm:text-xl font-bold border-2 border-white/50 px-3 py-1 rounded">
                EXPIRÉ
              </span>
            </div>
          )}
          {colorScheme.isValidated && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-[1px]">
              <span className="transform -rotate-12 text-white/90 text-lg sm:text-xl font-bold border-2 border-white/50 px-3 py-1 rounded">
                VALIDÉ
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Logo/Icône selon le type de transport */}
              <div className={`p-1.5 sm:p-2 ${colorScheme.isValidated ? 'bg-white/20' : 'bg-white/10'} rounded-lg transition-colors`}>
                {ticket.type === 'Monbus' && (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                )}
                {ticket.type === 'MarchéBus' && (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {ticket.type === 'Express' && (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {ticket.type === 'Navette' && (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                )}
                {ticket.type === 'BateauBus' && (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{ticket.type}</h2>
                <p className={`${colorScheme.text} text-xs sm:text-sm`}>Billet N° {ticket.id}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold">{ticket.prix} F CFA</span>
              <p className={`${colorScheme.text} text-xs`}>TTC</p>
            </div>
          </div>
        </div>

        {/* Section trajet avec indicateur de validation */}
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500">LIGNE</p>
              <p className="font-bold text-base sm:text-lg">{ticket.ligne}</p>
              <p className="text-xs text-gray-500">DATE HEURE ACHAT</p>
              <p className="text-xs sm:text-sm text-gray-600">{ticket.date} - {ticket.heure}</p>
            </div>
            <div className="px-2 sm:px-4 relative">
              <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${colorScheme.isValidated ? 'text-emerald-500' : 'text-gray-400'} transition-colors`} 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              {colorScheme.isValidated && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                >
                </motion.div>
              )}
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-500">LiBELLE</p>
              <p className="font-bold text-base sm:text-lg">{ticket.destination}</p>
              <p className="text-xs text-gray-500">VALIDITE</p>
              <p className="text-xs sm:text-sm text-gray-600">Durée : {ticket.validite} min</p>
            </div>
          </div>
        </div>

        {/* Section voyageur et place */}
        <div className="p-3 sm:p-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500">VOYAGEUR</p>
              <p className="font-medium text-sm sm:text-base">{ticket.utilisateur}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">VEHIVULE</p>
              <p className="font-medium text-sm sm:text-base">{ticket.ligne}</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500">N° PAIEMENT</p>
              <p className="font-medium text-xs sm:text-sm">{ticket.numeroPaiement}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">ID TRANSACTION</p>
              <p className="font-medium text-xs sm:text-sm">{ticket.transactionId}</p>
            </div>
          </div>
        </div>

        {/* Pied de billet avec bouton et conditions */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Billet valable uniquement pour le trajet indiqué</p>
            <p className="text-xs text-gray-400">Non échangeable - Non remboursable</p>
            {colorScheme.isExpired && (
              <p className="text-xs text-red-500 mt-1">Ce billet a expiré</p>
            )}
            {colorScheme.isValidated && (
              <p className="text-xs text-emerald-600 mt-1">Ticket validé le {ticket.validatedAt}</p>
            )}
          </div>
          <motion.button
            whileHover={colorScheme.isExpired ? {} : { scale: 1.05 }}
            whileTap={colorScheme.isExpired ? {} : { scale: 0.95 }}
            onClick={() => !colorScheme.isExpired && onView(ticket)}
            className={`${colorScheme.button} text-white px-4 sm:px-6 py-2 rounded-full transition-colors shadow-md flex items-center space-x-2 text-sm sm:text-base`}
          >
            <span>Voir QR Code</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 