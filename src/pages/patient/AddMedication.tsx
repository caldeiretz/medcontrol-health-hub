
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Nome do medicamento é obrigatório"),
  dosage: z.string().min(1, "Dosagem é obrigatória"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  frequency: z.string().min(1, "Frequência é obrigatória"),
  times: z.array(
    z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)")
  ).min(1, "Adicione pelo menos um horário"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddMedication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medicationTimes, setMedicationTimes] = useState<string[]>([""]);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      unit: "",
      frequency: "",
      times: [""],
      notes: "",
    },
  });

  const handleTimesChange = (value: string, index: number) => {
    const newTimes = [...medicationTimes];
    newTimes[index] = value;
    setMedicationTimes(newTimes);
    
    // Also update the form value
    form.setValue("times", newTimes.filter(time => time));
  };

  const addTimeField = () => {
    setMedicationTimes([...medicationTimes, ""]);
  };

  const removeTimeField = (index: number) => {
    const newTimes = [...medicationTimes];
    newTimes.splice(index, 1);
    setMedicationTimes(newTimes);
    
    // Also update the form value
    form.setValue("times", newTimes.filter(time => time));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Medication data:", data);
      
      // This is where you would send the data to your API
      // For now, we'll just show a success toast and redirect
      
      toast.success("Medicação adicionada com sucesso!");
      setTimeout(() => navigate("/patient/medications"), 1000);
    } catch (error) {
      toast.error("Erro ao adicionar medicação. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PatientLayout title="Adicionar Nova Medicação">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nome do Medicamento</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Losartana" 
                      className="text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Dosagem</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 50" 
                        className="text-base" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Unidade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-base">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mg">mg (miligramas)</SelectItem>
                        <SelectItem value="mcg">mcg (microgramas)</SelectItem>
                        <SelectItem value="g">g (gramas)</SelectItem>
                        <SelectItem value="ml">ml (mililitros)</SelectItem>
                        <SelectItem value="UI">UI (Unidades Internacionais)</SelectItem>
                        <SelectItem value="cp">comprimido(s)</SelectItem>
                        <SelectItem value="gota">gota(s)</SelectItem>
                        <SelectItem value="aplicação">aplicação(ões)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Frequência</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1xdia">1 vez ao dia</SelectItem>
                      <SelectItem value="12h">A cada 12 horas (2x ao dia)</SelectItem>
                      <SelectItem value="8h">A cada 8 horas (3x ao dia)</SelectItem>
                      <SelectItem value="6h">A cada 6 horas (4x ao dia)</SelectItem>
                      <SelectItem value="semana">1 vez por semana</SelectItem>
                      <SelectItem value="quinzena">A cada 15 dias</SelectItem>
                      <SelectItem value="mes">1 vez por mês</SelectItem>
                      <SelectItem value="sos">Somente quando necessário (S.O.S.)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="text-base block mb-2">Horários</FormLabel>
              {medicationTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <Input
                    type="time"
                    className="text-base"
                    value={time}
                    onChange={(e) => handleTimesChange(e.target.value, index)}
                  />
                  
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeField(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={addTimeField}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar horário
              </Button>
              
              {form.formState.errors.times && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.times.message}
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Observações (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Tomar após as refeições" 
                      className="text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/patient/medications")}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Medicação'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PatientLayout>
  );
};

export default AddMedication;
