export interface TransportTicket {
  id: string;
  type: 'Monbus' |'MarchéBus' | 'Express' | 'Navette' | 'BateauBus';
  ligne: string;
  destination: string;
  date: string;
  heure: string;
  validite: number; // en minutes
  prix: number;
  utilisateur: string;
  validated: boolean;
  validatedAt?: string; // Date et heure de validation
  numeroPaiement: string; // Format: +225 XX XX XX XX (numéro de téléphone ivoirien)
  transactionId: string;
} 