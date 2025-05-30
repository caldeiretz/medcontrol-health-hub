
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTodayMedicationLogs } from "@/hooks/useMedications";

const ProgressCard = () => {
  const { logs } = useTodayMedicationLogs();

  // Calculate real adherence from medication logs
  const calculateAdherence = () => {
    if (logs.length === 0) return { percentage: 0, taken: 0, total: 0 };

    const taken = logs.filter(log => log.status === 'taken').length;
    const total = logs.length;
    const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

    return { percentage, taken, total };
  };

  const adherence = calculateAdherence();

  // Calculate trend (simplified - comparing with a baseline)
  const getTrend = () => {
    if (adherence.percentage >= 80) return 'up';
    if (adherence.percentage >= 60) return 'stable';
    return 'down';
  };

  const trend = getTrend();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up':
        return 'Boa adesão!';
      case 'down':
        return 'Baixa adesão';
      default:
        return 'Adesão moderada';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Seu Progresso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Adesão às Medicações Hoje</span>
              <span className="text-2xl font-bold text-gray-900">{adherence.percentage}%</span>
            </div>
            <Progress 
              value={adherence.percentage} 
              className="w-full h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {adherence.taken} de {adherence.total} doses tomadas
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {getTrendText()}
              </span>
            </div>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Nenhuma medicação agendada para hoje</p>
              <p className="text-gray-400 text-xs mt-1">
                Adicione medicações para acompanhar seu progresso
              </p>
            </div>
          )}

          {adherence.percentage < 80 && logs.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm font-medium">
                💡 Dica: Tente tomar suas medicações nos horários corretos para melhorar sua adesão.
              </p>
            </div>
          )}

          {adherence.percentage >= 80 && logs.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm font-medium">
                🎉 Parabéns! Você está mantendo uma ótima adesão ao tratamento.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
