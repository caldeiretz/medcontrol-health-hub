
import { useState } from "react";
import { Shield, Download, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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

interface SecurityTabProps {
  settings: {
    twoFactor: boolean;
  };
  updateSetting: (key: string, value: any) => void;
  currentPlan: string;
}

const SecurityTab = ({ settings, updateSetting, currentPlan }: SecurityTabProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente.",
        variant: "destructive"
      });

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

  return (
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
  );
};

export default SecurityTab;
