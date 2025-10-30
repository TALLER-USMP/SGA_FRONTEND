import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/auth/hooks/use-session";
import { getRoleName } from "@/common/constants/roles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Camera } from "lucide-react";

// Mapeo de roles para el título
const roleDisplayNames = {
  docente: "Profesor",
  coordinadora_academica: "Coordinador Académico",
  director_escuela: "Director",
  indeterminado: "Usuario",
} as const;

interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
  email: string;
  photo: string | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSession();
  const roleName = getRoleName(user?.role);
  const roleDisplayName =
    roleDisplayNames[roleName as keyof typeof roleDisplayNames] || "Usuario";

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    profession: "Ing. Software",
    email: user?.email || "",
    photo: null,
  });

  useEffect(() => {
    if (user && user.name) {
      const parts = user.name.trim().split(" ");
      const firstName = parts.slice(0, 2).join(" ");
      const lastName = parts.slice(2).join(" ");
      setProfileData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email ?? "",
      }));
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          photo: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ MUTACIÓN con ruta relativa (funciona local y en producción)
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: ProfileData) => {
      const response = await fetch(`/api/docente/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `${updatedData.firstName} ${updatedData.lastName}`.trim(),
          correo: updatedData.email,
          grado: updatedData.profession,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar perfil");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      alert("✅ Perfil actualizado correctamente");
      console.log("Respuesta del servidor:", data);

      // 🔁 Refrescar sesión para mostrar los nuevos datos
      await queryClient.invalidateQueries({ queryKey: ["session"] });

      setIsEditing(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("❌ Error al guardar perfil:", error);
      alert("⚠️ Ocurrió un error al guardar los cambios.");
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      profession: "Ing. Software",
      email: user?.email || "",
      photo: null,
    });
    setIsEditing(false);
  };

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
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileData.photo ? (
                    <img
                      src={profileData.photo}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={80} className="text-gray-400" />
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Datos */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nombre", field: "firstName" },
                  { label: "Apellidos", field: "lastName" },
                  { label: "Profesión", field: "profession" },
                  { label: "Correo", field: "email" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={profileData[field as keyof ProfileData] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          field as keyof ProfileData,
                          e.target.value,
                        )
                      }
                      disabled={!isEditing}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        isEditing
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
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    {updateProfileMutation.isPending
                      ? "Guardando..."
                      : "Guardar"}
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
