
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedications } from "@/hooks/useMedications";
import MedicationTimesPicker from "@/components/MedicationTimesPicker";

const formSchema = z.object({
  name: z.string().min(1, "Nome do medicamento é obrigatório"),
  dosage: z.string().min(1, "Dosagem é obrigatória"),
  frequency: z.string().min(1, "Frequência é obrigatória"),
  instructions: z.string().optional(),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddMedication = () => {
  const navigate = useNavigate();
  const { createMedication, isCreating } = useMedications();
  const [customTimes, setCustomTimes] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const medicationData = {
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        instructions: data.instructions || null,
        start_date: data.start_date,
        end_date: data.end_date || null,
        is_active: true,
      };

      createMedication({ 
        medication: medicationData, 
        customTimes: customTimes.length > 0 ? customTimes : undefined 
      });
      navigate("/patient/medications");
    } catch (error) {
      console.error("Error creating medication:", error);
    }
  };

  return (
    <PatientLayout title="Adicionar Nova Medicação">
      <div className="max-w-2xl mx-auto space-y-6">
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
            
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Dosagem</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 50mg" 
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
                      <SelectItem value="1x ao dia">1 vez ao dia</SelectItem>
                      <SelectItem value="12/12h">A cada 12 horas (2x ao dia)</SelectItem>
                      <SelectItem value="8/8h">A cada 8 horas (3x ao dia)</SelectItem>
                      <SelectItem value="6/6h">A cada 6 horas (4x ao dia)</SelectItem>
                      <SelectItem value="1x por semana">1 vez por semana</SelectItem>
                      <SelectItem value="S.O.S.">Somente quando necessário (S.O.S.)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("frequency") && form.watch("frequency") !== "S.O.S." && (
              <MedicationTimesPicker
                frequency={form.watch("frequency")}
                customTimes={customTimes}
                onCustomTimesChange={setCustomTimes}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Data de Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
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
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Data de Fim (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        className="text-base" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="instructions"
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
                disabled={isCreating}
              >
                {isCreating ? (
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
