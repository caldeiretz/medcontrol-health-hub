
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vital } from '@/services/vitalsService';

interface VitalChartProps {
  vitals: Vital[];
}

const VitalChart = ({ vitals }: VitalChartProps) => {
  // Group vitals by type
  const vitalsByType = vitals.reduce((acc, vital) => {
    if (!acc[vital.type]) {
      acc[vital.type] = [];
    }
    acc[vital.type].push(vital);
    return acc;
  }, {} as Record<string, Vital[]>);

  const formatChartData = (vitalsOfType: Vital[], type: string) => {
    return vitalsOfType
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
      .map(vital => ({
        date: new Date(vital.recorded_at).toLocaleDateString('pt-BR'),
        time: new Date(vital.recorded_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        ...(type === 'blood_pressure' ? {
          sistolica: vital.systolic,
          diastolica: vital.diastolic
        } : {
          valor: vital.value
        }),
        notes: vital.notes
      }));
  };

  const getVitalName = (type: string) => {
    switch (type) {
      case 'blood_pressure':
        return 'Pressão Arterial';
      case 'heart_rate':
        return 'Frequência Cardíaca';
      case 'glucose':
        return 'Glicose';
      case 'weight':
        return 'Peso';
      default:
        return type;
    }
  };

  const getUnit = (type: string) => {
    switch (type) {
      case 'blood_pressure':
        return 'mmHg';
      case 'heart_rate':
        return 'bpm';
      case 'glucose':
        return 'mg/dL';
      case 'weight':
        return 'kg';
      default:
        return '';
    }
  };

  if (vitals.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Nenhum dado disponível para gráficos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(vitalsByType).map(([type, typeVitals]) => {
        if (typeVitals.length < 2) return null; // Need at least 2 points for a chart

        const chartData = formatChartData(typeVitals, type);
        
        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg">
                {getVitalName(type)} {getUnit(type) && `(${getUnit(type)})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => `Data: ${value}`}
                    formatter={(value, name) => [value, name]}
                  />
                  <Legend />
                  
                  {type === 'blood_pressure' ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="sistolica"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Sistólica"
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolica"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Diastólica"
                      />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name={getVitalName(type)}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VitalChart;
