import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Download, Save, Bell, Database, Wifi, Settings } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

const Account = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    name: "Dr. João Silva",
    email: "joao.silva@clinica.com",
    phone: "(11) 99999-9999",
    crm: "CRM/SP 123456",
    specialty: "Cardiologia",
    address: "Rua das Flores, 123, São Paulo, SP",
    birthDate: "1980-05-15"
  });

  const [clinic, setClinic] = useState({
    name: "Clínica Dr. Silva",
    cnpj: "12.345.678/0001-90",
    address: "Av. Paulista, 1000, São Paulo, SP",
    phone: "(11) 3333-4444",
    email: "contato@clinicadrsilva.com",
    workingHours: "08:00 - 18:00",
    specialties: "Cardiologia, Endocrinologia"
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    criticalAlerts: true,
    dailyReports: true,
    minAdherence: 70,
    maxBloodPressure: 140,
    minBloodPressure: 90,
    dataRetention: 365,
    twoFactor: false
  });

  const [currentPlan] = useState("pro");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    }, 1000);
  };

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

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    toast({
      title: "Redirecionando...",
      description: "Você será redirecionado para alterar sua senha.",
    });
  };

  const handleSetup2FA = () => {
    toast({
      title: "Configurando 2FA",
      description: "Em breve você receberá instruções por email.",
    });
  };

  const handleDownloadData = () => {
    toast({
      title: "Preparando download",
      description: "Seus dados serão preparados e enviados por email em até 24 horas.",
    });
  };

  const handleManageSessions = () => {
    toast({
      title: "Gerenciar sessões",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const handleUpgrade = (plan: string) => {
    toast({
      title: "Upgrade de plano",
      description: `Redirecionando para upgrade para o plano ${plan}...`,
    });
  };

  const handleDowngrade = () => {
    toast({
      title: "Downgrade de plano",
      description: "Redirecionando para alteração de plano...",
    });
  };

  const handleCancelSubscription = () => {
    if (confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      toast({
        title: "Cancelamento solicitado",
        description: "Sua solicitação de cancelamento foi enviada.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "EXCLUIR") {
      toast({
        title: "Confirmação incorreta",
        description: "Por favor, digite 'EXCLUIR' para confirmar a exclusão da conta.",
        variant: "destructive"
      });
      return;
    }

    setIsDeletingAccount(true);
    
    try {
      // Simular processo de exclusão da conta
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente.",
        variant: "destructive"
      });

      // Fazer logout e redirecionar
      logout();
      navigate('/');
      
    } catch (error) {
      toast({
        title: "Erro ao excluir conta",
        description: "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingAccount(false);
      setDeleteConfirmation("");
    }
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfilePhoto(photoUrl);
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "R$ 149/mês",
      features: ["Até 50 pacientes", "Relatórios básicos", "Suporte por email"],
      current: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 299/mês",
      features: ["Até 100 pacientes", "Alertas em tempo real", "Relatórios personalizados", "Integração com dispositivos", "Suporte prioritário"],
      current: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R$ 599/mês",
      features: ["Pacientes ilimitados", "Todos os recursos Pro", "API personalizada", "Integração personalizada", "Suporte dedicado"],
      current: false
    }
  ];

  return (
    <ClinicLayout title="Conta & Configurações">
      <div className="max-w-4xl space-y-6">
        {/* Cabeçalho do Perfil Modernizado */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 border-0 text-white shadow-xl">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center space-x-6">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <ProfilePhotoUpload
                  currentPhoto={profilePhoto}
                  fallbackText={profile.name.split(' ').map(n => n[0]).join('')}
                  size="lg"
                  onPhotoChange={handlePhotoChange}
                />
              </div>
              <div className="space-y-2 flex-1">
                <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                <p className="text-blue-100 text-lg">{profile.specialty}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    {profile.crm}
                  </Badge>
                  <Badge className="bg-green-500/30 text-green-100 border-green-300/50">
                    ● Ativo
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Perfil</TabsTrigger>
            <TabsTrigger value="clinic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Clínica</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Notificações</TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Monitoramento</TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Assinatura</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Segurança</TabsTrigger>
          </TabsList>

          {/* Perfil do Médico */}
          <TabsContent value="profile">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <User className="h-5 w-5 text-blue-500" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Nome Completo</Label>
                    <Input 
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Telefone</Label>
                    <Input 
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crm" className="text-gray-700 font-medium">CRM</Label>
                    <Input 
                      id="crm"
                      value={profile.crm}
                      onChange={(e) => setProfile(prev => ({ ...prev, crm: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-gray-700 font-medium">Especialidade</Label>
                    <Input 
                      id="specialty"
                      value={profile.specialty}
                      onChange={(e) => setProfile(prev => ({ ...prev, specialty: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-gray-700 font-medium">Data de Nascimento</Label>
                    <Input 
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">Endereço</Label>
                  <Input 
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Informações da Clínica */}
          <TabsContent value="clinic">
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
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications">
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
          </TabsContent>

          {/* Monitoramento */}
          <TabsContent value="monitoring">
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
          </TabsContent>

          {/* Assinatura */}
          <TabsContent value="subscription">
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    Plano Atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">MedControl Pro</h3>
                      <p className="text-gray-500">Até 100 pacientes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">R$ 299/mês</p>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle>Planos Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {plans.map((plan) => (
                      <div 
                        key={plan.id} 
                        className={`border rounded-lg p-4 ${plan.current ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{plan.name}</h4>
                          {plan.current && <Badge>Atual</Badge>}
                        </div>
                        <p className="text-xl font-bold mb-3">{plan.price}</p>
                        <ul className="space-y-1 text-sm text-gray-600 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {!plan.current && (
                          <Button 
                            variant={plan.id === "basic" ? "outline" : "default"}
                            className="w-full"
                            onClick={() => plan.id === "basic" ? handleDowngrade() : handleUpgrade(plan.name)}
                          >
                            {plan.id === "basic" ? "Downgrade" : "Upgrade"}
                          </Button>
                        )}
                        {plan.current && (
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={handleCancelSubscription}
                          >
                            Cancelar Assinatura
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Dezembro 2024</span>
                      <span className="font-semibold">R$ 299,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Novembro 2024</span>
                      <span className="font-semibold">R$ 299,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Outubro 2024</span>
                      <span className="font-semibold">R$ 299,00</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Comprovantes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Segurança com confirmação de exclusão */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Senha</p>
                      <p className="text-sm text-gray-500">Última alteração: há 30 dias</p>
                    </div>
                    <Button variant="outline" onClick={handleChangePassword}>
                      Alterar Senha
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Autenticação em Duas Etapas</p>
                        {settings.twoFactor && <Badge className="bg-green-100 text-green-800">Ativo</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={settings.twoFactor}
                        onCheckedChange={(checked) => {
                          updateSetting('twoFactor', checked);
                          if (checked) handleSetup2FA();
                        }}
                      />
                      <Button variant="outline" size="sm" onClick={handleSetup2FA}>
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Sessões Ativas</p>
                      <p className="text-sm text-gray-500">Gerencie seus dispositivos conectados</p>
                    </div>
                    <Button variant="outline" onClick={handleManageSessions}>
                      Ver Sessões
                    </Button>
                  </div>

                  {currentPlan === "enterprise" && (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 border-amber-200">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Acesso à API</p>
                            <Badge className="bg-amber-100 text-amber-800">Premium</Badge>
                          </div>
                          <p className="text-sm text-gray-500">Permitir integração com sistemas externos</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle>Download dos Dados (LGPD)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Baixe uma cópia de todos os seus dados em conformidade com a LGPD.
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleDownloadData}>
                    <Download className="h-4 w-4 mr-2" />
                    Solicitar Download dos Dados
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-red-200 bg-red-50/50 backdrop-blur-sm">
                <CardHeader className="border-b border-red-200">
                  <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Ações irreversíveis que afetam permanentemente sua conta.
                  </p>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full shadow-lg">
                        Excluir Conta Permanentemente
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                          Excluir Conta Permanentemente
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>
                            <strong>Esta ação é irreversível!</strong> Ao excluir sua conta, você perderá permanentemente:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Todos os dados dos pacientes</li>
                            <li>Histórico de medicamentos e tratamentos</li>
                            <li>Relatórios e estatísticas</li>
                            <li>Configurações personalizadas</li>
                            <li>Dados de faturamento e pagamentos</li>
                          </ul>
                          <p className="text-sm">
                            Para confirmar a exclusão, digite <strong>EXCLUIR</strong> no campo abaixo:
                          </p>
                          <Input
                            placeholder="Digite EXCLUIR para confirmar"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="mt-2"
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel 
                          onClick={() => setDeleteConfirmation("")}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmation !== "EXCLUIR" || isDeletingAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeletingAccount ? "Excluindo..." : "Excluir Conta"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClinicLayout>
  );
};

export default Account;
