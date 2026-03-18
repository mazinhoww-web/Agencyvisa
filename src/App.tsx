import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import ClientLayout from "@/components/layouts/ClientLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";

// Client pages
import ClientDashboard from "./pages/client/Dashboard";
import Formulario from "./pages/client/Formulario";
import TaxaConsular from "./pages/client/TaxaConsular";
import Agendamento from "./pages/client/Agendamento";
import Documentos from "./pages/client/Documentos";
import Mensagens from "./pages/client/Mensagens";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Processos from "./pages/admin/Processos";
import ProcessoDetalhe from "./pages/admin/ProcessoDetalhe";
import Datas from "./pages/admin/Datas";
import Configuracoes from "./pages/admin/Configuracoes";
import Cupons from "./pages/admin/Cupons";
import WhatsAppAdmin from "./pages/admin/WhatsAppAdmin";
import Leads from "./pages/admin/Leads";
import EmailAdmin from "./pages/admin/EmailAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Client routes */}
            <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/taxa-consular" element={<TaxaConsular />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/documentos" element={<Documentos />} />
              <Route path="/mensagens" element={<Mensagens />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/processos" element={<Processos />} />
              <Route path="/admin/processos/:id" element={<ProcessoDetalhe />} />
              <Route path="/admin/datas" element={<Datas />} />
              <Route path="/admin/configuracoes" element={<Configuracoes />} />
              <Route path="/admin/cupons" element={<Cupons />} />
              <Route path="/admin/whatsapp" element={<WhatsAppAdmin />} />
              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/email" element={<EmailAdmin />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
