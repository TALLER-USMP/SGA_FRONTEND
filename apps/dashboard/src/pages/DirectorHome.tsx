import { UserPlus, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DirectorHome() {
  const navigate = useNavigate();

  const handleAssignTeacher = () => {
    navigate("/management");
  };

  const handleSilabus = () => {
    navigate("/silabus");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-[60vh]">
      {/* Botón Asignar Docente */}
      <button
        onClick={handleAssignTeacher}
        className="bg-white hover:bg-gray-50 text-black font-semibold py-8 px-12 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-4 min-w-[300px]"
      >
        <div className="bg-red-600 text-white p-3 rounded-lg">
          <UserPlus size={28} />
        </div>
        <span className="text-lg">Asignar Docente</span>
      </button>

      {/* Botón Silabus */}
      <button
        onClick={handleSilabus}
        className="bg-white hover:bg-gray-50 text-black font-semibold py-8 px-12 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-4 min-w-[300px]"
      >
        <div className="bg-red-600 text-white p-3 rounded-lg">
          <FileCheck size={28} />
        </div>
        <span className="text-lg">Silabus</span>
      </button>
    </div>
  );
}
