
import { useState } from "react";
import { Search, Filter, Eye, Plus } from "lucide-react";
import ClinicLayout from "@/components/layouts/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPatients } from "./components/mockData";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAdesao, setFilterAdesao] = useState("all");
  const navigate = useNavigate();

  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusBadge = (alerts: number) => {
    if (alerts === 0) return <Badge className="bg-green-100 text-green-800">Estável</Badge>;
    if (alerts === 1) return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
    return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
  };

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "stable" && patient.alerts === 0) ||
                         (filterStatus === "attention" && patient.alerts === 1) ||
                         (filterStatus === "critical" && patient.alerts > 1);
    
    const matchesAdesao = filterAdesao === "all" ||
                         (filterAdesao === "high" && patient.adherence >= 90) ||
                         (filterAdesao === "medium" && patient.adherence >= 70 && patient.adherence < 90) ||
                         (filterAdesao === "low" && patient.adherence < 70);
    
    return matchesSearch && matchesStatus && matchesAdesao;
  });

  return (
    <ClinicLayout title="Gerenciar Pacientes">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPatients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Estáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockPatients.filter(p => p.alerts === 0).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Necessitam Atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockPatients.filter(p => p.alerts === 1).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockPatients.filter(p => p.alerts > 1).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Lista de Pacientes</CardTitle>
              <Button className="md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Paciente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome ou condição..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="stable">Estável</SelectItem>
                    <SelectItem value="attention">Atenção</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAdesao} onValueChange={setFilterAdesao}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Adesão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toda Adesão</SelectItem>
                    <SelectItem value="high">Alta (≥90%)</SelectItem>
                    <SelectItem value="medium">Média (70-89%)</SelectItem>
                    <SelectItem value="low">Baixa (<70%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Adesão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <span className="font-medium text-gray-600">{patient.avatar}</span>
                        </div>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell className="max-w-xs truncate">{patient.condition}</TableCell>
                    <TableCell>
                      <Badge className={getAdherenceColor(patient.adherence)}>
                        {patient.adherence}%
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(patient.alerts)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{patient.lastUpdate}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/clinic/patient/${patient.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClinicLayout>
  );
};

export default Patients;
