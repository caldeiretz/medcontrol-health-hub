
import { Users, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPatients, mockAlerts } from "./mockData";

const StatsCards = () => {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Total de Pacientes</CardTitle>
          <CardDescription className="text-sm">Pacientes compartilhando dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-full bg-blue-100 p-2 md:p-3">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <span className="text-2xl md:text-3xl font-semibold">{mockPatients.length}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Adesão Média</CardTitle>
          <CardDescription className="text-sm">Medicamentos tomados corretamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-full bg-green-100 p-2 md:p-3">
              <Check className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
            <span className="text-2xl md:text-3xl font-semibold">83%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Alertas</CardTitle>
          <CardDescription className="text-sm">Necessitam de atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-full bg-red-100 p-2 md:p-3">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
            </div>
            <span className="text-2xl md:text-3xl font-semibold">{mockAlerts.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
