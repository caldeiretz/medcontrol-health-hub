
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "@/components/layouts/PatientLayout";
import { useNotifications } from "@/hooks/useNotifications";
import { useTodayMedicationLogs } from "@/hooks/useMedications";
import DashboardHeader from "./components/DashboardHeader";
import MedicationCard from "./components/MedicationCard";
import VitalsCard from "./components/VitalsCard";
import ProgressCard from "./components/ProgressCard";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { scheduleNotification, cancelNotification } = useNotifications();
  const { logs, markTaken, markSkipped, isLoading } = useTodayMedicationLogs();
  
  const pendingLogs = logs.filter(log => log.status === 'pending');
  const completedLogs = logs.filter(log => log.status === 'taken' || log.status === 'skipped');
  
  const handleMedicationTaken = (logId: string) => {
    markTaken(logId);
    cancelNotification(parseInt(logId.slice(-8), 16)); // Use part of UUID as notification ID
  };
  
  const handleSkipMedication = (logId: string) => {
    markSkipped(logId);
    cancelNotification(parseInt(logId.slice(-8), 16)); // Use part of UUID as notification ID
  };
  
  useEffect(() => {
    const scheduleNotifications = () => {
      pendingLogs.forEach(log => {
        if (!log.medication) return;
        
        const scheduledTime = new Date(log.scheduled_time);
        const notificationTime = new Date(scheduledTime.getTime() - 10 * 60000);
        
        if (notificationTime > new Date()) {
          const notificationId = parseInt(log.id.slice(-8), 16);
          scheduleNotification(
            "Hora da medicação!",
            `É hora de tomar ${log.medication.name} (${log.medication.dosage})`,
            notificationTime,
            notificationId
          );
        }
      });
    };

    scheduleNotifications();
  }, [logs, scheduleNotification]);
  
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

  if (isLoading) {
    return (
      <PatientLayout title="Meu Dia">
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </PatientLayout>
    );
  }
  
  return (
    <PatientLayout title="Meu Dia">
      <div className="mb-8">
        <DashboardHeader currentDate={currentDate} />
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <MedicationCard
            logs={pendingLogs}
            onMedicationTaken={handleMedicationTaken}
            onSkipMedication={handleSkipMedication}
            onViewAllMedications={handleViewAllMedications}
          />
          
          <VitalsCard onRegisterVitals={handleRegisterVitals} />
          
          <ProgressCard />
        </div>
      </div>
    </PatientLayout>
  );
};

export default Dashboard;
