
import { useState } from "react";
import { Share2, Search, Loader2, UserCheck, X, Check } from "lucide-react";
import PatientLayout from "@/components/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useProfile } from "@/hooks/useProfile";
import { useSharing } from "@/hooks/useSharing";

const Sharing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);
  const [confirmConnect, setConfirmConnect] = useState<string | null>(null);
  
  const { searchDoctors, searchResults, isSearching } = useProfile();
  const { relationships, createSharing, revokeSharing, isCreating, isRevoking } = useSharing();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
    searchDoctors(searchQuery.trim());
  };

  const handleConnect = (doctorId: string) => {
    createSharing(doctorId);
    setConfirmConnect(null);
  };

  const handleDisconnect = (sharingId: string) => {
    revokeSharing(sharingId);
    setConfirmDisconnect(null);
  };

  const selectedDoctor = searchResults.find(doctor => doctor.id === confirmConnect);
  const selectedRelationship = relationships.find(rel => rel.id === confirmDisconnect);

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
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSearching || !searchQuery.trim()}
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
                      {searchResults.map((doctor) => {
                        const isAlreadyConnected = relationships.some(rel => rel.doctor_id === doctor.id);
                        
                        return (
                          <div 
                            key={doctor.id}
                            className="border rounded-lg p-4 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-sm text-gray-600">{doctor.clinic_name}</p>
                              <p className="text-xs text-gray-500">{doctor.specialty}</p>
                              {doctor.doctor_code && (
                                <p className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                                  Código: {doctor.doctor_code}
                                </p>
                              )}
                            </div>
                            
                            {isAlreadyConnected ? (
                              <div className="text-green-600 text-sm font-medium">
                                ✓ Já conectado
                              </div>
                            ) : (
                              <Dialog open={confirmConnect === doctor.id} onOpenChange={(open) => !open && setConfirmConnect(null)}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm"
                                    onClick={() => setConfirmConnect(doctor.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={isCreating}
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
                                  {selectedDoctor && (
                                    <div className="py-4">
                                      <p className="font-medium">{selectedDoctor.name}</p>
                                      <p className="text-sm text-gray-600">{selectedDoctor.clinic_name}</p>
                                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                                      {selectedDoctor.doctor_code && (
                                        <p className="text-sm text-blue-600 font-mono">Código: {selectedDoctor.doctor_code}</p>
                                      )}
                                      
                                      <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                                        <p>O profissional de saúde poderá visualizar:</p>
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                          <li>Suas medicações e histórico de doses</li>
                                          <li>Seus sinais vitais registrados</li>
                                          <li>Suas informações básicas de cadastro</li>
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setConfirmConnect(null)}>Cancelar</Button>
                                    <Button 
                                      onClick={() => handleConnect(doctor.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={isCreating}
                                    >
                                      {isCreating ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                      )}
                                      Confirmar Acesso
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Médicos e Clínicas Conectadas</h2>
            
            {relationships.length > 0 ? (
              <div className="space-y-4">
                {relationships.map((relationship) => (
                  <Card key={relationship.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <UserCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{relationship.doctor?.name}</p>
                            <p className="text-sm text-gray-600">{relationship.doctor?.clinic_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {relationship.doctor?.specialty}
                              </span>
                              {relationship.doctor?.doctor_code && (
                                <>
                                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                                  <span className="text-xs text-blue-600 font-mono">
                                    {relationship.doctor.doctor_code}
                                  </span>
                                </>
                              )}
                              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                              <span className="text-xs text-gray-500">
                                Conectado em {new Date(relationship.shared_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Dialog open={confirmDisconnect === relationship.id} onOpenChange={(open) => !open && setConfirmDisconnect(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full lg:w-auto"
                              onClick={() => setConfirmDisconnect(relationship.id)}
                              disabled={isRevoking}
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
                            {selectedRelationship && (
                              <div className="py-4">
                                <p className="font-medium">{selectedRelationship.doctor?.name}</p>
                                <p className="text-sm text-gray-600">{selectedRelationship.doctor?.clinic_name}</p>
                                <p className="text-sm text-gray-600">{selectedRelationship.doctor?.specialty}</p>
                                
                                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                                  <p>
                                    Ao revogar o acesso, o profissional não poderá mais visualizar suas 
                                    medicações, sinais vitais e outras informações de saúde.
                                  </p>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setConfirmDisconnect(null)}>Cancelar</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDisconnect(relationship.id)}
                                disabled={isRevoking}
                              >
                                {isRevoking ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  'Revogar Acesso'
                                )}
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
