import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import Home from "./pages/Home";
import MyAssignments from "./pages/MyAssignments";
import CreateCourse from "./pages/SyllabusProcess";
import { SessionProvider } from "./contexts/SessionProvider";

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
            path="/syllabus"
            element={
              <Layout title="Crear nuevo curso">
                <CreateCourse />
              </Layout>
            }
          />
        </Routes>
      </SessionProvider>
    </Router>
  );
}
