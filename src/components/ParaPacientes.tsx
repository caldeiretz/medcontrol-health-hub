import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Smartphone, Users, Shield } from 'lucide-react';

const ParaPacientes = () => {
  const navigate = useNavigate();
  
  const handlePatientSignUp = () => {
    navigate('/auth/patient-register');
  };

  const benefits = [{
    icon: Smartphone,
    title: "Fácil de usar",
    description: "Interface simples e intuitiva, ideal para todas as idades"
  }, {
    icon: Heart,
    title: "Visual limpo e claro",
    description: "Design pensado para facilitar a leitura e navegação"
  }, {
    icon: Users,
    title: "Uso flexível",
    description: "Pode ser usado sozinho ou conectado com sua clínica"
  }, {
    icon: Shield,
    title: "Privacidade garantida",
    description: "Suas informações só são compartilhadas com seu consentimento"
  }];
  return (
    <section id="para-pacientes" className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile App Preview */}
          <div className="order-2 lg:order-1 relative">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
                {/* App Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Olá, Maria!</h3>
                    <p className="text-sm text-gray-500">Como está se sentindo hoje?</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <Heart size={20} className="text-white" />
                  </div>
                </div>

                {/* Today's Progress */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso de Hoje</span>
                    <span className="text-green-600 font-bold">3/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{
                    width: '75%'
                  }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Você está indo muito bem!</p>
                </div>

                {/* Medication List */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Próximos Medicamentos:</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-800">Losartana 50mg</p>
                        <p className="text-xs text-gray-500">Em 5 minutos</p>
                      </div>
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-600">Metformina 850mg</p>
                        <p className="text-xs text-gray-400">14:00</p>
                      </div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Quick Action */}
                <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium">
                  Ver Todos os Medicamentos
                </Button>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-lg shadow-lg">
              💊
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-lg">
              📊
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-left">
                Você no controle da 
                <span className="text-green-600"> sua saúde</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed text-left">
                Com lembretes, gráficos e um toque por dia, o MedControl ajuda você a seguir 
                seu tratamento e compartilhar informações com quem cuida de você.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium text-center">
                  🔒 Suas informações só serão compartilhadas com o seu consentimento
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <benefit.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-center px-[23px] py-[17px] my-[20px] mx-0"
              onClick={handlePatientSignUp}
            >
              Começar Agora - É Grátis!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParaPacientes;
