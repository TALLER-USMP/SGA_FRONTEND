import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "./use-session";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api";

export interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
  email: string;
  phone: string;
  photo: string | null;
}

interface ProfileResponse {
  nombre?: string;
  Nombre?: string;
  apellido?: string;
  Apellido?: string;
  grado?: string;
  Grado?: string;
  correo?: string;
  Correo?: string;
  telefono?: string;
  Telefono?: string;
  bachiller?: string;
  Bachiller?: string;
}

/**
 * 🔧 Formatea los datos del perfil del backend al formato del frontend
 * GET: Divide el nombre completo en nombre y apellidos
 */
const formatProfileData = (
  data: ProfileResponse,
  userEmail?: string,
): ProfileData => {
  // Extraer nombre y apellido del backend
  const nombreBackend = (data.nombre || data.Nombre || "").trim();
  const apellidoBackend = (data.apellido || data.Apellido || "").trim();

  let firstName = "";
  let lastName = "";

  // Si el backend envía nombre y apellido separados
  if (nombreBackend && apellidoBackend) {
    firstName = nombreBackend;
    lastName = apellidoBackend;
  }
  // Si solo hay nombre (nombre completo), dividirlo
  else if (nombreBackend && !apellidoBackend) {
    const palabras = nombreBackend.split(" ").filter(Boolean);

    if (palabras.length <= 1) {
      firstName = palabras[0] || "";
      lastName = "";
    } else {
      // Dividir en la mitad: primeras palabras = nombre, últimas = apellidos
      const mitad = Math.ceil(palabras.length / 2);
      firstName = palabras.slice(0, mitad).join(" ");
      lastName = palabras.slice(mitad).join(" ");
    }
  }

  return {
    firstName,
    lastName,
    profession:
      data.grado || data.Grado || data.bachiller || data.Bachiller || "",
    email: data.correo || data.Correo || userEmail || "",
    phone: data.telefono || data.Telefono || "",
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
  // PUT: Une firstName y lastName en un solo campo nombre
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: ProfileData) => {
      if (!user?.id) throw new Error("No user ID");

      // 🔥 COMBINAR nombre y apellido en un solo campo "nombre"
      const nombreCompleto =
        `${updatedData.firstName.trim()} ${updatedData.lastName.trim()}`.trim();

      const response = await fetch(`${API_BASE}/teacher/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreCompleto, // 🔥 Backend guarda todo en nombre
          correo: updatedData.email,
          grado: updatedData.profession || "",
          telefono: updatedData.phone || "",
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
