import { getRoleName } from "../constants/roles";
import { useSession } from "../contexts/useSession";
import CoordinatorHome from "./coordinator/CoordinatorHome";
import DirectorHome from "./director/DirectorHome";
import TeacherHome from "./teacher/TeacherHome";

export default function HomePage() {
  const { user } = useSession();
  const role = getRoleName(user?.role);

  const roleContent = {
    docente: <TeacherHome />,
    coordinadora_academica: <CoordinatorHome />,
    director_escuela: <DirectorHome />,
  } as const;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">bienvenido {role}</h1>

      {roleContent[role as keyof typeof roleContent] ?? (
        <p className="text-gray-700">Rol no autorizado o sin contenido.</p>
      )}
    </div>
  );
}
