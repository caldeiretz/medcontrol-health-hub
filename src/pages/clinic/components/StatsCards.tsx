import { Users, AlertTriangle, Pill, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalPatients: number;
  activeAlerts: number;
  totalMedications: number;
  recentActivity: number;
}

const StatsCards = ({ totalPatients, activeAlerts, totalMedications, recentActivity }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total de Pacientes",
      value: totalPatients,
      icon: Users,
      description: "Compartilhando dados",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Alertas Ativos",
      value: activeAlerts,
      icon: AlertTriangle,
      description: "Requerem atenção",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Medicações Monitoradas",
      value: totalMedications,
      icon: Pill,
      description: "Em uso pelos pacientes",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Atividade Recente",
      value: recentActivity,
      icon: Activity,
      description: "Últimas 24 horas",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 truncate">
                {stat.title}
              </CardTitle>
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
