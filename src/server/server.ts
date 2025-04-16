import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Structure de données pour les tickets de transport
export interface TransportTicket {
  id: string;
  type: 'Monbus' | 'MarchéBus' | 'Express' | 'Navette' | 'BateauBus';
  ligne: string;
  destination: string;
  date: string;
  heure: string;
  validite: number; // en minutes
  prix: number;
  utilisateur: string;
  validated: boolean;
  validatedAt?: string; // Date et heure de validation
  numeroPaiement: string;
  transactionId: string;
}

// Fonction pour générer un ID de ticket avec préfixe journalier
const generateTicketId = (): string => {
  const now = new Date();
  const dayCode = now.toISOString().slice(0, 10).replace(/-/g, '');
  const uuid = uuidv4().split('-')[0];
  return `${dayCode}-${uuid}`;
};

// Base de données temporaire pour les tickets
const tickets: TransportTicket[] = [
  {
    id: generateTicketId(),
    type: 'Monbus',
    ligne: '001',
    destination: 'Yopougon - Plateau',
    date: '2025-04-16',
    heure: '07:35',
    validite: 45,
    prix: 150,
    utilisateur: 'Kouamé N\'Guessan',
    validated: true,
    validatedAt: '2025-04-16 07:37',
    numeroPaiement: '+225 07 07 07 07 07',
    transactionId: 'TRX-20250416-001'
  },
  {
    id: generateTicketId(),
    type: 'MarchéBus',
    ligne: '002',
    destination: 'Adjamé - Cocody',
    date: '2025-04-16',
    heure: '08:15',
    validite: 90,
    prix: 250,
    utilisateur: 'Aïcha Koné',
    validated: false,
    numeroPaiement: '+225 05 05 05 05 05',
    transactionId: 'TRX-20250416-002'
  },
  {
    id: generateTicketId(),
    type: 'Express',
    ligne: '003',
    destination: 'Aéroport - Plateau',
    date: '2025-04-16',
    heure: '09:00',
    validite: 180,
    prix: 8500,
    utilisateur: 'Sékou Diabaté',
    validated: true,
    validatedAt: '2025-04-16 08:55',
    numeroPaiement: '+225 01 01 01 01 01',
    transactionId: 'TRX-20250416-003'
  },
  {
    id: generateTicketId(),
    type: 'Navette',
    ligne: '004',
    destination: 'Université Félix Houphouët-Boigny',
    date: '2025-04-16',
    heure: '10:30',
    validite: 120,
    prix: 500,
    utilisateur: 'Fatou Bamba',
    validated: false,
    numeroPaiement: '+225 07 77 77 77 77',
    transactionId: 'TRX-20250416-004'
  },
  {
    id: generateTicketId(),
    type: 'BateauBus',
    ligne: '005',
    destination: 'Port-Bouët - Plateau',
    date: '2025-04-16',
    heure: '11:30',
    validite: 45,
    prix: 200,
    utilisateur: 'Mamadou Coulibaly',
    validated: true,
    validatedAt: '2025-04-16 11:31',
    numeroPaiement: '+225 05 55 55 55 55',
    transactionId: 'TRX-20250416-005'
  },
  {
    id: generateTicketId(),
    type: 'Monbus',
    ligne: '006',
    destination: 'Marcory - Treichville',
    date: '2025-04-16',
    heure: '13:45',
    validite: 60,
    prix: 150,
    utilisateur: 'Aminata Touré',
    validated: false,
    numeroPaiement: '+225 01 11 11 11 11',
    transactionId: 'TRX-20250416-006'
  },
  {
    id: generateTicketId(),
    type: 'Express',
    ligne: '007',
    destination: 'Gare Sud - Plateau',
    date: '2025-04-16',
    heure: '15:00',
    validite: 150,
    prix: 2500,
    utilisateur: 'Yao Kouassi',
    validated: false,
    numeroPaiement: '+225 07 07 77 77 77',
    transactionId: 'TRX-20250416-007'
  },
  {
    id: generateTicketId(),
    type: 'MarchéBus',
    ligne: '008',
    destination: 'Abobo - Plateau',
    date: '2025-04-16',
    heure: '16:45',
    validite: 90,
    prix: 300,
    utilisateur: 'Mariam Traoré',
    validated: true,
    validatedAt: '2025-04-16 16:44',
    numeroPaiement: '+225 05 05 55 55 55',
    transactionId: 'TRX-20250416-008'
  },
  {
    id: generateTicketId(),
    type: 'Navette',
    ligne: '009',
    destination: 'Hôpital Général - Cocody',
    date: '2025-04-16',
    heure: '18:30',
    validite: 120,
    prix: 450,
    utilisateur: 'Bakary Koné',
    validated: false,
    numeroPaiement: '+225 01 01 11 11 11',
    transactionId: 'TRX-20250416-009'
  },
  {
    id: generateTicketId(),
    type: 'BateauBus',
    ligne: '010',
    destination: 'Bassam - Plateau',
    date: '2025-04-16',
    heure: '19:15',
    validite: 45,
    prix: 200,
    utilisateur: 'Awa Diomandé',
    validated: true,
    validatedAt: '2025-04-16 19:20',
    numeroPaiement: '+225 07 07 07 77 77',
    transactionId: 'TRX-20250416-010'
  }
];

