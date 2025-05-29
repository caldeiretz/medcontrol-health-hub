
import { useState } from "react";
import { Clock, Activity, AlertCircle, Check, Filter, Eye } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAlerts } from "./components/mockData";
import { useNavigate } from "react-router-dom";

const Alerts = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);
  const navigate = useNavigate();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "missed-medication":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "high-blood-pressure":
        return <Activity className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "missed-medication":
        return "Medicação Perdida";
      case "high-blood-pressure":
        return "Pressão Alta";
      default:
        return "Alerta Geral";
    }
  };

  const getPriorityBadge = (type: string) => {
    switch (type) {
      case "high-blood-pressure":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case "missed-medication":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Baixa</Badge>;
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setResolvedAlerts(prev => [...prev, alertId]);
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesType = filterType === "all" || alert.type === filterType;
    const isResolved = resolvedAlerts.includes(alert.id);
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "pending" && !isResolved) ||
                         (filterStatus === "resolved" && isResolved);
    
    return matchesType && matchesStatus;
  });

  const pendingAlerts = mockAlerts.filter(alert => !resolvedAlerts.includes(alert.id));
  const resolvedCount = resolvedAlerts.length;

  return (
    <ClinicLayout title="Central de Alertas">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAlerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{pendingAlerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockAlerts.filter(a => a.type === "high-blood-pressure").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de Alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="missed-medication">Medicação Perdida</SelectItem>
                    <SelectItem value="high-blood-pressure">Pressão Alta</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="resolved">Resolvidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Alertas */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => {
                  const isResolved = resolvedAlerts.includes(alert.id);
                  return (
                    <TableRow key={alert.id} className={isResolved ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.type)}
                          <span className="text-sm">{getAlertTypeLabel(alert.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alert.patientName}</TableCell>
                      <TableCell className="max-w-xs">{alert.description}</TableCell>
                      <TableCell>{getPriorityBadge(alert.type)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{alert.time}</TableCell>
                      <TableCell>
                        {isResolved ? (
                          <Badge className="bg-green-100 text-green-800">Resolvido</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Pendente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/clinic/patient/${alert.patientId}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!isResolved && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClinicLayout>
  );
};

export default Alerts;
