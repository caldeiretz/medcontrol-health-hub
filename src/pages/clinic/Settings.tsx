
import { useState } from "react";
import { Save, Bell, Shield, Database, Wifi } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    clinicName: "Clínica Dr. Silva",
    email: "contato@clinicadrsilva.com",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123, São Paulo, SP",
    workingHours: "08:00 - 18:00",
    specialties: "Cardiologia, Endocrinologia",
    emailNotifications: true,
    smsNotifications: false,
    criticalAlerts: true,
    dailyReports: true,
    minAdherence: 70,
    maxBloodPressure: 140,
    minBloodPressure: 90,
    dataRetention: 365,
    twoFactor: false,
    apiAccess: false
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ClinicLayout title="Configurações">
      <div className="max-w-4xl">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          {/* Configurações Gerais */}
          <TabsContent value="general">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Informações da Clínica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Nome da Clínica</Label>
                      <Input 
                        id="clinicName"
                        value={settings.clinicName}
                        onChange={(e) => updateSetting('clinicName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateSetting('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHours">Horário de Funcionamento</Label>
                      <Input 
                        id="workingHours"
                        value={settings.workingHours}
                        onChange={(e) => updateSetting('workingHours', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea 
                      id="address"
                      value={settings.address}
                      onChange={(e) => updateSetting('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Especialidades</Label>
                    <Textarea 
                      id="specialties"
                      value={settings.specialties}
                      onChange={(e) => updateSetting('specialties', e.target.value)}
                      placeholder="Lista as especialidades oferecidas pela clínica"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoramento */}
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Parâmetros de Monitoramento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autenticação em Duas Etapas</Label>
                    <p className="text-sm text-gray-500">Adicionar uma camada extra de segurança</p>
                  </div>
                  <Switch 
                    checked={settings.twoFactor}
                    onCheckedChange={(checked) => updateSetting('twoFactor', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Acesso à API</Label>
                    <p className="text-sm text-gray-500">Permitir integração com sistemas externos</p>
                  </div>
                  <Switch 
                    checked={settings.apiAccess}
                    onCheckedChange={(checked) => updateSetting('apiAccess', checked)}
                  />
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Alterar Senha
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download dos Dados
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Excluir Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </ClinicLayout>
  );
};

export default Settings;
