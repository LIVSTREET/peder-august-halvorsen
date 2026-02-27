import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Tjenester from "./pages/Tjenester";
import Prosjekter from "./pages/Prosjekter";
import ProsjektDetalj from "./pages/ProsjektDetalj";
import Arkiv from "./pages/Arkiv";
import Skriver from "./pages/Skriver";
import PostDetalj from "./pages/PostDetalj";
import Musikk from "./pages/Musikk";
import Prat from "./pages/Prat";
import Brief from "./pages/Brief";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tjenester" element={<Tjenester />} />
          <Route path="/prosjekter" element={<Prosjekter />} />
          <Route path="/prosjekter/:slug" element={<ProsjektDetalj />} />
          <Route path="/arkiv" element={<Arkiv />} />
          <Route path="/skriver" element={<Skriver />} />
          <Route path="/skriver/:slug" element={<PostDetalj />} />
          <Route path="/musikk" element={<Musikk />} />
          <Route path="/prat" element={<Prat />} />
          <Route path="/brief" element={<Brief />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
