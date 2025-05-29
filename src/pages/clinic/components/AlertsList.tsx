
import { Clock, Activity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAlerts } from "./mockData";

interface AlertsListProps {
  onViewPatient: (patientId: string) => void;
}

const AlertsList = ({ onViewPatient }: AlertsListProps) => {
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

  return (
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
                  onClick={() => onViewPatient(alert.patientId)}
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
  );
};

export default AlertsList;
