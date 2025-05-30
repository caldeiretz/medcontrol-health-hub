import { useState } from "react";
import { Heart, Droplets, Scale, Activity, Plus, Edit, Trash2, Calendar } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVitals } from "@/hooks/useVitals";
import { Vital } from "@/services/vitalsService";

const Vitals = () => {
  const { vitals, createVital, updateVital, deleteVital, isLoading } = useVitals();
  const [editingVital, setEditingVital] = useState<Vital | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "" as Vital['type'],
    systolic: "",
    diastolic: "",
    value: "",
    unit: "",
    notes: "",
    recorded_at: new Date().toISOString().split('T')[0]
  });

  const resetForm = () => {
    setFormData({
      type: "" as Vital['type'],
      systolic: "",
      diastolic: "",
      value: "",
      unit: "",
      notes: "",
      recorded_at: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (vital: Vital) => {
    setEditingVital(vital);
    setFormData({
      type: vital.type,
      systolic: vital.systolic?.toString() || "",
      diastolic: vital.diastolic?.toString() || "",
      value: vital.value?.toString() || "",
      unit: vital.unit || "",
      notes: vital.notes || "",
      recorded_at: vital.recorded_at.split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = () => {
    const vitalData = {
      type: formData.type,
      systolic: formData.type === 'blood_pressure' && formData.systolic ? parseInt(formData.systolic) : undefined,
      diastolic: formData.type === 'blood_pressure' && formData.diastolic ? parseInt(formData.diastolic) : undefined,
      value: formData.type !== 'blood_pressure' && formData.value ? parseFloat(formData.value) : undefined,
      unit: formData.unit || undefined,
      notes: formData.notes || undefined,
      recorded_at: new Date(formData.recorded_at).toISOString()
    };

    if (editingVital) {
      updateVital({ id: editingVital.id, updates: vitalData });
      setIsEditDialogOpen(false);
      setEditingVital(null);
    } else {
      createVital(vitalData);
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteVital(id);
    setDeleteConfirmation(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
      setEditingVital(null);
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Heart className="h-5 w-5" />;
      case 'glucose': return <Droplets className="h-5 w-5" />;
      case 'weight': return <Scale className="h-5 w-5" />;
      case 'heart_rate': return <Activity className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getVitalLabel = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'Pressão Arterial';
      case 'glucose': return 'Glicose';
      case 'weight': return 'Peso';
      case 'heart_rate': return 'Frequência Cardíaca';
      default: return type;
    }
  };

  const formatVitalValue = (vital: Vital) => {
    if (vital.type === 'blood_pressure') {
      return `${vital.systolic}/${vital.diastolic} mmHg`;
    }
    return `${vital.value} ${vital.unit || ''}`;
  };

  if (isLoading) {
    return (
      <PatientLayout title="Sinais Vitais">
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Sinais Vitais">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Registre e monitore seus sinais vitais regularmente
        </p>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); handleDialogClose(open); }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-1 h-4 w-4" />
              Registrar Sinal Vital
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Novo Sinal Vital</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Sinal Vital</Label>
                <Select value={formData.type} onValueChange={(value: Vital['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_pressure">Pressão Arterial</SelectItem>
                    <SelectItem value="glucose">Glicose</SelectItem>
                    <SelectItem value="weight">Peso</SelectItem>
                    <SelectItem value="heart_rate">Frequência Cardíaca</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'blood_pressure' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sistólica</Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={formData.systolic}
                      onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diastólica</Label>
                    <Input
                      type="number"
                      placeholder="80"
                      value={formData.diastolic}
                      onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <Input
                      placeholder="mg/dL, kg, bpm"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={formData.recorded_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, recorded_at: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Observações (opcional)</Label>
                <Input
                  placeholder="Ex: Em jejum, após exercício"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={!formData.type}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); handleDialogClose(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sinal Vital</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Sinal Vital</Label>
              <Select value={formData.type} onValueChange={(value: Vital['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood_pressure">Pressão Arterial</SelectItem>
                  <SelectItem value="glucose">Glicose</SelectItem>
                  <SelectItem value="weight">Peso</SelectItem>
                  <SelectItem value="heart_rate">Frequência Cardíaca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'blood_pressure' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sistólica</Label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={formData.systolic}
                    onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Diastólica</Label>
                  <Input
                    type="number"
                    placeholder="80"
                    value={formData.diastolic}
                    onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Input
                    placeholder="mg/dL, kg, bpm"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.recorded_at}
                onChange={(e) => setFormData(prev => ({ ...prev, recorded_at: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Input
                placeholder="Ex: Em jejum, após exercício"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!formData.type}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vitals List */}
      {vitals.length > 0 ? (
        <div className="grid gap-4">
          {vitals.map((vital) => (
            <Card key={vital.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {getVitalIcon(vital.type)}
                    </div>
                    <div>
                      <p className="font-medium">{getVitalLabel(vital.type)}</p>
                      <p className="text-2xl font-bold text-gray-900">{formatVitalValue(vital)}</p>
                      {vital.notes && (
                        <p className="text-sm text-gray-500 mt-1">{vital.notes}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(vital.recorded_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(vital)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog open={deleteConfirmation === vital.id} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmation(vital.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar exclusão</DialogTitle>
                        </DialogHeader>
                        <p className="py-4">
                          Tem certeza que deseja excluir este registro de {getVitalLabel(vital.type).toLowerCase()}?
                          Esta ação não pode ser desfeita.
                        </p>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancelar</Button>
                          <Button variant="destructive" onClick={() => handleDelete(vital.id)}>Excluir</Button>
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
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Você ainda não registrou nenhum sinal vital.</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-1 h-4 w-4" />
                Registrar Primeiro Sinal Vital
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </PatientLayout>
  );
};

export default Vitals;
