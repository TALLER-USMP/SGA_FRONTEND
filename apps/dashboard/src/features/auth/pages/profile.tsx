import { useSession } from "../hooks/use-session";

export default function ProfilePage() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <span className="text-gray-600">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <p className="text-gray-900">{user?.name || "No disponible"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user?.email || "No disponible"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <p className="text-gray-900">{user?.role || "No disponible"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
