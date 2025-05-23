import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Search, Loader2, UserCheck, X, Check } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

// Mock connected clinics data
const mockConnectedClinics = [
  {
    id: 1,
    name: "Dra. Ana Silva",
    clinicName: "Clínica Cardio Saúde",
    specialty: "Cardiologia",
    connectedSince: "15/04/2023",
  },
  {
    id: 2,
    name: "Dr. Carlos Mendes",
    clinicName: "Hospital São Lucas",
    specialty: "Endocrinologia",
    connectedSince: "03/01/2023",
  },
];

// Mock search results
const mockSearchResults = [
  {
    id: 3,
    name: "Dr. Roberto Almeida",
    clinicName: "Clínica Bem Estar",
    specialty: "Geriatria",
  },
  {
    id: 4,
    name: "Dra. Márcia Santos",
    clinicName: "Centro Médico Vida",
    specialty: "Cardiologia",
  },
];

const Sharing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [connectedClinics, setConnectedClinics] = useState(mockConnectedClinics);
  const [confirmDisconnect, setConfirmDisconnect] = useState<number | null>(null);
  const [confirmConnect, setConfirmConnect] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Digite um nome ou código para buscar");
      return;
    }

    setIsSearching(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleDisconnect = (clinicId: number) => {
    setConnectedClinics(prev => prev.filter(clinic => clinic.id !== clinicId));
    setConfirmDisconnect(null);
    toast.success("Compartilhamento revogado com sucesso");
  };

  const handleConnect = (clinic: any) => {
    // First check if already connected
    const isAlreadyConnected = connectedClinics.some(c => c.id === clinic.id);
    
    if (isAlreadyConnected) {
      toast.error("Você já compartilha dados com esta clínica");
      setConfirmConnect(null);
      return;
    }
    
    // Add to connected clinics
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    
    const newClinic = {
      ...clinic,
      connectedSince: formattedDate
    };
    
    setConnectedClinics(prev => [...prev, newClinic]);
    setConfirmConnect(null);
    toast.success("Compartilhamento concedido com sucesso");
  };

  return (
    <PatientLayout title="Compartilhamento">
      <div className="mb-8">
        <div className="max-w-3xl">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Compartilhe seus dados com seu médico</h2>
            <p className="text-gray-600 mb-6">
              Você pode compartilhar suas medicações e sinais vitais com seus médicos e clínicas.
              O compartilhamento pode ser revogado a qualquer momento.
            </p>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Buscar Médico ou Clínica</CardTitle>
                <CardDescription>
                  Digite o nome ou código do médico/clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Nome ou código..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Resultados da busca</h3>
                    
                    <div className="space-y-3">
                      {searchResults.map((result) => (
                        <div 
                          key={result.id}
                          className="border rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{result.name}</p>
                            <p className="text-sm text-gray-600">{result.clinicName}</p>
                            <p className="text-xs text-gray-500">{result.specialty}</p>
                          </div>
                          <Dialog open={confirmConnect === result.id} onOpenChange={(open) => !open && setConfirmConnect(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm"
                                onClick={() => setConfirmConnect(result.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Share2 className="h-4 w-4 mr-1" />
                                Conceder Acesso
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar compartilhamento</DialogTitle>
                                <DialogDescription>
                                  Você está concedendo acesso aos seus dados para:
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="font-medium">{result.name}</p>
                                <p className="text-sm text-gray-600">{result.clinicName}</p>
                                <p className="text-sm text-gray-600">{result.specialty}</p>
                                
                                <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                                  <p>O profissional de saúde poderá visualizar:</p>
                                  <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Suas medicações e histórico de doses</li>
                                    <li>Seus sinais vitais registrados</li>
                                    <li>Suas informações básicas de cadastro</li>
                                  </ul>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setConfirmConnect(null)}>Cancelar</Button>
                                <Button 
                                  onClick={() => handleConnect(result)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirmar Acesso
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Médicos e Clínicas Conectadas</h2>
            
            {connectedClinics.length > 0 ? (
              <div className="space-y-4">
                {connectedClinics.map((clinic) => (
                  <Card key={clinic.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <UserCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{clinic.name}</p>
                            <p className="text-sm text-gray-600">{clinic.clinicName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {clinic.specialty}
                              </span>
                              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                              <span className="text-xs text-gray-500">
                                Conectado desde {clinic.connectedSince}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Dialog open={confirmDisconnect === clinic.id} onOpenChange={(open) => !open && setConfirmDisconnect(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setConfirmDisconnect(clinic.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Revogar Acesso
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar revogação</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja revogar o acesso aos seus dados para:
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="font-medium">{clinic.name}</p>
                              <p className="text-sm text-gray-600">{clinic.clinicName}</p>
                              <p className="text-sm text-gray-600">{clinic.specialty}</p>
                              
                              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                                <p>
                                  Ao revogar o acesso, o profissional não poderá mais visualizar suas 
                                  medicações, sinais vitais e outras informações de saúde.
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setConfirmDisconnect(null)}>Cancelar</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDisconnect(clinic.id)}
                              >
                                Revogar Acesso
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-8 text-center">
                <Share2 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Você não compartilhou seus dados com nenhum médico ou clínica.</p>
                <p className="text-gray-500">Use a busca acima para encontrar e conceder acesso.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Sharing;
