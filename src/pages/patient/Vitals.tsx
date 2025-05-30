
import { useState } from "react";
import { Plus, Activity, Heart, Droplets, Weight } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useVitals } from "@/hooks/useVitals";
import VitalChart from "@/components/charts/VitalChart";
import { format, parseISO } from "date-fns";

const Vitals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vitalType, setVitalType] = useState<'blood_pressure' | 'weight' | 'heart_rate' | 'glucose'>('blood_pressure');
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    value: '',
    notes: '',
    recorded_at: new Date().toISOString().slice(0, 16)
  });

  const { vitals, createVital, isCreating } = useVitals(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vitalData: any = {
      type: vitalType,
      notes: formData.notes || null,
      recorded_at: formData.recorded_at
    };

    if (vitalType === 'blood_pressure') {
      vitalData.systolic = parseInt(formData.systolic);
      vitalData.diastolic = parseInt(formData.diastolic);
    } else {
      vitalData.value = parseFloat(formData.value);
      vitalData.unit = getUnit(vitalType);
    }

    createVital(vitalData);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      systolic: '',
      diastolic: '',
      value: '',
      notes: '',
      recorded_at: new Date().toISOString().slice(0, 16)
    });
  };

  const getUnit = (type: string) => {
    switch (type) {
      case 'glucose':
        return 'mg/dL';
      case 'heart_rate':
        return 'bpm';
      case 'weight':
        return 'kg';
      default:
        return null;
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'glucose':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'heart_rate':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'weight':
        return <Weight className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getVitalValue = (vital: any) => {
    if (vital.type === 'blood_pressure') {
      return `${vital.systolic}/${vital.diastolic} mmHg`;
    }
    return `${vital.value} ${vital.unit || ''}`;
  };

  // Prepare chart data
  const chartData = vitals.map(vital => ({
    date: format(parseISO(vital.recorded_at), 'dd/MM'),
    systolic: vital.systolic,
    diastolic: vital.diastolic,
    glucose: vital.type === 'glucose' ? vital.value : undefined,
    heartRate: vital.type === 'heart_rate' ? vital.value : undefined,
    weight: vital.type === 'weight' ? vital.value : undefined,
    value: vital.value
  }));

  const bloodPressureData = chartData.filter(item => item.systolic && item.diastolic);
  const glucoseData = chartData.filter(item => item.glucose);
  const heartRateData = chartData.filter(item => item.heartRate);

  return (
    <PatientLayout title="Sinais Vitais">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Registre e acompanhe seus sinais vitais
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Sinal Vital
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Sinal Vital</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Sinal Vital</Label>
                  <Select 
                    value={vitalType} 
                    onValueChange={(value: any) => setVitalType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood_pressure">Pressão Arterial</SelectItem>
                      <SelectItem value="glucose">Glicemia</SelectItem>
                      <SelectItem value="heart_rate">Frequência Cardíaca</SelectItem>
                      <SelectItem value="weight">Peso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {vitalType === 'blood_pressure' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Sistólica (mmHg)</Label>
                      <Input
                        id="systolic"
                        type="number"
                        value={formData.systolic}
                        onChange={(e) => setFormData(prev => ({...prev, systolic: e.target.value}))}
                        placeholder="120"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
                      <Input
                        id="diastolic"
                        type="number"
                        value={formData.diastolic}
                        onChange={(e) => setFormData(prev => ({...prev, diastolic: e.target.value}))}
                        placeholder="80"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      Valor ({getUnit(vitalType)})
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      step={vitalType === 'weight' ? '0.1' : '1'}
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({...prev, value: e.target.value}))}
                      placeholder={
                        vitalType === 'glucose' ? '100' :
                        vitalType === 'heart_rate' ? '70' :
                        vitalType === 'weight' ? '70.5' : ''
                      }
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="recorded_at">Data e Hora</Label>
                  <Input
                    id="recorded_at"
                    type="datetime-local"
                    value={formData.recorded_at}
                    onChange={(e) => setFormData(prev => ({...prev, recorded_at: e.target.value}))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Observações sobre a medição..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? 'Registrando...' : 'Registrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Charts */}
        {bloodPressureData.length > 0 && (
          <VitalChart
            title="Pressão Arterial"
            type="pressure"
            data={bloodPressureData}
          />
        )}

        {glucoseData.length > 0 && (
          <VitalChart
            title="Glicemia"
            type="glucose"
            data={glucoseData}
          />
        )}

        {heartRateData.length > 0 && (
          <VitalChart
            title="Frequência Cardíaca"
            type="heart-rate"
            data={heartRateData}
          />
        )}

        {/* Recent vitals list */}
        <Card>
          <CardHeader>
            <CardTitle>Registros Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {vitals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum sinal vital registrado ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {vitals.slice(0, 10).map((vital) => (
                  <div
                    key={vital.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getVitalIcon(vital.type)}
                      <div>
                        <p className="font-medium">
                          {vital.type === 'blood_pressure' ? 'Pressão Arterial' :
                           vital.type === 'glucose' ? 'Glicemia' :
                           vital.type === 'heart_rate' ? 'Frequência Cardíaca' :
                           vital.type === 'weight' ? 'Peso' : vital.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(vital.recorded_at), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {getVitalValue(vital)}
                      </p>
                      {vital.notes && (
                        <p className="text-sm text-gray-600">{vital.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default Vitals;
