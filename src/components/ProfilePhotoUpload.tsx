
import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  fallbackText: string;
  size?: "sm" | "md" | "lg";
  onPhotoChange: (photoUrl: string | null) => void;
}

const ProfilePhotoUpload = ({ 
  currentPhoto, 
  fallbackText, 
  size = "md",
  onPhotoChange 
}: ProfilePhotoUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem (JPG, PNG, GIF).",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPhotoChange(preview);
      setIsOpen(false);
      setPreview(null);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível atualizar a foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    setIsOpen(false);
    setPreview(null);
    
    toast({
      title: "Foto removida",
      description: "Sua foto de perfil foi removida.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            <Avatar className={`${sizeClasses[size]} transition-all duration-200 group-hover:ring-4 group-hover:ring-blue-100`}>
              <AvatarImage src={currentPhoto} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold">
                {fallbackText}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
              <Camera className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Foto de Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={preview || currentPhoto} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-2xl font-semibold">
                  {fallbackText}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-3">
              <Button 
                onClick={triggerFileInput} 
                variant="outline" 
                className="w-full"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Nova Foto
              </Button>
              
              {preview && (
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? "Salvando..." : "Salvar Foto"}
                </Button>
              )}
              
              {currentPhoto && (
                <Button 
                  onClick={handleRemovePhoto} 
                  variant="destructive" 
                  className="w-full"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover Foto
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePhotoUpload;
