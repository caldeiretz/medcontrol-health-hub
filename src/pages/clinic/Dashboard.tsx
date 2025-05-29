
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import StatsCards from "./components/StatsCards";
import PatientList from "./components/PatientList";
import AlertsList from "./components/AlertsList";

const ClinicDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Handle view patient
  const handleViewPatient = (patientId: string) => {
    navigate(`/clinic/patient/${patientId}`);
  };

  return (
    <ClinicLayout title="Painel de Monitoramento">
      <div className="mb-8">
        <StatsCards />
        
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <PatientList onViewPatient={handleViewPatient} />
          <AlertsList onViewPatient={handleViewPatient} />
        </div>
      </div>
    </ClinicLayout>
  );
};

export default ClinicDashboard;
