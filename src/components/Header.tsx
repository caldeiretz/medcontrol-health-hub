import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };
  const handleLogin = () => {
    navigate('/auth/profile-choice');
  };
  const handleSignUp = () => {
    navigate('/auth/profile-choice');
  };
  return <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 my-[2px]">
      <div className="container mx-auto px-4 py-4 my-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">MedControl</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('como-funciona')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Como Funciona
            </button>
            <button onClick={() => scrollToSection('para-clinicas')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Para Clínicas
            </button>
            <button onClick={() => scrollToSection('para-pacientes')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Para Pacientes
            </button>
            <button onClick={() => scrollToSection('precos')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Preços
            </button>
            <button onClick={() => scrollToSection('contato')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Contato
            </button>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="font-medium" onClick={handleLogin}>
              Entrar
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium hover:from-blue-700 hover:to-green-600" onClick={handleSignUp}>
              Criar Conta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 mt-4">
              <button onClick={() => scrollToSection('como-funciona')} className="text-left text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                Como Funciona
              </button>
              <button onClick={() => scrollToSection('para-clinicas')} className="text-left text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                Para Clínicas
              </button>
              <button onClick={() => scrollToSection('para-pacientes')} className="text-left text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                Para Pacientes
              </button>
              <button onClick={() => scrollToSection('precos')} className="text-left text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                Preços
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-left text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                Contato
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="font-medium" onClick={handleLogin}>
                  Entrar
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium" onClick={handleSignUp}>
                  Criar Conta
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;