
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ComoFunciona from '@/components/ComoFunciona';
import ParaClinicas from '@/components/ParaClinicas';
import ParaPacientes from '@/components/ParaPacientes';
import Precos from '@/components/Precos';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
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
