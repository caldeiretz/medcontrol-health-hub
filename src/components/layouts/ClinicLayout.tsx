
import { ReactNode, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquareWarning, Settings, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

interface ClinicLayoutProps {
  children: ReactNode;
  title: string;
}

const ClinicLayout = ({ children, title }: ClinicLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfilePhoto(photoUrl);
  };

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/clinic/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Pacientes",
      path: "/clinic/patients",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Alertas",
      path: "/clinic/alerts",
      icon: <MessageSquareWarning className="h-5 w-5" />
    },
    {
      name: "Conta & Configurações",
      path: "/clinic/account",
      icon: <User className="h-5 w-5" />
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const UserProfile = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => (
    <div className="flex items-center space-x-3">
      <ProfilePhotoUpload
        currentPhoto={profilePhoto}
        fallbackText={user?.name?.split(' ').map(n => n[0]).join('') || 'JS'}
        size={size}
        onPhotoChange={handlePhotoChange}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-100 lg:flex">
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">MedControl</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pt-6">
          <ul className="space-y-2">
            {navigationItems.map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActivePath(item.path) 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-600 hover:shadow-sm'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="mb-4">
            <UserProfile />
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-200" 
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
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">MedControl</span>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-blue-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">MedControl</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-red-50">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 px-4 pt-6">
              <ul className="space-y-2">
                {navigationItems.map(item => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                        isActivePath(item.path) 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3 font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="mb-4">
                <UserProfile />
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-200" 
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
      <main className="lg:pl-64">
        <div className="px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2"></div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default ClinicLayout;
