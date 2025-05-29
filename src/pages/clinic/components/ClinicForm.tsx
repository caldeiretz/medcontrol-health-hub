
import { useState } from "react";
import { Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ClinicFormProps {
  clinic: {
    name: string;
    cnpj: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    specialties: string;
  };
  setClinic: React.Dispatch<React.SetStateAction<any>>;
}

const ClinicForm = ({ clinic, setClinic }: ClinicFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClinic = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados da clínica atualizados",
        description: "As informações da clínica foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Database className="h-5 w-5 text-blue-500" />
          Dados da Clínica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Nome da Clínica</Label>
            <Input 
              id="clinicName"
              value={clinic.name}
              onChange={(e) => setClinic(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input 
              id="cnpj"
              value={clinic.cnpj}
              onChange={(e) => setClinic(prev => ({ ...prev, cnpj: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinicPhone">Telefone</Label>
            <Input 
              id="clinicPhone"
              value={clinic.phone}
              onChange={(e) => setClinic(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinicEmail">E-mail</Label>
            <Input 
              id="clinicEmail"
              type="email"
              value={clinic.email}
              onChange={(e) => setClinic(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workingHours">Horário de Funcionamento</Label>
            <Input 
              id="workingHours"
              value={clinic.workingHours}
              onChange={(e) => setClinic(prev => ({ ...prev, workingHours: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinicAddress">Endereço</Label>
          <Input 
            id="clinicAddress"
            value={clinic.address}
            onChange={(e) => setClinic(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialties">Especialidades</Label>
          <Textarea 
            id="specialties"
            value={clinic.specialties}
            onChange={(e) => setClinic(prev => ({ ...prev, specialties: e.target.value }))}
            placeholder="Liste as especialidades oferecidas pela clínica"
          />
        </div>
        <Button onClick={handleSaveClinic} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClinicForm;
