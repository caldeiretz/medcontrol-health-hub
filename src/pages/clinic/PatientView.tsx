import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Phone, Mail, MapPin, User, Pill, Activity } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatientDetails } from "@/hooks/useClinic";
import VitalChart from "@/components/charts/VitalChart";

const PatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patient, medications, vitals, isLoading, error } = usePatientDetails(patientId!);

  if (isLoading) {
    return (
      <ClinicLayout title="Carregando...">
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando dados do paciente...</p>
        </div>
      </ClinicLayout>
    );
  }

  if (error || !patient) {
    return (
      <ClinicLayout title="Erro">
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar dados do paciente ou acesso negado.</p>
          <Button 
            onClick={() => navigate('/clinic/patients')} 
            className="mt-4"
          >
            Voltar para Pacientes
          </Button>
        </div>
      </ClinicLayout>
    );
  }

  const activeMedications = medications.filter(med => med.is_active);
  const recentVitals = vitals.slice(0, 10);

  return (
    <ClinicLayout title={patient.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/clinic/patients')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pacientes
          </Button>
        </div>

        {/* Patient Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                    <p className="text-gray-600">{patient.email}</p>
                    {patient.age && (
                      <p className="text-sm text-gray-500">{patient.age} anos</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{patient.email}</span>
                  </div>
                  
                  {patient.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{patient.address}</span>
                    </div>
                  )}
                  
                  {patient.birth_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Nascimento: {new Date(patient.birth_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                {patient.condition && (
                  <div className="mt-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {patient.condition}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-48">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Pill className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{activeMedications.length}</p>
                  <p className="text-xs text-blue-600">Medicações Ativas</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{vitals.length}</p>
                  <p className="text-xs text-green-600">Sinais Vitais</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Data Tabs */}
        <Tabs defaultValue="medications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medications">Medicações</TabsTrigger>
            <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-4">
            {activeMedications.length > 0 ? (
              <div className="grid gap-4">
                {activeMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{medication.name}</h3>
                          <p className="text-gray-600 mt-1">{medication.dosage}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Frequência: {medication.frequency}
                          </p>
                          {medication.instructions && (
                            <p className="text-sm text-gray-600 mt-1">
                              {medication.instructions}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Ativa
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>Início: {new Date(medication.start_date).toLocaleDateString('pt-BR')}</span>
                        {medication.end_date && (
                          <span>Fim: {new Date(medication.end_date).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma medicação ativa encontrada</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            {recentVitals.length > 0 ? (
              <div className="grid gap-4">
                {recentVitals.map((vital) => (
                  <Card key={vital.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold capitalize">
                            {vital.type === 'blood_pressure' ? 'Pressão Arterial' :
                             vital.type === 'weight' ? 'Peso' :
                             vital.type === 'heart_rate' ? 'Frequência Cardíaca' :
                             vital.type === 'glucose' ? 'Glicose' :
                             vital.type}
                          </h3>
                          <p className="text-lg font-medium mt-1">
                            {vital.type === 'blood_pressure' 
                              ? `${vital.systolic}/${vital.diastolic} mmHg`
                              : `${vital.value} ${vital.unit || ''}`
                            }
                          </p>
                          {vital.notes && (
                            <p className="text-sm text-gray-600 mt-2">{vital.notes}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(vital.recorded_at).toLocaleDateString('pt-BR')}</p>
                          <p>{new Date(vital.recorded_at).toLocaleTimeString('pt-BR')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum sinal vital encontrado</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            {vitals.length > 0 ? (
              <div className="grid gap-6">
                <VitalChart vitals={vitals} />
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Dados insuficientes para gerar gráficos</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ClinicLayout>
  );
};

export default PatientView;
