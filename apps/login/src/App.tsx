import { Routes, Route } from "react-router-dom";
import Home from "./components/login/Login";
import { lazy, Suspense } from "react";

const DashboardApp = lazy(() => import("dashboard/DashboardApp"));

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main>
        <Suspense fallback={<div>Cargando dashboard...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard/*" element={<DashboardApp />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
