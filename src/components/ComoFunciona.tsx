
import { Bell, Calendar, Share2 } from 'lucide-react';

const ComoFunciona = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Cadastre sua medicação",
      description: "Adicione nome, horários e dosagens de forma simples e rápida",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Bell,
      title: "Receba lembretes no horário certo", 
      description: "Acompanhamento diário com alertas personalizados",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Share2,
      title: "Compartilhe com seu médico",
      description: "Médico/Clínica pode acompanhar o tratamento e seus sinais vitais",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em apenas 3 passos simples, você terá total controle sobre seus medicamentos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              )}
              
              <div className="text-center space-y-6 relative z-10">
                {/* Icon */}
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={32} className="text-white" />
                </div>

                {/* Step number */}
                <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-green-50 px-6 py-3 rounded-full">
            <span className="text-gray-700 font-medium">Pronto para começar?</span>
            <span className="text-blue-600 font-semibold">É grátis!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
