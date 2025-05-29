
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "@/components/layouts/PatientLayout";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";
import DashboardHeader from "./components/DashboardHeader";
import MedicationCard from "./components/MedicationCard";
import VitalsCard from "./components/VitalsCard";
import ProgressCard from "./components/ProgressCard";

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
  
  const sortedMedications = [...medications].sort((a, b) => a.nextTime.getTime() - b.nextTime.getTime());
  const upcomingMedications = sortedMedications.filter(med => !med.isTaken);
  
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
        <DashboardHeader currentDate={currentDate} />
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <MedicationCard
            medications={medications}
            onMedicationTaken={handleMedicationTaken}
            onSkipMedication={handleSkipMedication}
            onViewAllMedications={handleViewAllMedications}
          />
          
          <VitalsCard onRegisterVitals={handleRegisterVitals} />
          
          <ProgressCard onViewHistory={handleViewHistory} />
        </div>
      </div>
    </PatientLayout>
  );
};

export default Dashboard;
