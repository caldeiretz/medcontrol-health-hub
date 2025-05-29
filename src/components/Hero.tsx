import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
const Hero = () => {
  const navigate = useNavigate();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleGetStarted = () => {
    navigate('/auth/profile-choice');
  };
  return <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-center">
                Seu tratamento, 
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  {" "}na hora certa
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed text-center">
                MedControl ajuda você a lembrar e acompanhar seus medicamentos com 
                <strong className="text-gray-800"> segurança e simplicidade</strong>.
              </p>
              <p className="text-lg text-gray-500 text-center">
                Ideal para pacientes crônicos e médicos que querem melhorar o cuidado com seus pacientes.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold text-lg px-8 py-4 hover:from-blue-700 hover:to-green-600 transition-all duration-300 shadow-lg" onClick={handleGetStarted}>
                Comece Agora
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('como-funciona')} className="font-semibold text-lg px-8 py-4 border-2 hover:bg-gray-50 transition-all duration-300">
                <Play className="mr-2" size={20} />
                Ver Como Funciona
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Interface simples e intuitiva</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Dados seguros e privados</span>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 lg:p-12">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
                {/* Mock phone interface */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Lembrete</span>
                    </div>
                    <span className="text-xs text-gray-500">Agora</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">Losartana 50mg</h3>
                    <p className="text-sm text-gray-600">Hora de tomar seu medicamento</p>
                    <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-green-500 text-white">
                      Marcar como Tomado
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Próximos lembretes:</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Metformina 850mg</span>
                        <span>14:00</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Sinvastatina 20mg</span>
                        <span>20:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg">
              ✓
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-lg">
              🔔
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;