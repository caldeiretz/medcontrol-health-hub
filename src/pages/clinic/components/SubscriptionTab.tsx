
import { CreditCard, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface SubscriptionTabProps {
  currentPlan: string;
  plans: Plan[];
}

const SubscriptionTab = ({ currentPlan, plans }: SubscriptionTabProps) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default SubscriptionTab;
