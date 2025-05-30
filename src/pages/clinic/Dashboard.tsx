
import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import StatsCards from "./components/StatsCards";
import AlertsList from "./components/AlertsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSharedPatients, useClinicAlerts } from "@/hooks/useClinic";

const Dashboard = () => {
  const navigate = useNavigate();
  const { patients, isLoading: patientsLoading } = useSharedPatients();
  const { alerts, isLoading: alertsLoading } = useClinicAlerts();

  const handleViewPatient = (patientId: string) => {
    navigate(`/clinic/patients/${patientId}`);
  };

  // Calculate stats from real data
  const stats = {
    totalPatients: patients.length,
    activeAlerts: alerts.filter(alert => !alert.is_resolved).length,
    totalMedications: patients.reduce((sum, p) => sum + p.medications_count, 0),
    recentActivity: patients.filter(p => {
      const lastActivity = new Date(p.last_activity);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastActivity > oneDayAgo;
    }).length
  };

  return (
    <ClinicLayout title="Dashboard">
      <div className="space-y-6">
        <StatsCards 
          totalPatients={stats.totalPatients}
          activeAlerts={stats.activeAlerts}
          totalMedications={stats.totalMedications}
          recentActivity={stats.recentActivity}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsList onViewPatient={handleViewPatient} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">Pacientes Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {patientsLoading ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Carregando pacientes...
                </div>
              ) : patients.length > 0 ? (
                <div className="divide-y">
                  {patients.slice(0, 5).map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-3 md:p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm md:text-base truncate">{patient.name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-1">
                            <span>{patient.medications_count} medicações</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{patient.vitals_count} sinais vitais</span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              Última atividade: {new Date(patient.last_activity).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPatient(patient.id)}
                          className="shrink-0 ml-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Nenhum paciente compartilhando dados
                </div>
              )}
              
              <div className="p-3 md:p-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={() => navigate('/clinic/patients')}
                >
                  Ver todos os pacientes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClinicLayout>
  );
};

export default Dashboard;
