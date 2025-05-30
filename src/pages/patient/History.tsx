
import { useState } from "react";
import { CalendarIcon, Clock, Check, XCircle, HeartPulse, Activity, Download } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTodayMedicationLogs } from "@/hooks/useMedications";
import { useVitals } from "@/hooks/useVitals";
import { toast } from "@/hooks/use-toast";
import { exportHistoryToPDF } from "@/utils/exportHistoryToPDF";
import { format, parseISO, isAfter, subDays, subMonths } from "date-fns";

const History = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [isExporting, setIsExporting] = useState(false);
  
  const { logs } = useTodayMedicationLogs();
  const { vitals } = useVitals();

  // Filter data based on timeframe
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeframe) {
      case "week":
        cutoffDate = subDays(now, 7);
        break;
      case "month":
        cutoffDate = subMonths(now, 1);
        break;
      case "3months":
        cutoffDate = subMonths(now, 3);
        break;
      default:
        cutoffDate = subDays(now, 7);
    }

    const filteredLogs = logs.filter(log => 
      isAfter(parseISO(log.scheduled_time), cutoffDate)
    );

    const filteredVitals = vitals.filter(vital => 
      isAfter(parseISO(vital.recorded_at), cutoffDate)
    );

    return { filteredLogs, filteredVitals };
  };

  const { filteredLogs, filteredVitals } = getFilteredData();

  // Group logs by date
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const date = format(parseISO(log.scheduled_time), 'dd/MM/yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, typeof filteredLogs>);

  // Group vitals by date
  const groupedVitals = filteredVitals.reduce((acc, vital) => {
    const date = format(parseISO(vital.recorded_at), 'dd/MM/yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(vital);
    return acc;
  }, {} as Record<string, typeof filteredVitals>);

  // Calculate adherence percentage
  const calculateAdherence = () => {
    if (filteredLogs.length === 0) return 0;
    const takenMeds = filteredLogs.filter(log => log.status === 'taken').length;
    return Math.round((takenMeds / filteredLogs.length) * 100);
  };
  
  const adherencePercentage = calculateAdherence();
  
  // Get adherence color based on percentage
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  const adherenceColor = getAdherenceColor(adherencePercentage);
  
  // Get vital icon based on type
  const getVitalIcon = (type: string) => {
    switch (type) {
      case "blood_pressure":
        return <HeartPulse className="h-4 w-4 text-red-500" />;
      case "glucose":
        return <Activity className="h-4 w-4 text-green-500" />;
      case "heart_rate":
        return <HeartPulse className="h-4 w-4 text-purple-500" />;
      case "weight":
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  // Get vital text based on type
  const getVitalText = (vital: any) => {
    switch (vital.type) {
      case "blood_pressure":
        return `Pressão Arterial: ${vital.systolic}/${vital.diastolic} mmHg`;
      case "glucose":
        return `Glicemia: ${vital.value} mg/dL`;
      case "heart_rate":
        return `Batimentos: ${vital.value} BPM`;
      case "weight":
        return `Peso: ${vital.value} kg`;
      default:
        return `${vital.type}: ${vital.value}`;
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Convert data to the format expected by exportHistoryToPDF
      const medicationHistory = Object.entries(groupedLogs).map(([date, logs]) => ({
        date,
        medications: logs.map(log => ({
          id: parseInt(log.id.slice(-8), 16),
          name: log.medication?.name || 'Medicação',
          dosage: log.medication?.dosage || '',
          time: format(parseISO(log.scheduled_time), 'HH:mm'),
          taken: log.status === 'taken',
          skipped: log.status === 'skipped'
        }))
      }));

      const vitalsHistory = Object.entries(groupedVitals).map(([date, vitals]) => ({
        date,
        vitals: vitals.map(vital => ({
          id: parseInt(vital.id.slice(-8), 16),
          type: vital.type.replace('_', '-'),
          value: vital.type === 'blood_pressure' 
            ? `${vital.systolic}/${vital.diastolic}` 
            : vital.value?.toString() || '',
          time: format(parseISO(vital.recorded_at), 'HH:mm'),
          status: 'normal' // Default status since we don't have this data
        }))
      }));
      
      await exportHistoryToPDF(
        medicationHistory,
        vitalsHistory,
        adherencePercentage,
        timeframe
      );
      
      toast({
        title: "Histórico exportado com sucesso!",
        description: "O arquivo PDF foi baixado para o seu dispositivo.",
      });
    } catch (error) {
      console.error("Erro ao exportar histórico:", error);
      toast({
        title: "Erro ao exportar histórico",
        description: "Ocorreu um erro ao gerar o arquivo PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PatientLayout title="Histórico">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Acompanhe seu histórico de medicações e sinais vitais
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Período:</span>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="3months">Últimos 3 Meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Adherence Summary Card */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo de Adesão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20">
                  <svg
                    className="h-20 w-20 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      className="text-gray-200"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="none"
                    />
                    <circle
                      className={adherenceColor}
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="none"
                      strokeDasharray={`${adherencePercentage * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold">{adherencePercentage}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Adesão à medicação</h3>
                  <p className="text-sm text-gray-600">
                    {timeframe === "week" && "Nos últimos 7 dias"}
                    {timeframe === "month" && "No último mês"}
                    {timeframe === "3months" && "Nos últimos 3 meses"}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Acima de 90% - Excelente</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Entre 70% e 90% - Boa</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Abaixo de 70% - Precisa melhorar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for medication and vitals history */}
        <Tabs defaultValue="medications">
          <TabsList className="mb-6">
            <TabsTrigger value="medications" className="px-5 py-2">
              Medicações
            </TabsTrigger>
            <TabsTrigger value="vitals" className="px-5 py-2">
              Sinais Vitais
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="medications" className="space-y-6">
            {Object.entries(groupedLogs).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Nenhuma medicação registrada no período selecionado.</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedLogs).map(([date, logs]) => (
                <Card key={date}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {logs.map((log) => (
                        <li key={log.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {log.medication?.name} {log.medication?.dosage}
                              </p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-600">
                                  {format(parseISO(log.scheduled_time), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                            <div>
                              {log.status === 'taken' ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Check className="h-5 w-5" />
                                  <span className="text-sm font-medium">Tomado</span>
                                </div>
                              ) : log.status === 'skipped' ? (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <XCircle className="h-5 w-5" />
                                  <span className="text-sm font-medium">Ignorado</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                  <XCircle className="h-5 w-5" />
                                  <span className="text-sm font-medium">Não tomado</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="vitals" className="space-y-6">
            {Object.entries(groupedVitals).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Nenhum sinal vital registrado no período selecionado.</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedVitals).map(([date, vitals]) => (
                <Card key={date}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {vitals.map((vital) => (
                        <li key={vital.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                {getVitalIcon(vital.type)}
                                <p className="font-medium">
                                  {getVitalText(vital)}
                                </p>
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-600">
                                  {format(parseISO(vital.recorded_at), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
        
        {/* Export button */}
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar Histórico"}
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default History;
