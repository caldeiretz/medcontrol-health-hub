import { ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Pill, Activity, History, Share2, User, LogOut, Menu, X, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

interface PatientLayoutProps {
  children: ReactNode;
  title: string;
}

const PatientLayout = ({ children, title }: PatientLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/patient/profile');
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfilePhoto(photoUrl);
  };

  const navigationItems = [
    {
      name: "Início",
      path: "/patient/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Medicações",
      path: "/patient/medications",
      icon: <Pill className="h-5 w-5" />
    },
    {
      name: "Sinais Vitais",
      path: "/patient/vitals",
      icon: <Activity className="h-5 w-5" />
    },
    {
      name: "Histórico",
      path: "/patient/history",
      icon: <History className="h-5 w-5" />
    },
    {
      name: "Compartilhar",
      path: "/patient/sharing",
      icon: <Share2 className="h-5 w-5" />
    },
    {
      name: "Configurações",
      path: "/patient/account",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-100 lg:flex">
        <div className="flex h-16 items-center justify-center border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MedControl</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pt-6">
          <ul className="space-y-2">
            {navigationItems.map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="flex items-center rounded-xl px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-600 transition-all duration-200 hover:shadow-sm group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white/70 rounded-xl p-3 transition-all duration-200 hover:shadow-sm" 
            onClick={handleProfileClick}
          >
            <div className="flex items-center space-x-3">
              <ProfilePhotoUpload
                currentPhoto={profilePhoto}
                fallbackText={user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                size="sm"
                onPhotoChange={handlePhotoChange}
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="border-b border-gray-100 bg-white/95 backdrop-blur-sm p-4 lg:hidden flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MedControl</span>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-blue-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MedControl</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 px-4 pt-6">
              <ul className="space-y-2">
                {navigationItems.map(item => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className="flex items-center rounded-xl px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-600 transition-all duration-200" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3 font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50">
              <div 
                className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white/70 rounded-xl p-3 transition-all duration-200" 
                onClick={() => {
                  handleProfileClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <ProfilePhotoUpload
                    currentPhoto={profilePhoto}
                    fallbackText={user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    size="sm"
                    onPhotoChange={handlePhotoChange}
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pb-16">
        <div className="px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 text-center">{title}</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto"></div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;
