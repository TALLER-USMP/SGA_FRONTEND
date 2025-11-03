import SearchableSelect from "./searchable-select";

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface TeacherSelectProps {
  selectedTeacher: Teacher | null;
  teacherSearch: string;
  setTeacherSearch: (value: string) => void;
  showTeacherDropdown: boolean;
  setShowTeacherDropdown: (show: boolean) => void;
  onTeacherSelect: (teacher: Teacher) => void;
  onClearTeacher: () => void;
  teachers: Teacher[];
}

export default function TeacherSelect({
  selectedTeacher,
  teacherSearch,
  setTeacherSearch,
  showTeacherDropdown,
  setShowTeacherDropdown,
  onTeacherSelect,
  onClearTeacher,
  teachers,
}: TeacherSelectProps) {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-800 mb-2">
        1. Asignar Docente (s)
      </label>
      <SearchableSelect
        value={teacherSearch}
        onChange={setTeacherSearch}
        onSelect={onTeacherSelect}
        onClear={onClearTeacher}
        items={teachers}
        selectedItem={selectedTeacher}
        showDropdown={showTeacherDropdown}
        setShowDropdown={setShowTeacherDropdown}
        placeholder="Buscar docente..."
        getItemKey={(teacher) => teacher.id}
        renderItem={(teacher) => (
          <>
            <div className="font-medium text-gray-800">{teacher.name}</div>
            <div className="text-sm text-gray-500">{teacher.email}</div>
          </>
        )}
        noResultsText="No se encontraron docentes"
      />
    </div>
  );
}
