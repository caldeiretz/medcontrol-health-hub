import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Check, XCircle, Edit, Trash2 } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock medication data (similar to Dashboard)
const initialMedications = [
  { 
    id: 1, 
    name: "Losartana", 
    dosage: "50mg", 
    frequency: "12/12h",
    times: ["08:00", "20:00"],
    nextTime: new Date(new Date().getTime() + 30 * 60000), // 30 minutes from now
    isTaken: false,
    skipped: false 
  },
  { 
    id: 2, 
    name: "Enalapril", 
    dosage: "10mg", 
    frequency: "1x ao dia",
    times: ["09:00"],
    nextTime: new Date(new Date().getTime() + 120 * 60000), // 2 hours from now
    isTaken: false,
    skipped: false
  },
  { 
    id: 3, 
    name: "AAS", 
    dosage: "100mg", 
    frequency: "1x ao dia",
    times: ["22:00"],
    nextTime: new Date(new Date().setHours(22, 0, 0, 0)), // Today at 10 PM
    isTaken: false,
    skipped: false
  },
  { 
    id: 4, 
    name: "Metformina", 
    dosage: "500mg", 
    frequency: "2x ao dia",
    times: ["08:00", "20:00"],
    nextTime: new Date(new Date().setHours(8, 0, 0, 0)),
    isTaken: true,
    skipped: false
  },
  { 
    id: 5, 
    name: "Vitamina D", 
    dosage: "7000 UI", 
    frequency: "1x por semana",
    times: ["08:00"],
    nextTime: new Date(new Date().setDate(new Date().getDate() + 4)),
    isTaken: false,
    skipped: false
  },
];

const Medications = () => {
  const [medications, setMedications] = useState(initialMedications);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Format time remaining
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
  
  // Format next medication time
  const formatNextTime = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return full date
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle medication taken
  const handleMedicationTaken = (id: number) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, isTaken: true } : med
    ));
    
    toast.success("Medicação registrada com sucesso!");
  };
  
  // Handle skip medication
  const handleSkipMedication = (id: number) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, isTaken: true, skipped: true } : med
    ));
    
    toast.info("Medicação ignorada");
  };
  
  // Handle edit medication
  const handleEditMedication = (id: number) => {
    navigate(`/patient/edit-medication/${id}`);
  };
  
  // Handle delete medication
  const handleDeleteMedication = (id: number) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setDeleteConfirmation(null);
    toast.success("Medicação excluída com sucesso!");
  };
  
  const pendingMedications = medications.filter(med => !med.isTaken);
  const takenMedications = medications.filter(med => med.isTaken);
  
  return (
    <PatientLayout title="Minhas Medicações">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Gerencie suas medicações e registre quando tomá-las
        </p>
        <Button 
          onClick={() => navigate('/patient/add-medication')}
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
          {pendingMedications.map((med) => (
            <Card key={med.id} className="overflow-hidden border-l-4 border-l-blue-500">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg text-gray-900">{med.name}</p>
                    <p className="text-gray-600">{med.dosage} • {med.frequency}</p>
                    <div className="flex items-center mt-2 gap-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-500">
                        Próxima dose: {formatNextTime(med.nextTime)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {med.times.map((time, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 rounded-full h-10 w-10 p-0"
                      onClick={() => handleMedicationTaken(med.id)}
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-10 w-10 p-0"
                      onClick={() => handleSkipMedication(med.id)}
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
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
        <div className="bg-gray-50 border rounded-lg p-8 text-center mb-8">
          <p className="text-gray-500">Não há medicações pendentes no momento.</p>
        </div>
      )}
      
      {/* Taken Medications */}
      <h2 className="text-xl font-semibold mb-4">Medicações Registradas Hoje</h2>
      {takenMedications.length > 0 ? (
        <div className="grid gap-4">
          {takenMedications.map((med) => (
            <Card key={med.id} className={`overflow-hidden border-l-4 ${med.skipped ? 'border-l-amber-500' : 'border-l-green-500'}`}>
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-lg text-gray-900">{med.name}</p>
                      {med.skipped ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                          Ignorado
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Tomado
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{med.dosage} • {med.frequency}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {med.times.map((time, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {time}
                        </span>
                      ))}
                    </div>
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
          <p className="text-gray-500">Nenhuma medicação foi registrada hoje.</p>
        </div>
      )}
    </PatientLayout>
  );
};

export default Medications;
