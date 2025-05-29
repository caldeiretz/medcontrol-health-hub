
import { useState } from "react";
import { Clock, Bell, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  nextTime: Date;
  isTaken: boolean;
  skipped?: boolean;
}

interface MedicationCardProps {
  medications: Medication[];
  onMedicationTaken: (id: number) => void;
  onSkipMedication: (id: number) => void;
  onViewAllMedications: () => void;
}

const MedicationCard = ({ 
  medications, 
  onMedicationTaken, 
  onSkipMedication, 
  onViewAllMedications 
}: MedicationCardProps) => {
  const upcomingMedications = medications.filter(med => !med.isTaken);
  
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

  return (
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
                      onClick={() => onMedicationTaken(med.id)}
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 w-10 rounded-full border-2 hover:bg-gray-50 shadow-md transform hover:scale-105 transition-all duration-200"
                      onClick={() => onSkipMedication(med.id)}
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
              onClick={onViewAllMedications}
            >
              Ver todas as medicações →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
