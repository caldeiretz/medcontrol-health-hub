
// Mock patient data
export const mockPatients = [
  {
    id: "p1",
    name: "João Silva",
    age: 68,
    condition: "Hipertensão, Diabetes",
    adherence: 92,
    lastUpdate: "Hoje, 08:45",
    alerts: 0,
    avatar: "JS",
  },
  {
    id: "p2",
    name: "Maria Oliveira",
    age: 72,
    condition: "Artrite, Osteoporose",
    adherence: 78,
    lastUpdate: "Ontem, 20:30",
    alerts: 1,
    avatar: "MO",
  },
  {
    id: "p3",
    name: "Antônio Santos",
    age: 65,
    condition: "Insuficiência Cardíaca",
    adherence: 85,
    lastUpdate: "Hoje, 10:15",
    alerts: 0,
    avatar: "AS",
  },
  {
    id: "p4",
    name: "Clara Mendes",
    age: 59,
    condition: "Hipotireoidismo",
    adherence: 97,
    lastUpdate: "Hoje, 09:20",
    alerts: 0,
    avatar: "CM",
  },
  {
    id: "p5",
    name: "Roberto Alves",
    age: 75,
    condition: "Fibrilação Atrial, Hipertensão",
    adherence: 65,
    lastUpdate: "3 dias atrás",
    alerts: 2,
    avatar: "RA",
  },
];

// Mock recent alerts
export const mockAlerts = [
  {
    id: "a1",
    patientId: "p2",
    patientName: "Maria Oliveira",
    type: "missed-medication",
    description: "Não tomou Losartana por 2 dias",
    time: "Ontem, 20:30",
  },
  {
    id: "a2",
    patientId: "p5",
    patientName: "Roberto Alves",
    type: "high-blood-pressure",
    description: "Pressão arterial: 160/95 mmHg",
    time: "3 dias atrás",
  },
  {
    id: "a3",
    patientId: "p5",
    patientName: "Roberto Alves",
    type: "missed-medication",
    description: "Não tomou Warfarina ontem",
    time: "2 dias atrás",
  },
];

export type Patient = typeof mockPatients[0];
export type Alert = typeof mockAlerts[0];
