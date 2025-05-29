
import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockPatients, Patient } from "./mockData";

interface PatientListProps {
  onViewPatient: (patientId: string) => void;
}

const PatientList = ({ onViewPatient }: PatientListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  
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

  return (
    <div className="lg:col-span-2 min-w-0">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base md:text-lg">Seus Pacientes</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar paciente..."
                className="pl-8 text-sm"
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
                  className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer min-w-0"
                  onClick={() => onViewPatient(patient.id)}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <span className="font-medium text-gray-600 text-xs md:text-sm">{patient.avatar}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">{patient.name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs md:text-sm text-gray-500">{patient.age} anos</span>
                        <span className="hidden sm:inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
                        <span className="text-xs md:text-sm text-gray-500 truncate">{patient.condition}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1 hidden sm:block">Adesão</p>
                      <div className="flex items-center gap-1">
                        <span className={`h-2 w-2 rounded-full ${getAdherenceColor(patient.adherence)}`}></span>
                        <span className="font-medium text-xs md:text-sm">{patient.adherence}%</span>
                      </div>
                    </div>
                    {patient.alerts > 0 && (
                      <div className="flex items-center justify-center rounded-full bg-red-100 h-5 w-5 md:h-6 md:w-6 text-xs font-medium text-red-600">
                        {patient.alerts}
                      </div>
                    )}
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              Nenhum paciente encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;
