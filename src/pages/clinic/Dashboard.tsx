import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Activity, Search, AlertCircle, Clock, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock patient data
const mockPatients = [
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
const mockAlerts = [
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

const ClinicDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(mockPatients);
    } else {
      const query = searchQuery.toLowerCase();
      const results = mockPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.condition.toLowerCase().includes(query)
      );
      setFilteredPatients(results);
    }
  }, [searchQuery]);
  
  // Get adherence color based on percentage
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-600";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "missed-medication":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "high-blood-pressure":
        return <Activity className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  // Handle view patient
  const handleViewPatient = (patientId: string) => {
    navigate(`/clinic/patient/${patientId}`);
  };

  return (
    <ClinicLayout title="Painel de Monitoramento">
      <div className="mb-8">
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">Total de Pacientes</CardTitle>
              <CardDescription className="text-sm">Pacientes compartilhando dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="rounded-full bg-blue-100 p-2 md:p-3">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-2xl md:text-3xl font-semibold">{mockPatients.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">Adesão Média</CardTitle>
              <CardDescription className="text-sm">Medicamentos tomados corretamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="rounded-full bg-green-100 p-2 md:p-3">
                  <Check className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <span className="text-2xl md:text-3xl font-semibold">83%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">Alertas</CardTitle>
              <CardDescription className="text-sm">Necessitam de atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="rounded-full bg-red-100 p-2 md:p-3">
                  <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <span className="text-2xl md:text-3xl font-semibold">{mockAlerts.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 min-w-0">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base md:text-lg">Seus Pacientes</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar paciente..."
                      className="pl-8 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredPatients.length > 0 ? (
                  <div className="divide-y">
                    {filteredPatients.map((patient) => (
                      <div 
                        key={patient.id} 
                        className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer min-w-0"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                            <span className="font-medium text-gray-600 text-xs md:text-sm">{patient.avatar}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm md:text-base truncate">{patient.name}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-xs md:text-sm text-gray-500">{patient.age} anos</span>
                              <span className="hidden sm:inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
                              <span className="text-xs md:text-sm text-gray-500 truncate">{patient.condition}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-6 shrink-0">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1 hidden sm:block">Adesão</p>
                            <div className="flex items-center gap-1">
                              <span className={`h-2 w-2 rounded-full ${getAdherenceColor(patient.adherence)}`}></span>
                              <span className="font-medium text-xs md:text-sm">{patient.adherence}%</span>
                            </div>
                          </div>
                          {patient.alerts > 0 && (
                            <div className="flex items-center justify-center rounded-full bg-red-100 h-5 w-5 md:h-6 md:w-6 text-xs font-medium text-red-600">
                              {patient.alerts}
                            </div>
                          )}
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    Nenhum paciente encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="min-w-0">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Alertas Recentes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {mockAlerts.length > 0 ? (
                  <div className="divide-y">
                    {mockAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewPatient(alert.patientId)}
                      >
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="mt-0.5 shrink-0">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm md:text-base truncate">{alert.patientName}</p>
                            <p className="text-xs md:text-sm text-gray-700 mb-1">{alert.description}</p>
                            <p className="text-xs text-gray-500">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    Nenhum alerta recente
                  </div>
                )}
                
                <div className="p-3 md:p-4 border-t">
                  <Button variant="outline" className="w-full text-sm">Ver todos os alertas</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
};

// Import the Check icon from lucide-react
import { Check } from "lucide-react";

export default ClinicDashboard;
