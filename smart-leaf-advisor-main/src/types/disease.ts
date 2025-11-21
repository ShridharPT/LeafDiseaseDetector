export interface Treatment {
  id: string;
  type: 'organic' | 'chemical';
  name: string;
  nameKn: string;
  dosage: string;
  dosageKn: string;
  application: string;
  applicationKn: string;
  preventionTips: string[];
  preventionTipsKn: string[];
  successRate: number;
}

export interface Disease {
  id: string;
  name: string;
  nameKn: string;
  scientificName: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  descriptionKn: string;
  symptoms: string[];
  symptomsKn: string[];
  treatments: Treatment[];
  imageUrl?: string;
}

export interface Feedback {
  diseaseId: string;
  treatmentId: string;
  isUseful: boolean;
  timestamp: number;
  location?: string;
}

export type Language = 'en' | 'kn';
