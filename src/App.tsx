
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useCapacitor } from "@/hooks/useCapacitor";
import AppRoutes from "./routes";

const queryClient = new QueryClient();

const App = () => {
  const { isNative, platform } = useCapacitor();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className={`app ${isNative ? `platform-${platform}` : 'platform-web'}`}>
            <AppRoutes />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
