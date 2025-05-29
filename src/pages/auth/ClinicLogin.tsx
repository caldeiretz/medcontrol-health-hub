
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { validatePassword, isRateLimited, clearRateLimit } from '@/utils/security';

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const ClinicLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Rate limiting check
      const identifier = `login_${values.email}`;
      if (isRateLimited(identifier, 5, 300000)) { // 5 attempts per 5 minutes
        toast.error('Muitas tentativas de login. Tente novamente em alguns minutos.');
        return;
      }

      // Enhanced password validation
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.isValid) {
        toast.error('Senha não atende aos requisitos de segurança');
        return;
      }

      const success = await login(values.email, values.password, 'clinic');
      
      if (success) {
        // Clear rate limiting on successful login
        clearRateLimit(identifier);
        toast.success('Login realizado com sucesso');
        navigate('/clinic/dashboard');
      } else {
        toast.error('Falha no login. Verifique seus dados.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao fazer login.');
      console.error('Login error:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Entrar como Médico/Clínica</h1>
          <p className="mt-2 text-gray-600">Acesse sua conta para monitorar seus pacientes</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        type="email" 
                        {...field} 
                        className="text-base"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Sua senha" 
                        type="password" 
                        {...field}
                        className="text-base"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-base bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/auth/clinic-register" className="text-green-600 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/auth/profile-choice" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar para escolha de perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicLogin;
