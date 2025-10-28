import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeacherHome() {
  const navigate = useNavigate();

  const handleModifySyllabus = () => {
    navigate("/mis-asignaciones");
  };

  return (
    <div className="flex gap-4 p-8">
      <button
        onClick={handleModifySyllabus}
        className="bg-white hover:bg-gray-50 text-black font-semibold py-4 px-8 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 min-w-[200px]"
      >
        <ClipboardList className="text-red-600" size={24} />
        Modificar sílabo
      </button>
    </div>
  );
}
