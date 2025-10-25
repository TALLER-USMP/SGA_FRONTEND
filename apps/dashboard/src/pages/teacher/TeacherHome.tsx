import { ClipboardList } from "lucide-react";

export default function TeacherHome() {
  return (
    <div className="flex gap-4 p-8">
      <button className="bg-white hover:bg-gray-50 text-black font-semibold py-3 px-6 rounded-lg border-2 border-black transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3">
        <ClipboardList className="text-red-600" size={24} />
        Modificar silabo
      </button>
    </div>
  );
}