// Compteur de tickets par jour
const ticketCounters: { [key: string]: number } = {};

// Fonction pour obtenir le compteur du jour
const getDailyCounter = (): number => {
  const today = new Date().toISOString().slice(0, 10);
  if (!ticketCounters[today]) {
    ticketCounters[today] = 0;
  }
  return ++ticketCounters[today];
};

app.use(cors());
app.use(express.json());

// Route de base
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Helper pour calculer le temps restant en minutes
const getRemainingValidity = (ticket: TransportTicket): number => {
  const ticketDate = new Date(`${ticket.date} ${ticket.heure}`);
  const now = new Date();
  const validityInMs = ticket.validite * 60 * 1000;
  const expirationDate = new Date(ticketDate.getTime() + validityInMs);
  
  if (now > expirationDate) {
    return -1; // Ticket expiré
  }
  
  if (!ticket.validated) {
    return ticket.validite; // Ticket non validé
  }
  
  // Pour les tickets validés, calculer le temps restant depuis la validation
  const validatedAt = ticket.validatedAt ? new Date(ticket.validatedAt) : now;
  const remainingMs = expirationDate.getTime() - validatedAt.getTime();
  return Math.max(0, Math.floor(remainingMs / (60 * 1000)));
};

// Route pour obtenir tous les tickets
app.get('/api/tickets', (req: Request, res: Response) => {
  const sortedTickets = [...tickets].sort((a, b) => {
    // Les tickets expirés vont à la fin
    const isAExpired = getRemainingValidity(a) === -1;
    const isBExpired = getRemainingValidity(b) === -1;
    
    if (isAExpired && isBExpired) {
      // Si les deux sont expirés, trier par date d'expiration
      return new Date(`${b.date} ${b.heure}`).getTime() - new Date(`${a.date} ${a.heure}`).getTime();
    }
    if (isAExpired) return 1;
    if (isBExpired) return -1;
    
    // Les tickets non validés vont en premier
    if (!a.validated && b.validated) return -1;
    if (a.validated && !b.validated) return 1;
    
    // Pour les tickets de même statut (validés ou non validés), trier par temps restant
    const validityA = getRemainingValidity(a);
    const validityB = getRemainingValidity(b);
    return validityA - validityB;
  });

  res.json(sortedTickets);
});

// Route pour obtenir un ticket spécifique
app.get('/api/tickets/:id', (req: Request<{ id: string }>, res: Response) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket non trouvé' });
  }
  res.json(ticket);
});

// Route pour valider un ticket
app.post('/api/tickets/:id/validate', (req: Request<{ id: string }>, res: Response) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket non trouvé' });
  }
  
  if (ticket.validated) {
    return res.status(400).json({ error: 'Ticket déjà validé' });
  }
  
  const now = new Date();
  ticket.validated = true;
  ticket.validatedAt = now.toISOString().replace('T', ' ').substring(0, 19);
  
  res.json(ticket);
});

// Route pour créer un nouveau ticket
app.post('/api/tickets', (req: Request, res: Response) => {
  const newTicket: TransportTicket = {
    id: generateTicketId(),
    ...req.body,
    validated: false,
    numeroPaiement: 'PAY-20250416-001',
    transactionId: 'TRX-20250416-001'
  };
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
}); 