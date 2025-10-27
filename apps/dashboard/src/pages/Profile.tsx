import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/useSession";
import { getRoleName } from "../constants/roles";
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

  // Estado inicial con datos del usuario
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    profession: "Ing. Software", // Placeholder
    email: user?.email || "",
    photo: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleSave = () => {
    // Aquí iría la lógica para guardar en el backend
    console.log("Datos del perfil a guardar:", profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar datos originales
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
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Perfil {roleDisplayName}
        </h1>

        {/* Contenedor principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sección de foto */}
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

            {/* Sección de formulario */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100"
                    }`}
                    placeholder="Ingrese su nombre"
                  />
                </div>

                {/* Apellidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100"
                    }`}
                    placeholder="Ingrese sus apellidos"
                  />
                </div>

                {/* Profesión */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesión
                  </label>
                  <input
                    type="text"
                    value={profileData.profession}
                    onChange={(e) =>
                      handleInputChange("profession", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100"
                    }`}
                    placeholder="Ingrese su profesión"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100"
                    }`}
                    placeholder="Ingrese su correo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
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
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Guardar
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
