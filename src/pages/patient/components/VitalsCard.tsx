
import { useState } from "react";
import { Plus, Activity, Heart, Droplets, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVitals } from "@/hooks/useVitals";

const VitalsCard = () => {
  const { vitals, createVital, isCreating } = useVitals(5); // Get last 5 vitals
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    systolic: '',
    diastolic: '',
    value: '',
    unit: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vitalData = {
      type: formData.type as any,
      recorded_at: new Date().toISOString(),
      notes: formData.notes || undefined,
      ...(formData.type === 'blood_pressure' ? {
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic)
      } : {
        value: parseFloat(formData.value),
        unit: formData.unit
      })
    };

    createVital(vitalData);
    setIsDialogOpen(false);
    setFormData({
      type: '',
      systolic: '',
      diastolic: '',
      value: '',
      unit: '',
      notes: ''
    });
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure':
        return <Activity className="h-4 w-4 text-red-500" />;
      case 'heart_rate':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'glucose':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'weight':
        return <Scale className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVitalName = (type: string) => {
    switch (type) {
      case 'blood_pressure':
        return 'Pressão Arterial';
      case 'heart_rate':
        return 'Frequência Cardíaca';
      case 'glucose':
        return 'Glicose';
      case 'weight':
        return 'Peso';
      default:
        return type;
    }
  };

  const getVitalValue = (vital: any) => {
    if (vital.type === 'blood_pressure') {
      return `${vital.systolic}/${vital.diastolic} mmHg`;
    }
    return `${vital.value} ${vital.unit || ''}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Sinais Vitais</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Sinal Vital</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo de Sinal Vital</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_pressure">Pressão Arterial</SelectItem>
                    <SelectItem value="heart_rate">Frequência Cardíaca</SelectItem>
                    <SelectItem value="weight">Peso</SelectItem>
                    <SelectItem value="glucose">Glicose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'blood_pressure' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolic">Sistólica</Label>
                    <Input
                      id="systolic"
                      type="number"
                      placeholder="120"
                      value={formData.systolic}
                      onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastólica</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      placeholder="80"
                      value={formData.diastolic}
                      onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : formData.type ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Valor</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.1"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unidade</Label>
                    <Input
                      id="unit"
                      placeholder={
                        formData.type === 'weight' ? 'kg' :
                        formData.type === 'heart_rate' ? 'bpm' :
                        formData.type === 'glucose' ? 'mg/dL' : ''
                      }
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações adicionais..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating || !formData.type}>
                  {isCreating ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {vitals.length > 0 ? (
          <div className="space-y-3">
            {vitals.map((vital) => (
              <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getVitalIcon(vital.type)}
                  <div>
                    <p className="font-medium text-sm">{getVitalName(vital.type)}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getVitalValue(vital)}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{new Date(vital.recorded_at).toLocaleDateString('pt-BR')}</p>
                  <p>{new Date(vital.recorded_at).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum sinal vital registrado</p>
            <p className="text-gray-400 text-xs mt-1">Clique em "Adicionar" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalsCard;
