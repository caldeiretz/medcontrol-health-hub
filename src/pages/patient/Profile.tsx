
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Mock user data - in real app would come from auth context
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    birthDate: "1990-05-15",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    emergencyContact: "Maria Silva",
    emergencyPhone: "(11) 88888-8888"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfilePhoto(photoUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Perfil atualizado com sucesso!");
    setIsLoading(false);
  };

  return (
    <PatientLayout title="Meu Perfil">
      <div className="max-w-2xl mx-auto">
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
                  fallbackText={formData.name.split(' ').map(n => n[0]).join('')}
                  size="lg"
                  onPhotoChange={handlePhotoChange}
                />
              </div>
              <div className="space-y-2 flex-1">
                <h2 className="text-3xl font-bold text-white">{formData.name}</h2>
                <p className="text-blue-100 text-lg">{formData.email}</p>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                    ● Paciente Ativo
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User className="h-5 w-5 text-blue-500" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="border-2 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="border-2 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="border-2 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    required
                    className="border-2 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className="border-2 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  className="border-2 focus:border-blue-400"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Contato de Emergência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Nome</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      required
                      className="border-2 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      required
                      className="border-2 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/patient/dashboard')}
                  className="flex-1 border-2 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  {isLoading ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default Profile;
