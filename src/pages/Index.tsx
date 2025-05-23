
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ComoFunciona from '@/components/ComoFunciona';
import ParaClinicas from '@/components/ParaClinicas';
import ParaPacientes from '@/components/ParaPacientes';
import Precos from '@/components/Precos';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to the appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user.role === 'clinic') {
        navigate('/clinic/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ComoFunciona />
      <ParaClinicas />
      <ParaPacientes />
      <Precos />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
