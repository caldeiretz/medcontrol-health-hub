import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Activity, LineChart, Plus, Loader2 } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

// Import Recharts components for charts
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock vitals data
const mockBloodPressureData = [{
  date: '01/05',
  systolic: 120,
  diastolic: 80
}, {
  date: '02/05',
  systolic: 118,
  diastolic: 78
}, {
  date: '03/05',
  systolic: 122,
  diastolic: 82
}, {
  date: '04/05',
  systolic: 125,
  diastolic: 85
}, {
  date: '05/05',
  systolic: 121,
  diastolic: 79
}, {
  date: '06/05',
  systolic: 119,
  diastolic: 80
}, {
  date: '07/05',
  systolic: 120,
  diastolic: 82
}];
const mockGlucoseData = [{
  date: '01/05',
  glucose: 95
}, {
  date: '02/05',
  glucose: 98
}, {
  date: '03/05',
  glucose: 102
}, {
  date: '04/05',
  glucose: 96
}, {
  date: '05/05',
  glucose: 93
}, {
  date: '06/05',
  glucose: 99
}, {
  date: '07/05',
  glucose: 97
}];
const mockHeartRateData = [{
  date: '01/05',
  heartRate: 72
}, {
  date: '02/05',
  heartRate: 74
}, {
  date: '03/05',
  heartRate: 70
}, {
  date: '04/05',
  heartRate: 76
}, {
  date: '05/05',
  heartRate: 68
}, {
  date: '06/05',
  heartRate: 72
}, {
  date: '07/05',
  heartRate: 71
}];

