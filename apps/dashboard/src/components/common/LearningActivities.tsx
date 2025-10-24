import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface Activity {
  id: number;
  descripcion: string;
  horas: string;
}

export const LearningActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleAddActivity = () => {
    const newActivity: Activity = {
      id: Date.now(),
      descripcion: "",
      horas: "1h",
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  const handleRemoveActivity = (id: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleChangeDescripcion = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, descripcion: value } : a)),
    );
  };

  const handleChangeHoras = (
    id: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, horas: value } : a)),
    );
  };

  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-xl p-6 bg-[#F9FAFB]">
      <div className="flex flex-col gap-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 border border-gray-300"
          >
            <input
              type="text"
              placeholder="Descripción de la actividad"
              value={activity.descripcion}
              onChange={(e) => handleChangeDescripcion(activity.id, e)}
              className="flex-1 text-sm text-gray-800 border-none outline-none bg-transparent"
            />
            <select
              value={activity.horas}
              onChange={(e) => handleChangeHoras(activity.id, e)}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white outline-none"
            >
              <option value="1h">1h</option>
              <option value="2h">2h</option>
              <option value="3h">3h</option>
            </select>
            <button
              onClick={() => handleRemoveActivity(activity.id)}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            >
              <X size={14} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={handleAddActivity}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#004080] text-white hover:bg-[#003366] transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
