
import { useState } from "react";
import { User, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    crm: string;
    specialty: string;
    address: string;
    birthDate: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileForm = ({ profile, setProfile }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
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
  );
};

export default ProfileForm;
