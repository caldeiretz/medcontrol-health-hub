import { useState } from "react";
import { CalendarIcon, Clock, Check, XCircle, HeartPulse, Activity, Download } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { exportHistoryToPDF } from "@/utils/exportHistoryToPDF";

// Mock medication history data
const mockMedicationHistory = [
  {
    date: "23/05/2023",
    medications: [
      { id: 1, name: "Losartana", dosage: "50mg", time: "08:00", taken: true },
      { id: 2, name: "Losartana", dosage: "50mg", time: "20:00", taken: true },
      { id: 3, name: "AAS", dosage: "100mg", time: "22:00", taken: true },
    ]
  },
  {
    date: "22/05/2023",
    medications: [
      { id: 4, name: "Losartana", dosage: "50mg", time: "08:00", taken: true },
      { id: 5, name: "Losartana", dosage: "50mg", time: "20:00", taken: true },
      { id: 6, name: "AAS", dosage: "100mg", time: "22:00", taken: false, skipped: true },
    ]
  },
  {
    date: "21/05/2023",
    medications: [
      { id: 7, name: "Losartana", dosage: "50mg", time: "08:00", taken: true },
      { id: 8, name: "Losartana", dosage: "50mg", time: "20:00", taken: false },
      { id: 9, name: "AAS", dosage: "100mg", time: "22:00", taken: true },
    ]
  },
  {
    date: "20/05/2023",
    medications: [
      { id: 10, name: "Losartana", dosage: "50mg", time: "08:00", taken: true },
      { id: 11, name: "Losartana", dosage: "50mg", time: "20:00", taken: true },
      { id: 12, name: "AAS", dosage: "100mg", time: "22:00", taken: true },
    ]
  },
];

// Mock vitals history data
const mockVitalsHistory = [
  {
    date: "23/05/2023",
    vitals: [
      { id: 1, type: "blood-pressure", value: "120/80", time: "09:15", status: "normal" },
      { id: 2, type: "glucose", value: "95", time: "09:20", status: "normal" },
    ]
  },
  {
    date: "21/05/2023",
    vitals: [
      { id: 3, type: "blood-pressure", value: "130/85", time: "08:30", status: "normal" },
      { id: 4, type: "heart-rate", value: "72", time: "08:35", status: "normal" },
    ]
  },
  {
    date: "19/05/2023",
    vitals: [
      { id: 5, type: "blood-pressure", value: "145/90", time: "10:00", status: "elevated" },
      { id: 6, type: "glucose", value: "130", time: "10:05", status: "elevated" },
    ]
  },
];

const History = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [isExporting, setIsExporting] = useState(false);
  
  // Calculate adherence percentage
  const calculateAdherence = () => {
    const allMeds = mockMedicationHistory.flatMap(day => day.medications);
    const totalMeds = allMeds.length;
    const takenMeds = allMeds.filter(med => med.taken).length;
    
    return Math.round((takenMeds / totalMeds) * 100);
  };
  
  const adherencePercentage = calculateAdherence();
  
  // Get adherence color based on percentage
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const adherenceColor = getAdherenceColor(adherencePercentage);
  
  // Get vital icon based on type
  const getVitalIcon = (type: string) => {
    switch (type) {
      case "blood-pressure":
        return <HeartPulse className="h-4 w-4 text-red-500" />;
      case "glucose":
        return <Activity className="h-4 w-4 text-green-500" />;
      case "heart-rate":
        return <HeartPulse className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  // Get vital text based on type
  const getVitalText = (type: string, value: string) => {
    switch (type) {
      case "blood-pressure":
        return `Pressão Arterial: ${value} mmHg`;
      case "glucose":
        return `Glicemia: ${value} mg/dL`;
      case "heart-rate":
        return `Batimentos: ${value} BPM`;
      default:
        return value;
    }
  };
  
  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            Normal
          </span>
        );
      case "elevated":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            Elevado
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
            Baixo
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <PatientLayout title="Histórico">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Acompanhe seu histórico de medicações e sinais vitais
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Período:</span>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="3months">Últimos 3 Meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Adherence Summary Card */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo de Adesão</CardTitle>
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
                      className={adherenceColor}
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="none"
                      strokeDasharray={`${adherencePercentage * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold">{adherencePercentage}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Adesão à medicação</h3>
                  <p className="text-sm text-gray-600">
                    {timeframe === "week" && "Nos últimos 7 dias"}
                    {timeframe === "month" && "No último mês"}
                    {timeframe === "3months" && "Nos últimos 3 meses"}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Acima de 90% - Excelente</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Entre 70% e 90% - Boa</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Abaixo de 70% - Precisa melhorar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for medication and vitals history */}
        <Tabs defaultValue="medications">
          <TabsList className="mb-6">
            <TabsTrigger value="medications" className="px-5 py-2">
              Medicações
            </TabsTrigger>
            <TabsTrigger value="vitals" className="px-5 py-2">
              Sinais Vitais
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="medications" className="space-y-6">
            {mockMedicationHistory.map((day) => (
              <Card key={day.date}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {day.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {day.medications.map((med) => (
                      <li key={med.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{med.name} {med.dosage}</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{med.time}</span>
                            </div>
                          </div>
                          <div>
                            {med.taken ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <Check className="h-5 w-5" />
                                <span className="text-sm font-medium">Tomado</span>
                              </div>
                            ) : med.skipped ? (
                              <div className="flex items-center gap-1 text-yellow-600">
                                <XCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Ignorado</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600">
                                <XCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Não tomado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="vitals" className="space-y-6">
            {mockVitalsHistory.map((day) => (
              <Card key={day.date}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {day.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {day.vitals.map((vital) => (
                      <li key={vital.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              {getVitalIcon(vital.type)}
                              <p className="font-medium">
                                {getVitalText(vital.type, vital.value)}
                              </p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{vital.time}</span>
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(vital.status)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
        
        {/* Export button */}
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar Histórico"}
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default History;
