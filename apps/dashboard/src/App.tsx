import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import MyAssignmentsPage from "./features/assignments/pages/my-assignments";
import ManagementPage from "./features/assignments/pages/management";
import SyllabusProcessPage from "./features/syllabus/pages/syllabus-process";
import { SessionProvider } from "./features/auth/contexts/session-provider";
import MainLayout from "./common/layouts/main-layout";
import { HomePage } from "./features/home";
import { ProfilePage } from "./features/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Coordinator pages
import PermissionsList from "./features/coordinator/pages/permissions-list";
import PermissionsManage from "./features/coordinator/pages/permissions-manage";
import SendEmail from "./features/coordinator/pages/send-email";
import ReviewSyllabusList from "./features/coordinator/pages/review-syllabus-list";
import ReviewSyllabusDetail from "./features/coordinator/pages/review-syllabus-detail";
import ReviewSummary from "./features/coordinator/pages/review-summary";
import SyllabusCatalog from "./features/coordinator/pages/syllabus-catalog";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Router>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout title="Inicio">
                  <HomePage />
                </MainLayout>
              }
            />
            <Route
              path="/mis-asignaciones"
              element={
                <MainLayout title="Mis sílabos">
                  <MyAssignmentsPage />
                </MainLayout>
              }
            />
            <Route
              path="/syllabus"
              element={
                <MainLayout title="Crear nuevo curso">
                  <SyllabusProcessPage />
                </MainLayout>
              }
            />
            <Route
              path="/perfil"
              element={
                <MainLayout title="Perfil">
                  <ProfilePage />
                </MainLayout>
              }
            />
            <Route
              path="/management"
              element={
                <MainLayout title="Asignar Docente">
                  <ManagementPage />
                </MainLayout>
              }
            />
            {/* Coordinator Routes */}
            <Route
              path="/coordinator/permissions"
              element={
                <MainLayout title="Activar Permisos">
                  <PermissionsList />
                </MainLayout>
              }
            />
            <Route
              path="/coordinator/permissions/:id"
              element={
                <MainLayout title="Gestionar Permisos">
                  <PermissionsManage />
                </MainLayout>
              }
            />
            <Route
              path="/coordinator/send-email"
              element={
                <MainLayout title="Enviar Correo">
                  <SendEmail />
                </MainLayout>
              }
            />
            <Route
              path="/coordinator/review-syllabus"
              element={
                <MainLayout title="Revisión de Sílabos">
                  <ReviewSyllabusList />
                </MainLayout>
              }
            />
            <Route
              path="/coordinator/review-syllabus/:id"
              element={
                <MainLayout title="Revisar Sílabo">
                  <ReviewSyllabusDetail />
                </MainLayout>
              }
            />
            <Route
              path="/coordinator/review-syllabus/:id/summary"
              element={
                <MainLayout title="Resumen de Revisión">
                  <ReviewSummary />
                </MainLayout>
              }
            />
            <Route
              path="/coordinator/syllabus-catalog"
              element={
                <MainLayout title="Catálogo de Sumilla">
                  <SyllabusCatalog />
                </MainLayout>
              }
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QueryClientProvider>
      </SessionProvider>
    </Router>
  );
}
