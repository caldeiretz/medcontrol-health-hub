
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Bell, Check, XCircle, Activity, HeartPulse, TrendingUp } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";

// Mock medication data
const mockMedications = [
  { 
    id: 1, 
    name: "Losartana", 
    dosage: "50mg", 
    frequency: "12/12h",
    nextTime: new Date(new Date().getTime() + 30 * 60000), // 30 minutes from now
    isTaken: false 
  },
  { 
    id: 2, 
    name: "Enalapril", 
    dosage: "10mg", 
    frequency: "1x ao dia",
    nextTime: new Date(new Date().getTime() + 120 * 60000), // 2 hours from now
    isTaken: false
  },
  { 
    id: 3, 
    name: "AAS", 
    dosage: "100mg", 
    frequency: "1x ao dia",
    nextTime: new Date(new Date().setHours(22, 0, 0, 0)), // Today at 10 PM
    isTaken: false
  },
];

const Dashboard = () => {
  const [medications, setMedications] = useState(mockMedications);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { scheduleNotification, cancelNotification } = useNotifications();
  
  // Format date to display
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const sortedMedications = [...medications].sort((a, b) => a.nextTime.getTime() - b.nextTime.getTime());
  const upcomingMedications = sortedMedications.filter(med => !med.isTaken);
  
  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return "Agora";
    
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
  };
  
  const handleMedicationTaken = (id: number) => {
    const medication = medications.find(med => med.id === id);
    
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, isTaken: true } : med
    ));
    
    if (medication) {
      cancelNotification(id);
    }
    
    toast.success("Medicação registrada com sucesso!");
  };
  
  const handleSkipMedication = (id: number) => {
    const medication = medications.find(med => med.id === id);
    
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, isTaken: true, skipped: true } : med
    ));
    
    if (medication) {
      cancelNotification(id);
    }
    
    toast.info("Medicação ignorada");
  };
  
  useEffect(() => {
    const scheduleNotifications = () => {
      upcomingMedications.forEach(med => {
        const notificationTime = new Date(med.nextTime.getTime() - 10 * 60000);
        if (notificationTime > new Date()) {
          scheduleNotification(
            "Hora da medicação!",
            `É hora de tomar ${med.name} (${med.dosage})`,
            notificationTime,
            med.id
          );
        }
      });
    };

    scheduleNotifications();
  }, [medications, scheduleNotification]);
  
  const handleViewAllMedications = () => {
    navigate('/patient/medications');
  };

  const handleRegisterVitals = () => {
    navigate('/patient/vitals');
  };

  const handleViewHistory = () => {
    navigate('/patient/history');
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <PatientLayout title="Meu Dia">
      <div className="mb-8">
        <div className="text-xl text-gray-600 mb-8 font-medium text-center">
          {capitalizedDate}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Próximas medicações */}
          <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 py-6">
              <CardTitle className="text-xl flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bell className="h-6 w-6" />
                </div>
                <span className="font-bold">Próximas medicações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingMedications.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {upcomingMedications.slice(0, 3).map((med) => (
                    <li key={med.id} className="p-6 hover:bg-blue-50/50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">{med.name}</p>
                          <p className="text-gray-600 font-medium">{med.dosage} • {med.frequency}</p>
                          <div className="flex items-center mt-2 gap-2 text-sm">
                            <div className="p-1 bg-amber-100 rounded-full">
                              <Clock className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="text-gray-500 font-medium">
                              Em {formatTimeRemaining(med.nextTime)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3 ml-4">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-10 w-10 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                            onClick={() => handleMedicationTaken(med.id)}
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-10 w-10 rounded-full border-2 hover:bg-gray-50 shadow-md transform hover:scale-105 transition-all duration-200"
                            onClick={() => handleSkipMedication(med.id)}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-medium">Não há medicações pendentes para hoje.</p>
                </div>
              )}
              
              {upcomingMedications.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-100">
                  <Button 
                    variant="link" 
                    className="w-full text-blue-700 font-semibold hover:text-blue-800"
                    onClick={handleViewAllMedications}
                  >
                    Ver todas as medicações →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Sinais vitais recentes */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 py-6">
              <CardTitle className="text-xl flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="font-bold">Sinais vitais recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                  <p className="text-sm text-green-700 font-medium mb-1">Pressão Arterial</p>
                  <p className="text-2xl font-bold text-green-800">120/80 mmHg</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Normal</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                  <p className="text-sm text-blue-700 font-medium mb-1">Glicemia</p>
                  <p className="text-2xl font-bold text-blue-800">98 mg/dL</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600">Excelente</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 font-semibold transition-all duration-200"
                  onClick={handleRegisterVitals}
                >
                  Registrar novo
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Seu progresso */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 py-6">
              <CardTitle className="text-xl flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <span className="font-bold">Seu progresso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3 font-medium">Adesão à medicação (últimos 7 dias)</p>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-lg transition-all duration-300" 
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-sm font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">85%</span>
                  <span className="text-xs text-gray-500">100%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Excelente! Continue assim!</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 font-semibold transition-all duration-200"
                onClick={handleViewHistory}
              >
                Ver histórico completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Dashboard;
