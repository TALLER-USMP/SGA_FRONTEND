import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import MyAssignmentsPage from "./features/assignments/pages/my-assignments";
import ManagementPage from "./features/assignments/pages/management";
import SyllabusProcessPage from "./features/syllabus/pages/syllabus-process";
import { SessionProvider } from "./features/auth/contexts/session-provider";
import MainLayout from "./common/layouts/main-layout";
import { HomePage } from "./features/home";
import { ProfilePage } from "./features/auth";

export default function App() {
  return (
    <Router>
      <SessionProvider>
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
            path="/MyAssignmentsTeacher"
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
        </Routes>
      </SessionProvider>
    </Router>
  );
}
