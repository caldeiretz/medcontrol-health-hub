import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Bell, Check, XCircle, Activity, HeartPulse } from "lucide-react";
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
  
  // Capitalize first letter of the date
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  // Sort medications by next time
  const sortedMedications = [...medications].sort((a, b) => 
    a.nextTime.getTime() - b.nextTime.getTime()
  );
  
  // Get upcoming medications (not taken)
  const upcomingMedications = sortedMedications.filter(med => !med.isTaken);
  
  // Format time remaining
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
  
  // Handle medication taken
  const handleMedicationTaken = (id: number) => {
    const medication = medications.find(med => med.id === id);
    
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, isTaken: true } : med
    ));
    
    // Cancel any pending notification for this medication
    if (medication) {
      cancelNotification(id);
    }
    
    toast.success("Medicação registrada com sucesso!");
  };
  
  // Handle skip medication
  const handleSkipMedication = (id: number) => {
    const medication = medications.find(med => med.id === id);
    
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, isTaken: true, skipped: true } : med
    ));
    
    // Cancel any pending notification for this medication
    if (medication) {
      cancelNotification(id);
    }
    
    toast.info("Medicação ignorada");
  };
  
  // Schedule notifications for upcoming medications
  useEffect(() => {
    const scheduleNotifications = () => {
      upcomingMedications.forEach(med => {
        const notificationTime = new Date(med.nextTime.getTime() - 10 * 60000); // 10 minutes before
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
  
  // Navigation handlers
  const handleViewAllMedications = () => {
    navigate('/patient/medications');
  };

  const handleRegisterVitals = () => {
    navigate('/patient/vitals');
  };

  const handleViewHistory = () => {
    navigate('/patient/history');
  };
  
  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <PatientLayout title="Meu Dia">
      <div className="mb-8">
        <div className="text-lg text-gray-600 mb-6">
          {capitalizedDate}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-50 py-4">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                <Bell className="h-5 w-5" />
                Próximas medicações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingMedications.length > 0 ? (
                <ul className="divide-y">
                  {upcomingMedications.slice(0, 3).map((med) => (
                    <li key={med.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{med.name}</p>
                          <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                          <div className="flex items-center mt-1 gap-1 text-sm">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-gray-500">
                              Em {formatTimeRemaining(med.nextTime)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 h-9 rounded-full"
                            onClick={() => handleMedicationTaken(med.id)}
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-full"
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
                <div className="p-6 text-center text-gray-500">
                  Não há medicações pendentes para hoje.
                </div>
              )}
              
              {upcomingMedications.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <Button 
                    variant="link" 
                    className="w-full text-blue-600"
                    onClick={handleViewAllMedications}
                  >
                    Ver todas as medicações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* More cards will go here (summary, vitals, etc.) */}
          <Card>
            <CardHeader className="bg-green-50 py-4">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                <Activity className="h-5 w-5" />
                Sinais vitais recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Pressão Arterial</p>
                  <p className="text-xl font-medium">120/80 mmHg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Glicemia</p>
                  <p className="text-xl font-medium">98 mg/dL</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleRegisterVitals}
                >
                  Registrar novo
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-purple-50 py-4">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                <HeartPulse className="h-5 w-5" />
                Seu progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Adesão à medicação (últimos 7 dias)</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-purple-600 h-4 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-xs font-medium text-purple-700">85%</span>
                  <span className="text-xs text-gray-500">100%</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
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
