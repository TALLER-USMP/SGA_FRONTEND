import { useMsal } from "@azure/msal-react";
import { loginRequest, loginRequestBack } from "../../authConfig";
import { LogIn } from "lucide-react";
import { useCreateSession } from "../../hooks/useSession";
import type { AuthenticationResult } from "@azure/msal-browser";

export default function Login() {
  const { instance } = useMsal();
  const createSession = useCreateSession();

  const handleLogin = async () => {
    try {
      // poput del login de microsoft
      const response: AuthenticationResult = await instance.loginPopup(loginRequest);
      if (!response?.account) return;

      instance.setActiveAccount(response.account);
      console.log("✅ Usuario autenticado:", response.account);

      //permite acceder a datos del usuario en graph api
      const graphToken = await instance.acquireTokenSilent({
        ...loginRequest,
        account: response.account,
      });

      // jwt oficial de microsoft
      const apiToken = await instance.acquireTokenSilent({
        ...loginRequestBack,
        account: response.account,
      });

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

      // Crear sesión en tu backend (cookie)
      await createSession.mutateAsync({
        baseUrl,
        apiToken: apiToken.accessToken,
        graphToken: graphToken.accessToken,
      });

      // Redirigir al dashboard (microfrontend remoto)
      window.location.href = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5002";

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
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Iniciar Sesión</h1>
          <p className="text-gray-500 text-sm">Accede con tu cuenta Microsoft</p>
        </div>

        <button
          onClick={handleLogin}
          disabled={createSession.isPending}
          className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
        >
          {createSession.isPending ? (
            "Iniciando..."
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Iniciar sesión con Microsoft
            </>
          )}
        </button>
      </div>
    </div>
  );
}
