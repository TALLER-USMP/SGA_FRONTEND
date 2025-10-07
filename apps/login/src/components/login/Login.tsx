import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);

      if (response && response.account) {
        instance.setActiveAccount(response.account);
        console.log("✅ Usuario autenticado:", response.account);

        // 1. Token para Microsoft Graph
        const graphToken = await instance.acquireTokenSilent({
          scopes: ["User.Read", "Mail.Read", "Calendars.Read"],
          account: response.account,
        });
        console.log("🔑 Graph Token:", graphToken.accessToken);

        // 2. Token para tu API protegida
        const apiToken = await instance.acquireTokenSilent({
          scopes: ["api://3d7c6395-07ae-461b-82fb-4776ba1af653/access"],
          account: response.account,
        });
        console.log("🔒 API Token:", apiToken.accessToken);

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

        // 3. Crear sesión en backend y recibir cookie
        const responseLogin = await fetch(`${baseUrl}/session/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ graphToken: graphToken.accessToken }),
          credentials: "include", // 🔑 para que la cookie se guarde
        });
        if (!responseLogin.ok) {
          console.error("❌ Error creating session:", responseLogin.statusText);
        }
        // 4. Verificar sesión usando la cookie
        const verifySession = await fetch(`${baseUrl}/session/me`, {
          method: "GET",
          credentials: "include", // 🔑 para enviar la cookie
        });

        if (verifySession.ok) {
          const data = await verifySession.json();
          console.log("👤 Sesión verificada:", data.user);
          navigate("/dashboard");
        } else {
          console.error(
            "⚠️ No se pudo verificar la sesión:",
            verifySession.statusText,
          );
        }
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">MS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Iniciar Sesión
          </h1>
          <p className="text-gray-500 text-sm">
            Accede con tu cuenta Microsoft
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Iniciar sesión con Microsoft
        </button>
      </div>
    </div>
  );
}
