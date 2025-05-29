import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Building } from 'lucide-react';
const CTA = () => {
  const navigate = useNavigate();
  const handlePatientSignUp = () => {
    navigate('/auth/patient-register');
  };
  const handleClinicSignUp = () => {
    navigate('/auth/clinic-register');
  };
  return <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
              Comece hoje mesmo a cuidar melhor da saúde com o 
              <span className="text-blue-200"> MedControl</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram seu cuidado com a saúde
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-700 font-semibold text-lg px-8 py-4 hover:bg-blue-50 transition-all duration-300 shadow-lg group" onClick={handlePatientSignUp}>
              <Users className="mr-3 group-hover:scale-110 transition-transform" size={20} />
              Criar Conta (Paciente)
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            
            <Button size="lg" variant="outline" onClick={handleClinicSignUp} className="border-2 border-white font-semibold text-lg px-8 py-4 hover:bg-white transition-all duration-300 group text-blue-700">
              <Building className="mr-3 group-hover:scale-110 transition-transform" size={20} />
              Criar Conta (Clínica)
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-8">
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Começe grátis em 2 minutos</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Sem cartão de crédito</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Dados 100% seguros</span>
            </div>
          </div>

          {/* Social proof */}
          <div className="pt-8">
            <p className="text-blue-200 text-sm mb-4">Já confiaram no MedControl:</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="bg-white/20 px-4 py-2 rounded-lg text-white font-medium">Hospital A</div>
              <div className="bg-white/20 px-4 py-2 rounded-lg text-white font-medium">Clínica B</div>
              <div className="bg-white/20 px-4 py-2 rounded-lg text-white font-medium">Centro C</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CTA;