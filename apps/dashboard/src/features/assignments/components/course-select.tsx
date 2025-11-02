import SearchableSelect from "./searchable-select";

export interface Course {
  id: string;
  name: string;
  code: string;
  ciclo?: string;
  escuela?: string;
}

interface CourseSelectProps {
  selectedCourse: Course | null;
  courseSearch: string;
  setCourseSearch: (value: string) => void;
  showCourseDropdown: boolean;
  setShowCourseDropdown: (show: boolean) => void;
  onCourseSelect: (course: Course) => void;
  onClearCourse: () => void;
  courses: Course[];
}

export default function CourseSelect({
  selectedCourse,
  courseSearch,
  setCourseSearch,
  showCourseDropdown,
  setShowCourseDropdown,
  onCourseSelect,
  onClearCourse,
  courses,
}: CourseSelectProps) {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-800 mb-2">
        2. Nombre de la Asignatura
      </label>
      <SearchableSelect
        value={courseSearch}
        onChange={setCourseSearch}
        onSelect={onCourseSelect}
        onClear={onClearCourse}
        items={courses}
        selectedItem={selectedCourse}
        showDropdown={showCourseDropdown}
        setShowDropdown={setShowCourseDropdown}
        placeholder="Buscar asignatura..."
        getItemKey={(course) => course.id}
        renderItem={(course) => (
          <>
            <div className="font-medium text-gray-800">{course.name}</div>
            <div className="text-sm text-gray-500">Código: {course.code}</div>
          </>
        )}
        noResultsText="No se encontraron asignaturas"
      />
    </div>
  );
}
