import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/features/auth/hooks/use-session";
import { getRoleName } from "@/common/constants/roles";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useToast } from "@/common/hooks/use-toast";
import {
  useProfile,
  type ProfileData,
} from "@/features/auth/hooks/use-profile";

const roleDisplayNames = {
  docente: "Profesor",
  coordinadora_academica: "Coordinador Académico",
  director_escuela: "Director",
  indeterminado: "Usuario",
} as const;

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSession();
  const toast = useToast();

  const { profile, isLoading, isError, updateProfile, isUpdating } =
    useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    profession: "",
    email: "",
    phone: "",
    photo: null,
  });

  const roleName = getRoleName(user?.role);
  const roleDisplayName =
    roleDisplayNames[roleName as keyof typeof roleDisplayNames] || "Usuario";

  // ✅ Resetear estado al cambiar de ruta
  useEffect(() => {
    setIsEditing(false);
  }, [location.pathname]);

  useEffect(() => {
    if (profile && !isEditing) {
      setProfileData(profile);
    }
  }, [profile, isEditing]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(profileData, {
      onSuccess: () => {
        toast.success(
          "Perfil actualizado",
          "Los cambios se guardaron correctamente ✅",
        );
        setIsEditing(false);
      },
      onError: (error: Error) => {
        console.error("❌ Error al guardar perfil:", error);

        // Mostrar mensaje específico si no hay cambios
        if (error.message.includes("No hay cambios")) {
          toast.info("Sin cambios", "No se detectaron cambios para guardar");
          setIsEditing(false);
        } else {
          toast.error(
            "Error",
            error.message || "No se pudo actualizar el perfil ⚠️",
          );
        }
      },
    });
  };

  const handleCancel = () => {
    if (profile) {
      setProfileData(profile);
    }
    setIsEditing(false);
  };

  // ✅ Mostrar loading solo si realmente está cargando
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Cargando perfil...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg text-red-600">
          Error al cargar el perfil. Por favor, intente de nuevo.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Perfil {roleDisplayName}
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Foto */}
            <div className="flex flex-col items-center">
              <UserAvatar className="w-48 h-48" />
            </div>

            {/* Datos */}
            <div className="flex-1">
              {isEditing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Solo modifica los campos que deseas actualizar. No es
                    necesario llenar todos los campos.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nombre", field: "firstName" as const },
                  { label: "Apellidos", field: "lastName" as const },
                  { label: "Profesión", field: "profession" as const },
                  { label: "Correo", field: "email" as const },
                  { label: "Teléfono", field: "phone" as const },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                            ? "tel"
                            : "text"
                      }
                      value={profileData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      disabled={field === "email" ? true : !isEditing}
                      placeholder={field === "phone" ? "999999999" : ""}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        isEditing && field !== "email"
                          ? "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-100"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              ← Volver
            </button>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isUpdating}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    {isUpdating ? "Guardando..." : "Guardar"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
