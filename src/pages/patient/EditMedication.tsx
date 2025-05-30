
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
import { useMedications } from "@/hooks/useMedications";
import { Medication } from "@/services/medicationService";
import { toast } from "sonner";
import MedicationTimesPicker from "@/components/MedicationTimesPicker";

const EditMedication = () => {
  const { medicationId } = useParams();
  const navigate = useNavigate();
  const { medications, updateMedication, isUpdating, getMedicationTimes } = useMedications();
  const [isLoading, setIsLoading] = useState(true);
  const [customTimes, setCustomTimes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    start_date: "",
    end_date: ""
  });

  const medication = medications.find(med => med.id === medicationId);
  const { data: existingTimes = [] } = getMedicationTimes(medicationId || "");

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        instructions: medication.instructions || "",
        start_date: medication.start_date,
        end_date: medication.end_date || ""
      });
      setCustomTimes(existingTimes);
      setIsLoading(false);
    } else if (medications.length > 0) {
      toast.error("Medicação não encontrada");
      navigate('/patient/medications');
    }
  }, [medication, medications, medicationId, navigate, existingTimes]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationId) {
      toast.error("ID da medicação não encontrado");
      return;
    }

    const updates: Partial<Medication> = {
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      instructions: formData.instructions || null,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
    };

    updateMedication({ 
      id: medicationId, 
      updates,
      customTimes: customTimes.length > 0 ? customTimes : undefined
    });
    navigate('/patient/medications');
  };

  if (isLoading) {
    return (
      <PatientLayout title="Editar Medicação">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Editar Medicação">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/patient/medications')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Medicações
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar {formData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Medicação</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosagem</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="Ex: 50mg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência</Label>
                <Select 
                  value={formData.frequency}
                  onValueChange={(value) => handleInputChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1x ao dia">1 vez ao dia</SelectItem>
                    <SelectItem value="12/12h">A cada 12 horas (2x ao dia)</SelectItem>
                    <SelectItem value="8/8h">A cada 8 horas (3x ao dia)</SelectItem>
                    <SelectItem value="6/6h">A cada 6 horas (4x ao dia)</SelectItem>
                    <SelectItem value="1x por semana">1 vez por semana</SelectItem>
                    <SelectItem value="S.O.S.">Somente quando necessário (S.O.S.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.frequency && formData.frequency !== "S.O.S." && (
                <MedicationTimesPicker
                  frequency={formData.frequency}
                  customTimes={customTimes}
                  onCustomTimesChange={setCustomTimes}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Fim (opcional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instruções Especiais (opcional)</Label>
                <Input
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Ex: Tomar com água, antes das refeições"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/patient/medications')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default EditMedication;