// Form schema for adding vitals
const formSchema = z.object({
  vitalType: z.enum(['blood-pressure', 'glucose', 'heart-rate'], {
    required_error: "Selecione um tipo de sinal vital"
  }),
  systolic: z.string().optional().refine(val => !val || Number(val) >= 60 && Number(val) <= 250, {
    message: "Valor inválido (60-250)"
  }),
  diastolic: z.string().optional().refine(val => !val || Number(val) >= 40 && Number(val) <= 150, {
    message: "Valor inválido (40-150)"
  }),
  glucose: z.string().optional().refine(val => !val || Number(val) >= 40 && Number(val) <= 500, {
    message: "Valor inválido (40-500)"
  }),
  heartRate: z.string().optional().refine(val => !val || Number(val) >= 40 && Number(val) <= 200, {
    message: "Valor inválido (40-200)"
  })
}).refine(data => {
  if (data.vitalType === 'blood-pressure') {
    return !!data.systolic && !!data.diastolic;
  }
  if (data.vitalType === 'glucose') {
    return !!data.glucose;
  }
  if (data.vitalType === 'heart-rate') {
    return !!data.heartRate;
  }
  return false;
}, {
  message: "Preencha os valores necessários",
  path: ['vitalType']
});
const Vitals = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('blood-pressure');
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vitalType: 'blood-pressure',
      systolic: '',
      diastolic: '',
      glucose: '',
      heartRate: ''
    }
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // In a real app, you would send this data to your API
      console.log("Vital signs data:", data);

      // Mock success and close the form
      setTimeout(() => {
        toast.success("Sinal vital registrado com sucesso!");
        setShowForm(false);
        form.reset();
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      toast.error("Erro ao registrar sinal vital. Tente novamente.");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  // Watch the vital type to show the appropriate fields
  const watchVitalType = form.watch('vitalType');
  return <PatientLayout title="Sinais Vitais">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 font-normal">
            Acompanhe e registre seus sinais vitais para melhor controle da sua saúde
          </p>
          <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-1 h-4 w-4" />
            {showForm ? "Cancelar" : "Registrar Sinal Vital"}
          </Button>
        </div>
        
        {/* Form for adding vitals */}
        {showForm && <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Registrar Novo Sinal Vital</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="vitalType" render={({
                field
              }) => <FormItem>
                        <FormLabel className="text-base">Tipo de Sinal Vital</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="blood-pressure">Pressão Arterial</SelectItem>
                            <SelectItem value="glucose">Glicemia</SelectItem>
                            <SelectItem value="heart-rate">Batimentos Cardíacos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                  
                  {watchVitalType === 'blood-pressure' && <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="systolic" render={({
                  field
                }) => <FormItem>
                            <FormLabel className="text-base">Sistólica (máxima)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 120" className="text-base" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      <FormField control={form.control} name="diastolic" render={({
                  field
                }) => <FormItem>
                            <FormLabel className="text-base">Diastólica (mínima)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 80" className="text-base" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>}
                  
                  {watchVitalType === 'glucose' && <FormField control={form.control} name="glucose" render={({
                field
              }) => <FormItem>
                          <FormLabel className="text-base">Valor da Glicemia (mg/dL)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 95" className="text-base" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />}
                  
                  {watchVitalType === 'heart-rate' && <FormField control={form.control} name="heartRate" render={({
                field
              }) => <FormItem>
                          <FormLabel className="text-base">Batimentos por Minuto (BPM)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 72" className="text-base" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />}
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </> : 'Salvar Registro'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>}
        
        {/* Tabs for different vitals */}
        <div className="flex border-b mb-6">
          <button className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'blood-pressure' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setActiveTab('blood-pressure')}>
            <Heart className="mr-2 h-4 w-4" />
            Pressão Arterial
          </button>
          <button className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'glucose' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setActiveTab('glucose')}>
            <Activity className="mr-2 h-4 w-4" />
            Glicemia
          </button>
          <button className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'heart-rate' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setActiveTab('heart-rate')}>
            <LineChart className="mr-2 h-4 w-4" />
            Batimentos Cardíacos
          </button>
        </div>
        
        {/* Charts based on active tab */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {activeTab === 'blood-pressure' && 'Histórico de Pressão Arterial'}
              {activeTab === 'glucose' && 'Histórico de Glicemia'}
              {activeTab === 'heart-rate' && 'Histórico de Batimentos Cardíacos'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {activeTab === 'blood-pressure' && <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={mockBloodPressureData} margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 20
              }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[40, 160]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Sistólica" strokeWidth={2} />
                    <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastólica" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>}
              
              {activeTab === 'glucose' && <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={mockGlucoseData} margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 20
              }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[40, 150]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="glucose" stroke="#10b981" name="Glicemia (mg/dL)" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>}
              
              {activeTab === 'heart-rate' && <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={mockHeartRateData} margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 20
              }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[40, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="heartRate" stroke="#8b5cf6" name="BPM" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent entries table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Registros Recentes</CardTitle>
          </CardHeader>
          <div className="overflow-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 border-t border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'blood-pressure' && 'Pressão (mmHg)'}
                    {activeTab === 'glucose' && 'Glicemia (mg/dL)'}
                    {activeTab === 'heart-rate' && 'BPM'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'blood-pressure' && mockBloodPressureData.map((item, index) => <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.systolic}/{item.diastolic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.systolic >= 140 || item.diastolic >= 90 ? <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Elevada
                        </span> : item.systolic <= 100 || item.diastolic <= 60 ? <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Baixa
                        </span> : <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Normal
                        </span>}
                    </td>
                  </tr>)}
                
                {activeTab === 'glucose' && mockGlucoseData.map((item, index) => <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.glucose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.glucose >= 126 ? <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Elevada
                        </span> : item.glucose <= 70 ? <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Baixa
                        </span> : <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Normal
                        </span>}
                    </td>
                  </tr>)}
                
                {activeTab === 'heart-rate' && mockHeartRateData.map((item, index) => <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.heartRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.heartRate >= 100 ? <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Elevada
                        </span> : item.heartRate <= 60 ? <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Baixa
                        </span> : <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Normal
                        </span>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PatientLayout>;
};
export default Vitals;