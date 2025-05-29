
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    criticalAlerts: boolean;
    dailyReports: boolean;
  };
  updateSetting: (key: string, value: any) => void;
  isLoading: boolean;
}

const NotificationSettings = ({ settings, updateSetting, isLoading }: NotificationSettingsProps) => {
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
          <Bell className="h-5 w-5 text-blue-500" />
          Preferências de Notificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Notificações por E-mail</Label>
            <p className="text-sm text-gray-500">Receber alertas e relatórios por e-mail</p>
          </div>
          <Switch 
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Notificações por SMS</Label>
            <p className="text-sm text-gray-500">Receber alertas críticos por SMS</p>
          </div>
          <Switch 
            checked={settings.smsNotifications}
            onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Alertas Críticos</Label>
            <p className="text-sm text-gray-500">Notificações imediatas para emergências</p>
          </div>
          <Switch 
            checked={settings.criticalAlerts}
            onCheckedChange={(checked) => updateSetting('criticalAlerts', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Relatórios Diários</Label>
            <p className="text-sm text-gray-500">Resumo diário dos pacientes</p>
          </div>
          <Switch 
            checked={settings.dailyReports}
            onCheckedChange={(checked) => updateSetting('dailyReports', checked)}
          />
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
