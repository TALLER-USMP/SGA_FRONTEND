import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import Home from "./pages/Home";
import MyAssignments from "./pages/MyAssignments";
import CreateCourse from "./pages/SyllabusProcess";
import Profile from "./pages/Profile";
import CoordinatorAssignmentsList from "./pages/coordinator/AssignmentsList";
import CoordinatorSyllabusManagement from "./pages/coordinator/SyllabusManagement";
import CoordinatorSendToTeacher from "./pages/coordinator/SendToTeacher";
import { SessionProvider } from "./contexts/SessionProvider";
import { CoordinatorProvider } from "./contexts/CoordinatorContext";

export default function App() {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout title="Inicio">
                <Home />
              </Layout>
            }
          />
          <Route
            path="/mis-asignaciones"
            element={
              <Layout title="Mis sílabos">
                <MyAssignments />
              </Layout>
            }
          />
          <Route
            path="/MyAssignmentsTeacher"
            element={
              <Layout title="Mis sílabos">
                <MyAssignments />
              </Layout>
            }
          />

          <Route
            path="/syllabus"
            element={
              <Layout title="Crear nuevo curso">
                <CreateCourse />
              </Layout>
            }
          />

          {/* Rutas de Coordinadora - Envueltas con CoordinatorProvider */}
          <Route
            path="/coordinator/assignments"
            element={
              <CoordinatorProvider>
                <Layout title="Asignaturas">
                  <CoordinatorAssignmentsList />
                </Layout>
              </CoordinatorProvider>
            }
          />
          <Route
            path="/coordinator/syllabus-management"
            element={
              <CoordinatorProvider>
                <Layout title="Gestión de Secciones del Sílabo">
                  <CoordinatorSyllabusManagement />
                </Layout>
              </CoordinatorProvider>
            }
          />
          <Route
            path="/coordinator/send-to-teacher"
            element={
              <CoordinatorProvider>
                <Layout title="Enviar al Docente">
                  <CoordinatorSendToTeacher />
                </Layout>
              </CoordinatorProvider>
            }
          />

          <Route
            path="/perfil"
            element={
              <Layout title="Perfil">
                <Profile />
              </Layout>
            }
          />
        </Routes>
      </SessionProvider>
    </Router>
  );
}
