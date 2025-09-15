import { lazy, Suspense } from "react"



const LoginApp = lazy(() => import("login/LoginApp"));
const DashboardApp = lazy(() => import("dashboard/DashboardApp"));

function App() {
  return (
    <>
      <h1>Host app</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Suspense fallback="cargando...">
          <DashboardApp />
        </Suspense>
        <Suspense fallback="cargando...">
          <LoginApp />
        </Suspense>
      </div>
    </>
  )
}

export default App
