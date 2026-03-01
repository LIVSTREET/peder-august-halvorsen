import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/LocaleContext";
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
import ContentListe from "./pages/ContentListe";
import ContentDetalj from "./pages/ContentDetalj";

// Dashboard
import { DashboardGuard } from "./components/dashboard/DashboardGuard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardLogin from "./pages/dashboard/DashboardLogin";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardProjects from "./pages/dashboard/DashboardProjects";
import DashboardProjectNew from "./pages/dashboard/DashboardProjectNew";
import DashboardProjectEdit from "./pages/dashboard/DashboardProjectEdit";
import DashboardPosts from "./pages/dashboard/DashboardPosts";
import DashboardPostEdit from "./pages/dashboard/DashboardPostEdit";
import DashboardPostNew from "./pages/dashboard/DashboardPostNew";
import DashboardArchive from "./pages/dashboard/DashboardArchive";
import DashboardLeads from "./pages/dashboard/DashboardLeads";
import DashboardLeadDetail from "./pages/dashboard/DashboardLeadDetail";
import DashboardContent from "./pages/dashboard/DashboardContent";
import DashboardContentNew from "./pages/dashboard/DashboardContentNew";
import DashboardContentEdit from "./pages/dashboard/DashboardContentEdit";

const queryClient = new QueryClient();

function LocalizedRoutes({
  path,
  element,
}: {
  path: string;
  element: React.ReactElement;
}) {
  const enPath = path === "/" ? "/en" : `/en${path}`;
  return (
    <>
      <Route path={path} element={element} />
      <Route path={enPath} element={element} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LocaleProvider>
            <Routes>
              {LocalizedRoutes({ path: "/", element: <Index /> })}
              {LocalizedRoutes({ path: "/tjenester", element: <Tjenester /> })}
              {LocalizedRoutes({ path: "/prosjekter", element: <Prosjekter /> })}
              {LocalizedRoutes({ path: "/prosjekter/:slug", element: <ProsjektDetalj /> })}
              {LocalizedRoutes({ path: "/arkiv", element: <Arkiv /> })}
              {LocalizedRoutes({ path: "/skriver", element: <Skriver /> })}
              {LocalizedRoutes({ path: "/skriver/:slug", element: <PostDetalj /> })}
              {LocalizedRoutes({ path: "/musikk", element: <Musikk /> })}
              {LocalizedRoutes({ path: "/prat", element: <Prat /> })}
              {LocalizedRoutes({ path: "/brief", element: <Brief /> })}

              {/* Content */}
              {LocalizedRoutes({
                path: "/arbeid",
                element: <ContentListe type="work" title="Arbeid" description="Utvalgte arbeider og oppdateringer." />,
              })}
              {LocalizedRoutes({ path: "/arbeid/:slug", element: <ContentDetalj type="work" /> })}
              {LocalizedRoutes({
                path: "/na-bygger-jeg",
                element: <ContentListe type="build" title="Nå bygger jeg" description="Det jeg jobber med akkurat nå." />,
              })}
              {LocalizedRoutes({ path: "/na-bygger-jeg/:slug", element: <ContentDetalj type="build" /> })}

              {/* Dashboard – ingen locale */}
              <Route path="/dashboard/login" element={<DashboardLogin />} />
              <Route path="/dashboard" element={<DashboardGuard><DashboardLayout /></DashboardGuard>}>
                <Route index element={<DashboardOverview />} />
                <Route path="projects" element={<DashboardProjects />} />
                <Route path="projects/new" element={<DashboardProjectNew />} />
                <Route path="projects/:id" element={<DashboardProjectEdit />} />
                <Route path="posts" element={<DashboardPosts />} />
                <Route path="posts/new" element={<DashboardPostNew />} />
                <Route path="posts/:id" element={<DashboardPostEdit />} />
                <Route path="archive" element={<DashboardArchive />} />
                <Route path="leads" element={<DashboardLeads />} />
                <Route path="leads/:id" element={<DashboardLeadDetail />} />
                <Route path="content" element={<DashboardContent />} />
                <Route path="content/new" element={<DashboardContentNew />} />
                <Route path="content/:id" element={<DashboardContentEdit />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </LocaleProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
