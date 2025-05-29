import { Button } from '@/components/ui/button';
import { BarChart3, Users, Shield, Clock } from 'lucide-react';
const ParaClinicas = () => {
  const benefits = [{
    icon: BarChart3,
    title: "Visualização em tempo real",
    description: "Acompanhe a adesão medicamentosa de todos os seus pacientes"
  }, {
    icon: Users,
    title: "Dados compartilhados",
    description: "Acesse informações com consentimento do paciente"
  }, {
    icon: Shield,
    title: "Segurança total",
    description: "Dados protegidos e em conformidade com a LGPD"
  }, {
    icon: Clock,
    title: "Economize tempo",
    description: "Reduza consultas desnecessárias e melhore o atendimento"
  }];
  return <section id="para-clinicas" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 my-0">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                Transforme o acompanhamento de 
                <span className="text-blue-600"> seus pacientes</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed text-center">
                Melhore a adesão medicamentosa, reduza complicações e tenha uma visão clara 
                da rotina de seus pacientes crônicos.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <benefit.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>)}
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center px-[16px] mx-[40px] my-[51px] py-0">
              Criar Conta para Clínica
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Painel da Clínica</h3>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>12 pacientes online</span>
                  </div>
                </div>

                {/* Patient List */}
                <div className="space-y-4">
                  {[{
                  name: "Maria Silva",
                  adherence: 95,
                  status: "Excelente"
                }, {
                  name: "João Santos",
                  adherence: 78,
                  status: "Boa"
                }, {
                  name: "Ana Costa",
                  adherence: 45,
                  status: "Atenção"
                }].map((patient, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{patient.name}</p>
                        <p className="text-sm text-gray-500">Adesão: {patient.adherence}%</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${patient.adherence >= 90 ? 'bg-green-100 text-green-700' : patient.adherence >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {patient.status}
                      </div>
                    </div>)}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">24</p>
                    <p className="text-xs text-gray-500">Pacientes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">86%</p>
                    <p className="text-xs text-gray-500">Adesão Média</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">145</p>
                    <p className="text-xs text-gray-500">Doses Hoje</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-xs font-bold shadow-lg">
              NOVO
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ParaClinicas;