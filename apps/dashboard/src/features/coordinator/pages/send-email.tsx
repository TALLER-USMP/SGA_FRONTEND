import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Search } from "lucide-react";
import {
  useSendMail,
  MAX_FILES,
  MAX_FILE_BYTES,
} from "../../../common/hooks/useSendMail";
import {
  useTeachers,
  type Teacher,
} from "../../assignments/hooks/use-teachers";
import { useCourses, type Course } from "../../assignments/hooks/use-courses";
import { toast } from "sonner";

export default function SendEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener datos de la URL
  const teacherEmailParam = searchParams.get("teacherEmail") || "";
  const courseCodeParam = searchParams.get("courseCode") || "";

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const maxChars = 400;

  const { sendMail, isSending } = useSendMail();

  // Cargar docentes
  const {
    data: teachers = [],
    isError: isErrorTeachers,
    error: teachersError,
  } = useTeachers();

  // Cargar todos los cursos
  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
    error: coursesError,
  } = useCourses();

  // Mostrar errores de carga
  useEffect(() => {
    if (isErrorTeachers) {
      toast.error(
        teachersError?.message || "No se pudieron cargar los docentes",
      );
    }
  }, [isErrorTeachers, teachersError]);

  useEffect(() => {
    if (isErrorCourses) {
      toast.error(coursesError?.message || "No se pudieron cargar los cursos");
    }
  }, [isErrorCourses, coursesError]);

  // Pre-llenar los campos cuando se carga el componente
  useEffect(() => {
    if (teacherEmailParam) {
      const teacher = teachers.find((t) => t.email === teacherEmailParam);
      if (teacher) {
        setSelectedTeacher(teacher);
        setTeacherSearch(teacher.name);
      }
    }
  }, [teacherEmailParam, teachers]);

  useEffect(() => {
    if (courseCodeParam && courses.length > 0) {
      const course = courses.find((c: Course) => c.code === courseCodeParam);
      if (course) {
        setSelectedCourse(course);
        setCourseSearch(course.name);
      }
    }
  }, [courseCodeParam, courses]);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTeacherDropdown(false);
      setShowCourseDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filtros para búsqueda
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(teacherSearch.toLowerCase()),
  );

  const filteredCourses = courses.filter(
    (c: Course) =>
      c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(courseSearch.toLowerCase()),
  );
  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setTeacherSearch(teacher.name);
    setShowTeacherDropdown(false);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCourseSearch(course.name);
    setShowCourseDropdown(false);
  };

  const handleClearTeacher = () => {
    setSelectedTeacher(null);
    setTeacherSearch("");
  };

  const handleClearCourse = () => {
    setSelectedCourse(null);
    setCourseSearch("");
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessage(text);
      setCharCount(text.length);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachments.length + files.length > MAX_FILES) {
      toast.error(`Máximo ${MAX_FILES} archivos permitidos`);
      return;
    }
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`El archivo ${file.name} supera los 3MB`);
        return;
      }
    }
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!selectedTeacher) {
      toast.error("Selecciona un destinatario");
      return;
    }

    if (!selectedCourse) {
      toast.error("Selecciona un curso");
      return;
    }

    if (!message.trim()) {
      toast.error("Ingresa el mensaje");
      return;
    }

    try {
      await sendMail({
        to: selectedTeacher.email,
        subject: `Notificación - Curso ${selectedCourse.code}`,
        body: message,
        files: attachments,
      });
      // Limpiar formulario después del éxito
      setSelectedTeacher(null);
      setTeacherSearch("");
      setSelectedCourse(null);
      setCourseSearch("");
      setMessage("");
      setCharCount(0);
      setAttachments([]);
    } catch {
      // El error ya se maneja en el hook con toast
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        {/* Destinatario */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-black mb-3">
            1. Destinatario (Docente)
          </label>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => {
                  setTeacherSearch(e.target.value);
                  setShowTeacherDropdown(true);
                }}
                onFocus={() => setShowTeacherDropdown(true)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar docente por nombre o correo..."
              />
              {selectedTeacher && (
                <button
                  onClick={handleClearTeacher}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Dropdown de docentes */}
            {showTeacherDropdown &&
              teacherSearch &&
              filteredTeachers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredTeachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => handleTeacherSelect(teacher)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {teacher.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            {selectedTeacher && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900">
                      {selectedTeacher.name}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedTeacher.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Curso */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-black mb-3">
            2. Curso
          </label>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => {
                  setCourseSearch(e.target.value);
                  setShowCourseDropdown(true);
                }}
                onFocus={() => setShowCourseDropdown(true)}
                disabled={isLoadingCourses}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder={
                  isLoadingCourses
                    ? "Cargando cursos..."
                    : "Buscar curso por nombre o código..."
                }
              />
              {selectedCourse && (
                <button
                  onClick={handleClearCourse}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Dropdown de cursos */}
            {showCourseDropdown &&
              courseSearch &&
              filteredCourses.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCourses.map((course: Course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {course.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Código: {course.code}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            {showCourseDropdown &&
              courseSearch &&
              filteredCourses.length === 0 &&
              !isLoadingCourses && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  No se encontraron cursos
                </div>
              )}

            {selectedCourse && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-900">
                      {selectedCourse.name}
                    </div>
                    <div className="text-sm text-green-700">
                      Código: {selectedCourse.code}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje al Docente */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-black mb-3">
            3. Mensaje al Docente
          </label>
          <div className="relative">
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Se te han activado permisos para modificar el sílabo."
              rows={8}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {charCount}/{maxChars}
            </div>
          </div>
        </div>

        {/* Archivos Adjuntos */}
        <div className="mb-8">
          <label className="block text-xl font-bold text-black mb-3">
            4. Archivos Adjuntos (opcional)
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={attachments.length >= MAX_FILES}
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                attachments.length >= MAX_FILES
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                  : "border-gray-400 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <Upload size={20} className="text-gray-600" />
              <span className="text-gray-700">
                {attachments.length >= MAX_FILES
                  ? `Máximo ${MAX_FILES} archivos`
                  : "Seleccionar archivos (máx. 3MB c/u)"}
              </span>
            </label>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
