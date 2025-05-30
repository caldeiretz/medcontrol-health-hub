
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const SupabaseHealthCheck = () => {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log('Checking Supabase health...');
        
        // Teste simples de conectividade
        const { error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
          console.error('Health check failed:', error);
          setStatus('error');
          setErrorMessage(error.message);
        } else {
          console.log('Health check passed');
          setStatus('ok');
        }
      } catch (error: any) {
        console.error('Health check exception:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Erro desconhecido');
      }
    };

    checkHealth();
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-yellow-600 text-sm">
        <Clock className="h-4 w-4 animate-spin" />
        Verificando conexão...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4" />
        Erro de conexão: {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 text-sm">
      <CheckCircle className="h-4 w-4" />
      Conexão OK
    </div>
  );
};

export default SupabaseHealthCheck;
