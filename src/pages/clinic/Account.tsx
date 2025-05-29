
import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Download } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const { toast } = useToast();
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
    email: "contato@clinicadrsilva.com"
  });

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleSaveClinic = () => {
    toast({
      title: "Dados da clínica atualizados",
      description: "As informações da clínica foram atualizadas com sucesso.",
    });
  };

  return (
    <ClinicLayout title="Minha Conta">
      <div className="max-w-4xl space-y-6">
        {/* Cabeçalho do Perfil */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">JS</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-gray-500">{profile.specialty}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{profile.crm}</Badge>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="clinic">Clínica</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          {/* Perfil do Médico */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crm">CRM</Label>
                    <Input 
                      id="crm"
                      value={profile.crm}
                      onChange={(e) => setProfile(prev => ({ ...prev, crm: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Input 
                      id="specialty"
                      value={profile.specialty}
                      onChange={(e) => setProfile(prev => ({ ...prev, specialty: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input 
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Informações da Clínica */}
          <TabsContent value="clinic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dados da Clínica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicAddress">Endereço</Label>
                  <Input 
                    id="clinicAddress"
                    value={clinic.address}
                    onChange={(e) => setClinic(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSaveClinic}>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assinatura */}
          <TabsContent value="subscription">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Plano Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
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

              <Card>
                <CardHeader>
                  <CardTitle>Recursos Inclusos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Monitoramento de até 100 pacientes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Alertas em tempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Relatórios personalizados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Integração com dispositivos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Suporte prioritário
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
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

          {/* Segurança */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Senha</p>
                      <p className="text-sm text-gray-500">Última alteração: há 30 dias</p>
                    </div>
                    <Button variant="outline">Alterar Senha</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Autenticação em Duas Etapas</p>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Sessões Ativas</p>
                      <p className="text-sm text-gray-500">Gerencie seus dispositivos conectados</p>
                    </div>
                    <Button variant="outline">Ver Sessões</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Download dos Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Baixe uma cópia de todos os seus dados em conformidade com a LGPD.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Solicitar Download dos Dados
                  </Button>
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
