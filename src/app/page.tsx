'use client';

import { useEffect, useState } from 'react';
import { TransportTicket } from './components/types';
import TicketItem from './components/TicketItem';
import TicketDetails from './components/TicketDetails';
import StarAnimation from './components/StarAnimation';

export default function Home() {
  const [tickets, setTickets] = useState<TransportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TransportTicket | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tickets');
        const data = await response.json();
        console.log('Données reçues de l\'API:', data);
        setTickets(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleViewTicket = (ticket: TransportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  return (
    <main className="min-h-screen relative">
      {/* Animation des étoiles */}
      <StarAnimation />
      
      {/* Fond avec dégradé moderne */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 opacity-70">
        <div className="absolute inset-0 bg-[url('/images/bus-background.jpg')] opacity-100"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Liste des Tickets de Transport
          </h1>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid gap-8">
              {tickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onView={handleViewTicket}
                />
              ))}
            </div>
          )}

          {/* Modal pour afficher les détails du ticket */}
          {selectedTicket && (
            <TicketDetails
              ticket={selectedTicket}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </main>
  );
}
