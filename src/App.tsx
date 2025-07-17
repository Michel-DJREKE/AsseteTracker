
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import { Materiel } from "./pages/Materiel";
import { Utilisateurs } from "./pages/Utilisateurs";
import { Attributions } from "./pages/Attributions";
import { Maintenance } from "./pages/Maintenance";
import { Historique } from "./pages/Historique";
import { Recherche } from "./pages/Recherche";
import { Notifications } from "./pages/Notifications";
import { Parametres } from "./pages/Parametres";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/materiel" element={<Materiel />} />
              <Route path="/utilisateurs" element={<Utilisateurs />} />
              <Route path="/attributions" element={<Attributions />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/recherche" element={<Recherche />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
