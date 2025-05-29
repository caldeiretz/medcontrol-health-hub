
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [step, setStep] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [understoodConsequences, setUnderstoodConsequences] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleClose = () => {
    setStep(1);
    setDeleteConfirmation("");
    setUnderstoodConsequences(false);
    onClose();
  };

  const handleFirstStep = () => {
    setStep(2);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "EXCLUIR" || !understoodConsequences) {
      toast({
        title: "Confirmação incorreta",
        description: "Por favor, complete todos os campos de confirmação.",
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
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {step === 1 ? "Excluir Conta - Etapa 1/2" : "Excluir Conta - Etapa 2/2"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-3">
                <strong>ATENÇÃO:</strong> Esta ação é irreversível!
              </p>
              <p className="text-sm text-red-700 mb-3">
                Ao excluir sua conta, você perderá permanentemente:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li>Todos os medicamentos cadastrados</li>
                <li>Histórico de sinais vitais</li>
                <li>Dados de adesão ao tratamento</li>
                <li>Configurações personalizadas</li>
                <li>Contatos de emergência</li>
                <li>Relatórios e estatísticas</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Alternativa:</strong> Se você está insatisfeito com o serviço, 
                considere entrar em contato conosco para resolver possíveis problemas.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleFirstStep}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Confirmação final necessária:
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deleteConfirmation">
                  Digite <strong>EXCLUIR</strong> para confirmar:
                </Label>
                <Input
                  id="deleteConfirmation"
                  placeholder="EXCLUIR"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="border-red-300 focus:border-red-500"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="understand"
                  checked={understoodConsequences}
                  onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                />
                <Label htmlFor="understand" className="text-sm text-gray-700 leading-5">
                  Eu entendo que esta ação é irreversível e que todos os meus dados 
                  serão permanentemente excluídos.
                </Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="flex-1"
                disabled={isDeletingAccount}
              >
                Voltar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "EXCLUIR" || !understoodConsequences || isDeletingAccount}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isDeletingAccount ? "Excluindo..." : "Excluir Definitivamente"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
