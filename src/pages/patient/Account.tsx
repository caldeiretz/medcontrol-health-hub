
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Bell, Shield, AlertTriangle, Info } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";
import DeleteAccountModal from "./components/DeleteAccountModal";

const PatientAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Mock user data
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    birthDate: "1990-05-15",
    emergencyContact: "Maria Silva",
    emergencyPhone: "(11) 88888-8888"
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    medicationReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    vitalSignsAlerts: true,
    weeklyReports: true,
    reminderFrequency: "15" // minutes before
  });

  // Privacy settings (removed shareWithFamily)
  const [privacySettings, setPrivacySettings] = useState({
    shareWithDoctor: true,
    dataExport: true,
    anonymousUsage: false
  });

  // Mock current plan - change this to "premium" to test SMS functionality
  const currentPlan = "free"; // "free" | "premium" | "enterprise"

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsLoading(false);
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
    setIsLoading(false);
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Privacidade atualizada",
      description: "Suas configurações de privacidade foram salvas.",
    });
    setIsLoading(false);
  };

  const handleSMSToggle = (checked: boolean) => {
    if (currentPlan === "free" && checked) {
      toast({
        title: "Recurso Premium",
        description: "Notificações por SMS estão disponíveis apenas em planos pagos.",
        variant: "destructive"
      });
      return;
    }
    setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }));
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfilePhoto(photoUrl);
  };

  return (
    <PatientLayout title="Configurações da Conta">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/patient/dashboard')}
            className="gap-2 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 border-0 text-white shadow-xl mb-8">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center space-x-6">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <ProfilePhotoUpload
                  currentPhoto={profilePhoto}
                  fallbackText={profileData.name.split(' ').map(n => n[0]).join('')}
                  size="lg"
                  onPhotoChange={handlePhotoChange}
                />
              </div>
              <div className="space-y-2 flex-1">
                <h2 className="text-3xl font-bold text-white">{profileData.name}</h2>
                <p className="text-blue-100 text-lg">{profileData.email}</p>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                    ● Paciente Ativo
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conta
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <User className="h-5 w-5 text-blue-500" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Contato de Emergência</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Nome</Label>
                      <Input
                        id="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Telefone</Label>
                      <Input
                        id="emergencyPhone"
                        value={profileData.emergencyPhone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-green-500">
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab - updated with SMS improvements */}
          <TabsContent value="notifications">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <TooltipProvider>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Lembretes de Medicação</Label>
                        <p className="text-sm text-gray-500">Receber notificações para tomar medicamentos</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.medicationReminders}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, medicationReminders: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Antecedência do Lembrete</Label>
                      <Select 
                        value={notificationSettings.reminderFrequency} 
                        onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, reminderFrequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutos antes</SelectItem>
                          <SelectItem value="10">10 minutos antes</SelectItem>
                          <SelectItem value="15">15 minutos antes</SelectItem>
                          <SelectItem value="30">30 minutos antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-gray-500">Receber relatórios e lembretes por email</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Label>Notificações por SMS</Label>
                          {currentPlan === "free" && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-amber-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Disponível apenas em planos pagos</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Receber lembretes críticos por SMS
                          {currentPlan === "free" && " (Premium)"}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={handleSMSToggle}
                        disabled={currentPlan === "free"}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Alertas de Sinais Vitais</Label>
                        <p className="text-sm text-gray-500">Notificações quando valores estão fora do normal</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.vitalSignsAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, vitalSignsAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Relatórios Semanais</Label>
                        <p className="text-sm text-gray-500">Resumo semanal do seu progresso</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                      />
                    </div>
                  </div>
                </TooltipProvider>

                <Button onClick={handleSaveNotifications} disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-green-500">
                  {isLoading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab - removed shareWithFamily */}
          <TabsContent value="privacy">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Configurações de Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compartilhar com Médico</Label>
                      <p className="text-sm text-gray-500">Permitir que médicos vejam seus dados</p>
                    </div>
                    <Switch 
                      checked={privacySettings.shareWithDoctor}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, shareWithDoctor: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Exportação de Dados</Label>
                      <p className="text-sm text-gray-500">Permitir exportar seus dados pessoais</p>
                    </div>
                    <Switch 
                      checked={privacySettings.dataExport}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, dataExport: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Uso Anônimo</Label>
                      <p className="text-sm text-gray-500">Contribuir com dados anônimos para pesquisa</p>
                    </div>
                    <Switch 
                      checked={privacySettings.anonymousUsage}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, anonymousUsage: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSavePrivacy} disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-green-500">
                  {isLoading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab - updated with new modal */}
          <TabsContent value="account">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Zona de Perigo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Excluir Conta</h3>
                  <p className="text-sm text-red-600 mb-4">
                    Esta ação não pode ser desfeita. Todos os seus dados, incluindo medicamentos, 
                    histórico de sinais vitais e configurações serão permanentemente removidos.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir Conta Permanentemente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DeleteAccountModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>
    </PatientLayout>
  );
};

export default PatientAccount;
