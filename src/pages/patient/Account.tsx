
import { useState, useEffect } from "react";
import { User, Bell, Shield, Save, Loader2 } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";

const Account = () => {
  const { profile, updateProfile, isLoading, isUpdating } = useProfile();
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    age: 0,
    condition: ""
  });

  const [notifications, setNotifications] = useState({
    notifications_enabled: true,
    email_notifications: true,
    sms_notifications: false
  });

  const [privacy, setPrivacy] = useState({
    data_sharing_enabled: true,
    profile_visibility: "private"
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        birth_date: profile.birth_date || "",
        address: profile.address || "",
        emergency_contact: profile.emergency_contact || "",
        emergency_phone: profile.emergency_phone || "",
        age: profile.age || 0,
        condition: profile.condition || ""
      });

      setNotifications({
        notifications_enabled: profile.notifications_enabled ?? true,
        email_notifications: profile.email_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? false
      });

      setPrivacy({
        data_sharing_enabled: profile.data_sharing_enabled ?? true,
        profile_visibility: profile.profile_visibility || "private"
      });
    }
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfile(profileData);
  };

  const handleSaveNotifications = () => {
    updateProfile(notifications);
  };

  const handleSavePrivacy = () => {
    updateProfile(privacy);
  };

  if (isLoading) {
    return (
      <PatientLayout title="Configurações da Conta">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Configurações da Conta">
      <div className="space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
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
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input 
                  id="birth_date"
                  type="date"
                  value={profileData.birth_date}
                  onChange={(e) => setProfileData(prev => ({ ...prev, birth_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input 
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condição de Saúde</Label>
                <Input 
                  id="condition"
                  value={profileData.condition}
                  onChange={(e) => setProfileData(prev => ({ ...prev, condition: e.target.value }))}
                  placeholder="Ex: Diabetes, Hipertensão"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Contato de Emergência</Label>
                <Input 
                  id="emergency_contact"
                  value={profileData.emergency_contact}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                  placeholder="Nome do contato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_phone">Telefone de Emergência</Label>
                <Input 
                  id="emergency_phone"
                  value={profileData.emergency_phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergency_phone: e.target.value }))}
                  placeholder="Telefone do contato"
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveProfile} 
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications_enabled">Notificações Gerais</Label>
                <p className="text-sm text-gray-500">Receber notificações sobre medicações e sinais vitais</p>
              </div>
              <Switch
                id="notifications_enabled"
                checked={notifications.notifications_enabled}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, notifications_enabled: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_notifications">Notificações por E-mail</Label>
                <p className="text-sm text-gray-500">Receber lembretes por e-mail</p>
              </div>
              <Switch
                id="email_notifications"
                checked={notifications.email_notifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_notifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms_notifications">Notificações por SMS</Label>
                <p className="text-sm text-gray-500">Receber lembretes por SMS</p>
              </div>
              <Switch
                id="sms_notifications"
                checked={notifications.sms_notifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms_notifications: checked }))}
              />
            </div>

            <Button 
              onClick={handleSaveNotifications} 
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Notificações
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data_sharing_enabled">Compartilhamento de Dados</Label>
                <p className="text-sm text-gray-500">Permitir que médicos autorizados vejam seus dados</p>
              </div>
              <Switch
                id="data_sharing_enabled"
                checked={privacy.data_sharing_enabled}
                onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, data_sharing_enabled: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile_visibility">Visibilidade do Perfil</Label>
              <Select 
                value={privacy.profile_visibility}
                onValueChange={(value) => setPrivacy(prev => ({ ...prev, profile_visibility: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="doctors_only">Apenas médicos autorizados</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSavePrivacy} 
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Privacidade
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default Account;
