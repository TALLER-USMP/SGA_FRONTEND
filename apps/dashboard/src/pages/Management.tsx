import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  getCurrentAcademicPeriod,
  getSemesterName,
} from "../utils/academicPeriod";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

export default function Management() {
  const [academicPeriod, setAcademicPeriod] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseCode, setCourseCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const maxChars = 400;

  // Búsqueda de docentes
  const [teacherSearch, setTeacherSearch] = useState<string>("");
  const [showTeacherDropdown, setShowTeacherDropdown] =
    useState<boolean>(false);

  // Búsqueda de asignaturas
  const [courseSearch, setCourseSearch] = useState<string>("");
  const [showCourseDropdown, setShowCourseDropdown] = useState<boolean>(false);

  // Mock data - reemplazar con datos reales del backend
  const mockTeachers: Teacher[] = [
    {
      id: "1",
      name: "Huapalla García Juan Manuel",
      email: "jhuapalla@usmp.pe",
    },
    { id: "2", name: "García López María Elena", email: "mgarcia@usmp.pe" },
    {
      id: "3",
      name: "Rodríguez Pérez Carlos Alberto",
      email: "crodriguez@usmp.pe",
    },
    {
      id: "4",
      name: "Fernández Torres Ana Lucía",
      email: "afernandez@usmp.pe",
    },
  ];

  const mockCourses: Course[] = [
    { id: "1", name: "Taller de Proyectos", code: "09072108042" },
    { id: "2", name: "Programación Orientada a Objetos", code: "09072108043" },
    { id: "3", name: "Base de Datos", code: "09072108044" },
    { id: "4", name: "Ingeniería de Software", code: "09072108045" },
  ];

  // Filtrar docentes
  const filteredTeachers = mockTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()),
  );

  // Filtrar cursos
  const filteredCourses = mockCourses.filter((course) =>
    course.name.toLowerCase().includes(courseSearch.toLowerCase()),
  );

  // Inicializar el periodo académico al cargar el componente
  useEffect(() => {
    const period = getCurrentAcademicPeriod();
    setAcademicPeriod(period);
  }, []);

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setTeacherSearch(teacher.name);
    setShowTeacherDropdown(false);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCourseSearch(course.name);
    setCourseCode(course.code);
    setShowCourseDropdown(false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessage(text);
      setCharCount(text.length);
    }
  };

  const handleClearTeacher = () => {
    setSelectedTeacher(null);
    setTeacherSearch("");
  };

  const handleClearCourse = () => {
    setSelectedCourse(null);
    setCourseSearch("");
    setCourseCode("");
  };

  const handleSubmit = () => {
    if (!selectedTeacher || !selectedCourse) {
      alert("Por favor selecciona un docente y una asignatura");
      return;
    }

    const assignmentData = {
      teacher: selectedTeacher,
      course: selectedCourse,
      courseCode,
      academicPeriod,
      message,
    };

    console.log("Asignación creada:", assignmentData);
    // Aquí iría la llamada al backend para crear la asignación
    alert("Asignación enviada correctamente");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* 1. Asignar Docente */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            1. Asignar Docente (s)
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 bg-white">
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => {
                  setTeacherSearch(e.target.value);
                  setShowTeacherDropdown(true);
                }}
                onFocus={() => setShowTeacherDropdown(true)}
                placeholder="Buscar docente..."
                className="flex-1 outline-none text-gray-700"
              />
              <Search className="text-gray-400" size={20} />
              {selectedTeacher && (
                <button
                  onClick={handleClearTeacher}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Dropdown de docentes */}
            {showTeacherDropdown && teacherSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => handleTeacherSelect(teacher)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">
                        {teacher.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.email}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    No se encontraron docentes
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Nombre de la Asignatura */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            2. Nombre de la Asignatura
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 bg-white">
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => {
                  setCourseSearch(e.target.value);
                  setShowCourseDropdown(true);
                }}
                onFocus={() => setShowCourseDropdown(true)}
                placeholder="Buscar asignatura..."
                className="flex-1 outline-none text-gray-700"
              />
              <Search className="text-gray-400" size={20} />
              {selectedCourse && (
                <button
                  onClick={handleClearCourse}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Dropdown de asignaturas */}
            {showCourseDropdown && courseSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">
                        {course.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Código: {course.code}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    No se encontraron asignaturas
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. Código de Asignatura */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            3. Código de Asignatura
          </label>
          <input
            type="text"
            value={courseCode}
            readOnly
            placeholder="Selecciona una asignatura"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
          />
        </div>

        {/* 4. Periodo Académico */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            4. Periodo Académico
          </label>
          <input
            type="text"
            value={academicPeriod}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 font-medium"
          />
          <p className="text-sm text-gray-500 mt-1">
            {academicPeriod && getSemesterName(academicPeriod)} - Periodo
            generado automáticamente según el ciclo académico actual de la USMP
          </p>
        </div>

        {/* 5. Mensaje al Docente */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            5. Mensaje al Docente
          </label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Escribe un mensaje para el docente..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none h-40 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            &lt; Atrás
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
