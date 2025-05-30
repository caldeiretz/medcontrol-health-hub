
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Check, XCircle, Edit, Trash2 } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useMedications } from "@/hooks/useMedications";
import { useTodayMedicationLogs } from "@/hooks/useMedications";
import { useState } from "react";

const Medications = () => {
  const navigate = useNavigate();
  const { medications, deleteMedication, isLoading } = useMedications();
  const { logs, markTaken, markSkipped } = useTodayMedicationLogs();
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Group logs by medication
  const medicationLogsMap = logs.reduce((acc, log) => {
    if (log.medication_id) {
      if (!acc[log.medication_id]) acc[log.medication_id] = [];
      acc[log.medication_id].push(log);
    }
    return acc;
  }, {} as Record<string, typeof logs>);

  const handleEditMedication = (id: string) => {
    navigate(`/patient/medications/edit/${id}`);
  };

  const handleDeleteMedication = (id: string) => {
    deleteMedication(id);
    setDeleteConfirmation(null);
  };

  if (isLoading) {
    return (
      <PatientLayout title="Minhas Medicações">
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </PatientLayout>
    );
  }

  const pendingMedications = medications.filter(med => {
    const todayLogs = medicationLogsMap[med.id] || [];
    return todayLogs.some(log => log.status === 'pending');
  });

  const completedMedications = medications.filter(med => {
    const todayLogs = medicationLogsMap[med.id] || [];
    return todayLogs.length > 0 && todayLogs.every(log => log.status !== 'pending');
  });

  return (
    <PatientLayout title="Minhas Medicações">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Gerencie suas medicações e registre quando tomá-las
        </p>
        <Button 
          onClick={() => navigate('/patient/medications/add')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nova Medicação
        </Button>
      </div>
      
      {/* Pending Medications */}
      <h2 className="text-xl font-semibold mb-4">Medicações Pendentes</h2>
      {pendingMedications.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {pendingMedications.map((med) => {
            const todayLogs = medicationLogsMap[med.id] || [];
            const pendingLogs = todayLogs.filter(log => log.status === 'pending');
            const nextLog = pendingLogs[0];

            return (
              <Card key={med.id} className="overflow-hidden border-l-4 border-l-blue-500">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lg text-gray-900">{med.name}</p>
                      <p className="text-gray-600">{med.dosage} • {med.frequency}</p>
                      {nextLog && (
                        <div className="flex items-center mt-2 gap-1">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span className="text-gray-500">
                            Próxima dose: {new Date(nextLog.scheduled_time).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                      {med.instructions && (
                        <p className="text-sm text-gray-500 mt-1">{med.instructions}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {nextLog && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 rounded-full h-10 w-10 p-0"
                            onClick={() => markTaken(nextLog.id)}
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full h-10 w-10 p-0"
                            onClick={() => markSkipped(nextLog.id)}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-blue-600"
                        onClick={() => handleEditMedication(med.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog open={deleteConfirmation === med.id} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-red-600"
                            onClick={() => setDeleteConfirmation(med.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                          </DialogHeader>
                          <p className="py-4">
                            Tem certeza que deseja excluir a medicação <span className="font-medium">{med.name}</span>?
                            Esta ação não pode ser desfeita.
                          </p>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancelar</Button>
                            <Button variant="destructive" onClick={() => handleDeleteMedication(med.id)}>Excluir</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center mb-8">
          <p className="text-gray-500">Não há medicações pendentes no momento.</p>
        </div>
      )}
      
      {/* All Medications */}
      <h2 className="text-xl font-semibold mb-4">Todas as Medicações</h2>
      {medications.length > 0 ? (
        <div className="grid gap-4">
          {medications.map((med) => (
            <Card key={med.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-lg text-gray-900">{med.name}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        med.is_active 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {med.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-gray-600">{med.dosage} • {med.frequency}</p>
                    {med.instructions && (
                      <p className="text-sm text-gray-500 mt-1">{med.instructions}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Criado em {new Date(med.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditMedication(med.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog open={deleteConfirmation === med.id} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-red-600"
                          onClick={() => setDeleteConfirmation(med.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar exclusão</DialogTitle>
                        </DialogHeader>
                        <p className="py-4">
                          Tem certeza que deseja excluir a medicação <span className="font-medium">{med.name}</span>?
                          Esta ação não pode ser desfeita.
                        </p>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancelar</Button>
                          <Button variant="destructive" onClick={() => handleDeleteMedication(med.id)}>Excluir</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Você ainda não tem medicações cadastradas.</p>
          <Button 
            onClick={() => navigate('/patient/medications/add')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-1 h-4 w-4" />
            Adicionar Primeira Medicação
          </Button>
        </div>
      )}
    </PatientLayout>
  );
};

export default Medications;
