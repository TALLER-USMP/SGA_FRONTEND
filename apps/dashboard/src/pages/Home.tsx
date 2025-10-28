import { getRoleName } from "../constants/roles";
import { useSession } from "../contexts/useSession";
import CoordinatorHome from "./CoordinatorHome";
import DirectorHome from "./DirectorHome";
import TeacherHome from "./TeacherHome";

export default function HomePage() {
  const { user } = useSession();
  const role = getRoleName(user?.role);

  const roleContent = {
    docente: <TeacherHome />,
    coordinadora_academica: <CoordinatorHome />,
    director_escuela: <DirectorHome />,
  } as const;

  return (
    <div>
      {roleContent[role as keyof typeof roleContent] ?? (
        <div className="p-6">
          <p className="text-gray-700">Rol no autorizado o sin contenido.</p>
        </div>
      )}
    </div>
  );
}
