import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Phone, Mail, AlertCircle, PencilLine, BellRing, Check, X, Users } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Import Recharts components for charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// Mock patient data
const mockPatient = {
  id: "p1",
  name: "João Silva",
  age: 68,
  birthdate: "15/03/1955",
  email: "joao.silva@exemplo.com",
  phone: "(11) 98765-4321",
  condition: "Hipertensão, Diabetes",
  adherence: 92,
  since: "10/01/2023",
  notes: "Paciente com bom controle da hipertensão, mas com dificuldade para manter os níveis de glicose estáveis."
};

// Mock medication data
const mockMedications = [
  { 
    id: 1, 
    name: "Losartana", 
    dosage: "50mg", 
    frequency: "12/12h",
    times: ["08:00", "20:00"],
    adherence: 95
  },
  { 
    id: 2, 
    name: "Metformina", 
    dosage: "850mg", 
    frequency: "1x ao dia",
    times: ["08:00"],
    adherence: 89
  },
  { 
    id: 3, 
    name: "AAS", 
    dosage: "100mg", 
    frequency: "1x ao dia",
    times: ["08:00"],
    adherence: 100
  },
];

// Mock blood pressure data
const mockBloodPressureData = [
  { date: '17/05', systolic: 135, diastolic: 88 },
  { date: '18/05', systolic: 130, diastolic: 85 },
  { date: '19/05', systolic: 128, diastolic: 82 },
  { date: '20/05', systolic: 125, diastolic: 80 },
  { date: '21/05', systolic: 132, diastolic: 84 },
  { date: '22/05', systolic: 129, diastolic: 83 },
  { date: '23/05', systolic: 124, diastolic: 79 },
];

// Mock glucose data
const mockGlucoseData = [
  { date: '17/05', glucose: 130 },
  { date: '18/05', glucose: 125 },
  { date: '19/05', glucose: 135 },
  { date: '20/05', glucose: 122 },
  { date: '21/05', glucose: 118 },
  { date: '22/05', glucose: 126 },
  { date: '23/05', glucose: 120 },
];

// Mock history data for medications
const mockMedicationHistory = [
  {
    date: "23/05/2023",
    entries: [
      { time: "08:00", medication: "Losartana 50mg", taken: true },
      { time: "08:00", medication: "Metformina 850mg", taken: true },
      { time: "08:00", medication: "AAS 100mg", taken: true },
      { time: "20:00", medication: "Losartana 50mg", taken: true },
    ]
  },
  {
    date: "22/05/2023",
    entries: [
      { time: "08:00", medication: "Losartana 50mg", taken: true },
      { time: "08:00", medication: "Metformina 850mg", taken: true },
      { time: "08:00", medication: "AAS 100mg", taken: false, skipped: true },
      { time: "20:00", medication: "Losartana 50mg", taken: true },
    ]
  },
  {
    date: "21/05/2023",
    entries: [
      { time: "08:00", medication: "Losartana 50mg", taken: true },
      { time: "08:00", medication: "Metformina 850mg", taken: false },
      { time: "08:00", medication: "AAS 100mg", taken: true },
      { time: "20:00", medication: "Losartana 50mg", taken: true },
    ]
  },
];

const PatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [patientNotes, setPatientNotes] = useState(mockPatient.notes);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // Go back to dashboard
  const goBack = () => {
    navigate('/clinic/dashboard');
  };
  
  // Save notes
  const saveNotes = () => {
    // In a real app, you would update the patient notes in the database
    mockPatient.notes = patientNotes;
    setIsNotesDialogOpen(false);
    toast.success("Notas salvas com sucesso!");
  };
  
  // Send alert
  const sendAlert = () => {
    if (!alertMessage.trim()) {
      toast.error("Por favor, digite uma mensagem");
      return;
    }
    
    // In a real app, you would send an alert to the patient
    setIsAlertDialogOpen(false);
    setAlertMessage("");
    toast.success("Alerta enviado com sucesso!");
  };
  
  // Get adherence color based on percentage
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <ClinicLayout title="Detalhes do Paciente">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o painel
        </Button>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Patient Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Informações do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{mockPatient.name}</h3>
                  <p className="text-gray-500">{mockPatient.condition}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="font-medium">{mockPatient.birthdate} ({mockPatient.age} anos)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{mockPatient.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{mockPatient.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Compartilhando desde</p>
                    <p className="font-medium">{mockPatient.since}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-700 font-medium">Notas</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-blue-600"
                    onClick={() => setIsNotesDialogOpen(true)}
                  >
                    <PencilLine className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{mockPatient.notes}</p>
              </div>
              
              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAlertDialogOpen(true)}
              >
                <BellRing className="mr-2 h-4 w-4" />
                Enviar Alerta ao Paciente
              </Button>
            </CardContent>
          </Card>
          
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Overall adherence card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Adesão ao Tratamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="relative h-20 w-20">
                      <svg
                        className="h-20 w-20 -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          className="text-gray-200"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="12"
                          stroke="currentColor"
                          fill="none"
                        />
                        <circle
                          className={mockPatient.adherence >= 90 ? "text-green-500" : 
                                     mockPatient.adherence >= 70 ? "text-yellow-500" : "text-red-500"}
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="12"
                          stroke="currentColor"
                          fill="none"
                          strokeDasharray={`${mockPatient.adherence * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="text-xl font-bold">{mockPatient.adherence}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Adesão Geral</h3>
                      <p className="text-sm text-gray-600">
                        Últimos 7 dias
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {mockMedications.map((med) => (
                      <div key={med.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{med.name} {med.dosage}</p>
                          <p className="text-xs text-gray-500">{med.frequency}</p>
                        </div>
                        <div className={`font-semibold ${getAdherenceColor(med.adherence)}`}>
                          {med.adherence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Vitals and history tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="vitals" className="w-full">
                  <div className="border-b px-4">
                    <TabsList className="h-12">
                      <TabsTrigger value="vitals" className="data-[state=active]:text-blue-600">
                        Sinais Vitais
                      </TabsTrigger>
                      <TabsTrigger value="history" className="data-[state=active]:text-blue-600">
                        Histórico de Medicações
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* Vitals tab content */}
                  <TabsContent value="vitals" className="p-4 space-y-8">
                    {/* Blood pressure chart */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Pressão Arterial</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={mockBloodPressureData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[40, 160]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="systolic" 
                              stroke="#ef4444" 
                              name="Sistólica" 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="diastolic" 
                              stroke="#3b82f6" 
                              name="Diastólica" 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Glucose chart */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Glicemia</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={mockGlucoseData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[80, 180]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="glucose" 
                              stroke="#10b981" 
                              name="Glicemia (mg/dL)" 
                              strokeWidth={2}
                            />
                            <ReferenceLine y={126} stroke="red" strokeDasharray="3 3" />
                            <ReferenceLine y={100} stroke="#166534" strokeDasharray="3 3" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* History tab content */}
                  <TabsContent value="history" className="space-y-4 p-4">
                    {mockMedicationHistory.map((day) => (
                      <div key={day.date} className="mb-6 last:mb-0">
                        <h4 className="text-sm font-semibold mb-2 text-gray-500">{day.date}</h4>
                        <div className="space-y-1">
                          {day.entries.map((entry, i) => (
                            <div 
                              key={i}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-500">
                                  {entry.time}
                                </div>
                                <div className="font-medium">
                                  {entry.medication}
                                </div>
                              </div>
                              <div>
                                {entry.taken ? (
                                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                    <Check className="mr-1 h-3 w-3" />
                                    Tomado
                                  </span>
                                ) : entry.skipped ? (
                                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    Ignorado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                                    <X className="mr-1 h-3 w-3" />
                                    Não tomado
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Notes Dialog */}
        <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Notas do Paciente</DialogTitle>
              <DialogDescription>
                Adicione notas e observações sobre o paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                className="min-h-32 text-base"
                placeholder="Adicione notas sobre o paciente"
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>Cancelar</Button>
              <Button onClick={saveNotes}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Alert Dialog */}
        <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar Alerta ao Paciente</DialogTitle>
              <DialogDescription>
                Envie um alerta ou recomendação para o paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                className="min-h-32 text-base"
                placeholder="Digite sua mensagem para o paciente..."
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>Cancelar</Button>
              <Button onClick={sendAlert} className="bg-blue-600 hover:bg-blue-700">
                <BellRing className="mr-2 h-4 w-4" />
                Enviar Alerta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClinicLayout>
  );
};

export default PatientView;
