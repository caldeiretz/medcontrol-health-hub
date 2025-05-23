
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const Precos = () => {
  const plans = [
    {
      name: "Paciente",
      price: "Grátis",
      period: "para sempre",
      description: "Para uso pessoal",
      features: [
        "Lembretes ilimitados",
        "Registro de sinais vitais",
        "Histórico completo",
        "Compartilhamento com 1 clínica",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      isPopular: false,
      buttonStyle: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
    },
    {
      name: "Clínica",
      price: "R$ 49",
      period: "por mês",
      description: "Para médicos e clínicas",
      features: [
        "Até 50 pacientes",
        "Dashboard completo",
        "Relatórios detalhados",
        "Suporte prioritário",
        "Integração com sistemas",
        "Backup automático"
      ],
      buttonText: "Teste Grátis por 14 dias",
      isPopular: true,
      buttonStyle: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
    },
    {
      name: "Clínica Pro",
      price: "R$ 99",
      period: "por mês",
      description: "Para clínicas maiores",
      features: [
        "Pacientes ilimitados",
        "API personalizada",
        "Relatórios avançados",
        "Múltiplos usuários",
        "Suporte 24/7",
        "Consultoria especializada"
      ],
      buttonText: "Falar com Vendas",
      isPopular: false,
      buttonStyle: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
    }
  ];

  return (
    <section id="precos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planos e Preços
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades. Comece grátis e evolua conforme cresce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${plan.isPopular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star size={14} fill="currentColor" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "Grátis" && (
                      <span className="text-gray-500 ml-2">/{plan.period}</span>
                    )}
                    {plan.price === "Grátis" && (
                      <span className="text-gray-500 ml-2">{plan.period}</span>
                    )}
                  </div>

                  <Button className={`w-full font-semibold py-3 text-white transition-all duration-300 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-center mb-4">O que está incluso:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-gray-600">Sim, você pode cancelar seu plano a qualquer momento sem multas ou taxas adicionais.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">Meus dados estão seguros?</h4>
              <p className="text-gray-600">Absolutamente. Usamos criptografia avançada e estamos em conformidade com a LGPD.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">Oferece teste grátis?</h4>
              <p className="text-gray-600">Sim! Clínicas podem testar todos os recursos por 14 dias sem compromisso.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">Preciso de treinamento?</h4>
              <p className="text-gray-600">Nossa interface é intuitiva, mas oferecemos suporte completo e materiais de ajuda.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Precos;
