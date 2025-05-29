
import { useState } from "react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";
import ClinicForm from "./components/ClinicForm";
import NotificationSettings from "./components/NotificationSettings";
import MonitoringSettings from "./components/MonitoringSettings";
import SubscriptionTab from "./components/SubscriptionTab";
import SecurityTab from "./components/SecurityTab";

const Account = () => {
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

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
        <ProfileHeader profile={profile} />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Perfil</TabsTrigger>
            <TabsTrigger value="clinic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Clínica</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Notificações</TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Monitoramento</TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Assinatura</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm profile={profile} setProfile={setProfile} />
          </TabsContent>

          <TabsContent value="clinic">
            <ClinicForm clinic={clinic} setClinic={setClinic} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings 
              settings={settings} 
              updateSetting={updateSetting} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="monitoring">
            <MonitoringSettings 
              settings={settings} 
              updateSetting={updateSetting} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab currentPlan={currentPlan} plans={plans} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab 
              settings={settings} 
              updateSetting={updateSetting} 
              currentPlan={currentPlan} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </ClinicLayout>
  );
};

export default Account;
