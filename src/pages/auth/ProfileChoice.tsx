
import { useNavigate } from "react-router-dom";
import { UserRound, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao MedControl</h1>
          <p className="text-gray-600">Selecione o seu tipo de perfil para continuar</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="overflow-hidden transition-all hover:shadow-md hover:border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-6 w-6 text-blue-600" />
                <span>Sou Paciente</span>
              </CardTitle>
              <CardDescription>
                Acesso para gerenciar suas medicações e monitorar sua saúde
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Para pacientes que desejam gerenciar suas medicações, 
                registrar sinais vitais e compartilhar informações com médicos.
              </p>
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => navigate('/auth/patient-login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entrar como Paciente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth/patient-register')}
                >
                  Cadastrar como Paciente
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-all hover:shadow-md hover:border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-6">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-green-600" />
                <span>Sou Médico/Clínica</span>
              </CardTitle>
              <CardDescription>
                Acesso para profissionais que acompanham pacientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Para profissionais de saúde que desejam acompanhar a adesão 
                ao tratamento e monitorar dados de saúde dos pacientes.
              </p>
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => navigate('/auth/clinic-login')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Entrar como Médico/Clínica
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth/clinic-register')}
                >
                  Cadastrar como Médico/Clínica
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileChoice;
