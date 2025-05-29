import { ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquareWarning, Settings, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
interface ClinicLayoutProps {
  children: ReactNode;
  title: string;
}
const ClinicLayout = ({
  children,
  title
}: ClinicLayoutProps) => {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const navigationItems = [{
    name: "Dashboard",
    path: "/clinic/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  }, {
    name: "Pacientes",
    path: "/clinic/patients",
    icon: <Users className="h-5 w-5" />
  }, {
    name: "Alertas",
    path: "/clinic/alerts",
    icon: <MessageSquareWarning className="h-5 w-5" />
  }, {
    name: "Configurações",
    path: "/clinic/settings",
    icon: <Settings className="h-5 w-5" />
  }];
  return <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col bg-white shadow-md lg:flex">
        <div className="flex h-16 items-center justify-center border-b px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">MedControl</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pt-6">
          <ul className="space-y-2">
            {navigationItems.map(item => <li key={item.path}>
                <Link to={item.path} className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>)}
          </ul>
        </nav>
        
        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="rounded-full bg-gray-200 p-1">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 text-red-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="border-b bg-white p-4 lg:hidden flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800">MedControl</span>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-gray-800">MedControl</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 px-4 pt-6">
              <ul className="space-y-2">
                {navigationItems.map(item => <li key={item.path}>
                    <Link to={item.path} className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>)}
              </ul>
            </nav>
            
            <div className="border-t p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-gray-200 p-1">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2 text-red-600" onClick={handleLogout}>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">{title}</h1>
          {children}
        </div>
      </main>
    </div>;
};
export default ClinicLayout;