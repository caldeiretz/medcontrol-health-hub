
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock data - in real app would fetch from API
const mockMedications = [
  { 
    id: 1, 
    name: "Losartana", 
    dosage: "50mg", 
    frequency: "12/12h",
    times: ["08:00", "20:00"],
    instructions: "Tomar com água, preferencialmente com o estômago vazio"
  },
  { 
    id: 2, 
    name: "Enalapril", 
    dosage: "10mg", 
    frequency: "1x ao dia",
    times: ["09:00"],
    instructions: "Tomar pela manhã com água"
  },
  // ... more mock data
];

const EditMedication = () => {
  const { medicationId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    times: [""],
    instructions: ""
  });

  useEffect(() => {
    // Load medication data
    const medication = mockMedications.find(med => med.id === parseInt(medicationId || "0"));
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        times: medication.times,
        instructions: medication.instructions || ""
      });
    }
  }, [medicationId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, ""]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Medicação atualizada com sucesso!");
    setIsLoading(false);
    navigate('/patient/medications');
  };

  return (
    <PatientLayout title="Editar Medicação">
      <div className="max-w-2xl mx-auto">
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
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  placeholder="Ex: 12/12h, 1x ao dia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Horários</Label>
                {formData.times.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      required
                    />
                    {formData.times.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTimeSlot(index)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTimeSlot}
                  className="w-full"
                >
                  Adicionar Horário
                </Button>
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
                  disabled={isLoading}
                  className="flex-1 gap-2"
                >
                  {isLoading ? (
                    "Salvando..."
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
