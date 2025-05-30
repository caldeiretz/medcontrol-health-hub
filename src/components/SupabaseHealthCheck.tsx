
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';

const SupabaseHealthCheck = () => {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log('Checking Supabase health...');
        
        // Teste mais específico - verificar se conseguimos acessar a tabela profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Health check failed:', error);
          setStatus('error');
          setErrorMessage(error.message);
          setDetails(`Código: ${error.code || 'N/A'}`);
        } else {
          console.log('Health check passed');
          setStatus('ok');
          setDetails('Conexão com profiles OK');
        }
      } catch (error: any) {
        console.error('Health check exception:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Erro desconhecido');
        setDetails('Falha na conexão');
      }
    };

    checkHealth();
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex flex-col items-center gap-2 text-yellow-600 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 animate-spin" />
          Verificando conexão...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-1 text-red-600 text-sm max-w-md">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Erro de conexão
        </div>
        <div className="text-xs text-center">
          {errorMessage}
        </div>
        {details && (
          <div className="text-xs text-gray-500">
            {details}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 text-green-600 text-sm">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        Conexão OK
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Info className="h-3 w-3" />
        {details}
      </div>
    </div>
  );
};

export default SupabaseHealthCheck;
