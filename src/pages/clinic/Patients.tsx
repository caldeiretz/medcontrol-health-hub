
import { useState } from "react";
import { Search, Eye, Calendar, Pills, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSharedPatients } from "@/hooks/useClinic";

const Patients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { patients, isLoading } = useSharedPatients();

  const handleViewPatient = (patientId: string) => {
    navigate(`/clinic/patients/${patientId}`);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityStatus = (lastActivity: string) => {
    const now = new Date();
    const activityTime = new Date(lastActivity);
    const diffInHours = (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) return { status: 'Ativo', color: 'bg-green-100 text-green-800' };
    if (diffInHours < 72) return { status: 'Moderado', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Inativo', color: 'bg-red-100 text-red-800' };
  };

  return (
    <ClinicLayout title="Pacientes">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Pacientes</h1>
            <p className="text-gray-600 mt-1">
              Pacientes que compartilham dados com você
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando pacientes...</p>
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => {
              const activity = getActivityStatus(patient.last_activity);
              
              return (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-600">{patient.email}</p>
                            {patient.age && (
                              <p className="text-sm text-gray-500">{patient.age} anos</p>
                            )}
                          </div>
                          <Badge className={activity.color}>
                            {activity.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Pills className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-600">
                              {patient.medications_count} medicações
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">
                              {patient.vitals_count} sinais vitais
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-600">
                              Desde {new Date(patient.shared_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        {patient.condition && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {patient.condition}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-gray-500">
                          <p>Última atividade:</p>
                          <p className="font-medium">
                            {new Date(patient.last_activity).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <Button
                          onClick={() => handleViewPatient(patient.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente compartilhando dados'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca para encontrar o paciente desejado.'
                  : 'Quando os pacientes compartilharem seus dados com você, eles aparecerão aqui.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ClinicLayout>
  );
};

export default Patients;
