import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "./use-session";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api";

export interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
  email: string;
  photo: string | null;
}

interface ProfileResponse {
  nombre?: string;
  Nombre?: string;
  grado?: string;
  Grado?: string;
  correo?: string;
  Correo?: string;
}

/**
 * 🔧 Formatea los datos del perfil del backend al formato del frontend
 */
const formatProfileData = (
  data: ProfileResponse,
  userEmail?: string,
): ProfileData => {
  const nombreCompleto = data.nombre || data.Nombre || "";
  const nombres = nombreCompleto.split(" ").filter(Boolean); // Elimina espacios vacíos
  const apellidosIndex = Math.min(2, Math.ceil(nombres.length / 2));

  return {
    firstName: nombres.slice(0, apellidosIndex).join(" "),
    lastName: nombres.slice(apellidosIndex).join(" "),
    profession: data.grado || data.Grado || "",
    email: data.correo || data.Correo || userEmail || "",
    photo: null,
  };
};

export function useProfile() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  // 📥 Query para obtener el perfil
  const getProfile = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<ProfileResponse> => {
      if (!user?.id) throw new Error("No user ID");

      const response = await fetch(`${API_BASE}/teacher/${user.id}`);

      if (!response.ok) {
        throw new Error("Error al cargar perfil");
      }

      const data = await response.json();
      return data.data || data;
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // 📤 Mutation para actualizar el perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: ProfileData) => {
      if (!user?.id) throw new Error("No user ID");

      const response = await fetch(`${API_BASE}/teacher/${user.id}`, {
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
    onSuccess: async () => {
      // Invalida ambas queries para refrescar los datos
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return {
    // 📊 Datos formateados
    profile: getProfile.data
      ? formatProfileData(getProfile.data, user?.email)
      : null,

    // 🔄 Estados de carga
    isLoading: getProfile.isLoading,
    isError: getProfile.isError,
    error: getProfile.error,

    // 💾 Mutación de actualización
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,

    // 🔄 Funciones auxiliares
    refetch: getProfile.refetch,
  };
}
