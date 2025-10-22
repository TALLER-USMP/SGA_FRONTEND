import { ChevronRight } from "lucide-react";

export default function Step6() {
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">6. Evaluación</div>

      <div className="max-w-sm">
        <div className="relative">
          <select className="w-full bg-black text-white p-3 rounded-lg appearance-none pr-10">
            <option value="formula">Formula</option>
            <option value="defaul">defaul</option>
          </select>
          <ChevronRight className="absolute right-3 top-1/2 transform -rotate-90 text-white w-4 h-4" />
        </div>
      </div>

      <div className="relative max-w-xl">
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Información de evaluación (vendrá de la API)..."
          readOnly
        />
      </div>
    </div>
  );
}
