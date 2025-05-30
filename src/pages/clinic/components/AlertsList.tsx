
import { Clock, Activity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClinicAlerts } from "@/hooks/useClinic";

interface AlertsListProps {
  onViewPatient: (patientId: string) => void;
}

const AlertsList = ({ onViewPatient }: AlertsListProps) => {
  const { alerts, isLoading } = useClinicAlerts();

  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "missed_medication":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "high_bp":
        return <Activity className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getAlertTime = (createdAt: string) => {
    const now = new Date();
    const alertTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return alertTime.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="min-w-0">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              Carregando alertas...
            </div>
          ) : alerts.length > 0 ? (
            <div className="divide-y">
              {alerts.slice(0, 5).map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewPatient(alert.patient_id)}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">{alert.patient_name}</p>
                      <p className="text-xs md:text-sm text-gray-700 mb-1">{alert.description}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{getAlertTime(alert.created_at)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity === 'high' ? 'Alto' :
                           alert.severity === 'medium' ? 'Médio' : 'Baixo'}
                        </span>
                      </div>
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
  );
};

export default AlertsList;
