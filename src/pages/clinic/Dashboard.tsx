
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Activity, Search, AlertCircle, Clock, ChevronRight } from "lucide-react";
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Pacientes</CardTitle>
              <CardDescription>Pacientes compartilhando dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-semibold">{mockPatients.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Adesão Média</CardTitle>
              <CardDescription>Medicamentos tomados corretamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-semibold">83%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Alertas</CardTitle>
              <CardDescription>Necessitam de atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-3xl font-semibold">{mockAlerts.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Seus Pacientes</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar paciente..."
                      className="pl-8"
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
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                            <span className="font-medium text-gray-600">{patient.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{patient.age} anos</span>
                              <span className="inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
                              <span className="text-sm text-gray-500">{patient.condition}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Adesão</p>
                            <div className="flex items-center gap-1">
                              <span className={`h-2 w-2 rounded-full ${getAdherenceColor(patient.adherence)}`}></span>
                              <span className="font-medium">{patient.adherence}%</span>
                            </div>
                          </div>
                          {patient.alerts > 0 && (
                            <div className="flex items-center justify-center rounded-full bg-red-100 h-6 w-6 text-xs font-medium text-red-600">
                              {patient.alerts}
                            </div>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Nenhum paciente encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Alertas Recentes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {mockAlerts.length > 0 ? (
                  <div className="divide-y">
                    {mockAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewPatient(alert.patientId)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <p className="font-medium">{alert.patientName}</p>
                            <p className="text-sm text-gray-700 mb-1">{alert.description}</p>
                            <p className="text-xs text-gray-500">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Nenhum alerta recente
                  </div>
                )}
                
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full">Ver todos os alertas</Button>
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
