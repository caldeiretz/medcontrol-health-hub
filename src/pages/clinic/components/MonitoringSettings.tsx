
import { Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MonitoringSettingsProps {
  settings: {
    minAdherence: number;
    maxBloodPressure: number;
    minBloodPressure: number;
    dataRetention: number;
  };
  updateSetting: (key: string, value: any) => void;
  isLoading: boolean;
}

const MonitoringSettings = ({ settings, updateSetting, isLoading }: MonitoringSettingsProps) => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    setTimeout(() => {
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Wifi className="h-5 w-5 text-blue-500" />
          Parâmetros de Monitoramento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minAdherence">Adesão Mínima (%)</Label>
            <Input 
              id="minAdherence"
              type="number"
              value={settings.minAdherence}
              onChange={(e) => updateSetting('minAdherence', parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500">Limite mínimo para gerar alerta de baixa adesão</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxBloodPressure">Pressão Sistólica Máxima (mmHg)</Label>
            <Input 
              id="maxBloodPressure"
              type="number"
              value={settings.maxBloodPressure}
              onChange={(e) => updateSetting('maxBloodPressure', parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500">Limite máximo para gerar alerta de hipertensão</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minBloodPressure">Pressão Diastólica Máxima (mmHg)</Label>
            <Input 
              id="minBloodPressure"
              type="number"
              value={settings.minBloodPressure}
              onChange={(e) => updateSetting('minBloodPressure', parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500">Limite máximo para a pressão diastólica</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
            <Select value={settings.dataRetention.toString()} onValueChange={(value) => updateSetting('dataRetention', parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="180">180 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
                <SelectItem value="730">2 anos</SelectItem>
                <SelectItem value="1825">5 anos</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">Tempo de armazenamento dos dados dos pacientes</p>
          </div>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MonitoringSettings;
