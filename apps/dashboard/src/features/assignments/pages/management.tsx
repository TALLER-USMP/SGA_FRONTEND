import { useState, useEffect } from "react";
import { getCurrentAcademicPeriod } from "../../../common/utils/academic-period";
import { useToast } from "../../../common/hooks/use-toast";
import TeacherSelect, { type Teacher } from "../components/teacher-select";
import CourseSelect, { type Course } from "../components/course-select";
import CourseCodeInput from "../components/course-code-input";
import AcademicPeriodInput from "../components/academic-period-input";
import MessageTextarea from "../components/message-textarea";
import FormActions from "../components/form-actions";

export default function Management() {
  const toast = useToast();
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

  const handleSubmit = async () => {
    // Validaciones
    if (!selectedTeacher) {
      toast.error(
        "Docente requerido",
        "Por favor selecciona un docente antes de continuar",
      );
      return;
    }

    if (!selectedCourse) {
      toast.error(
        "Asignatura requerida",
        "Por favor selecciona una asignatura antes de continuar",
      );
      return;
    }

    if (!message.trim()) {
      toast.warning(
        "Mensaje vacío",
        "Se recomienda agregar un mensaje para el docente",
      );
    }

    try {
      const teacherId = parseInt(selectedTeacher.id);
      const syllabusId = parseInt(selectedCourse.id);

      // Validar que sean números válidos
      if (isNaN(teacherId)) {
        toast.error(
          "ID de docente inválido",
          "El ID del docente seleccionado no es válido",
        );
        return;
      }

      if (isNaN(syllabusId)) {
        toast.error(
          "ID de curso inválido",
          "El ID del curso seleccionado no es válido",
        );
        return;
      }

      // PASO 1: Verificar que el mailToken existe ANTES de hacer nada
      const mailToken = sessionStorage.getItem("mailToken");
      if (!mailToken) {
        toast.error(
          "Token de correo no disponible",
          "No se puede enviar el correo de notificación. Por favor, cierra sesión y vuelve a iniciar sesión.",
        );
        return;
      }

      // PASO 2: Enviar correo PRIMERO (antes de guardar en BD)
      await sendEmail({
        teacherName: selectedTeacher.name,
        teacherEmail: selectedTeacher.email,
        courseName: selectedCourse.name,
        courseCode: courseCode.trim(),
        academicPeriod: academicPeriod.trim(),
        additionalMessage: message.trim() || undefined,
      });

      // PASO 3: Solo si el correo se envió correctamente, guardar en BD
      const assignmentData = {
        teacher: selectedTeacher,
        course: selectedCourse,
        courseCode,
        academicPeriod,
        message,
      };

      await createAssignment.mutateAsync(assignmentData);

      // Simular llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        "¡Asignación exitosa!",
        `Se asignó ${selectedCourse.name} a ${selectedTeacher.name} para el periodo ${academicPeriod}`,
      );

      // Limpiar formulario después de éxito
      setTimeout(() => {
        setSelectedTeacher(null);
        setSelectedCourse(null);
        setTeacherSearch("");
        setCourseSearch("");
        setCourseCode("");
        setMessage("");
        setCharCount(0);
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Detectar error de duplicado en la base de datos
      if (
        errorMessage.includes("duplicate key") ||
        errorMessage.includes("unique constraint") ||
        errorMessage.includes("already exists")
      ) {
        toast.error(
          "Asignación duplicada",
          `Este docente ya está asignado a este curso. Por favor, verifica las asignaciones existentes.`,
        );
      } else if (
        errorMessage.includes("Token de correo") ||
        errorMessage.includes("mailToken") ||
        errorMessage.includes("Microsoft Graph") ||
        errorMessage.includes("InvalidAuthenticationToken")
      ) {
        toast.error(
          "Error al enviar correo",
          `No se pudo enviar el correo de notificación. La asignación NO se guardó. ${errorMessage}`,
        );
      } else if (
        errorMessage.includes("Failed query") ||
        errorMessage.includes("insert into")
      ) {
        // Error de base de datos
        toast.error(
          "Error al guardar asignación",
          `Ocurrió un error al guardar en la base de datos. El correo se envió pero la asignación no se guardó. Por favor, contacta al administrador.`,
        );
      } else {
        toast.error(
          "Error al procesar asignación",
          `Ocurrió un error: ${errorMessage}`,
        );
      }
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <TeacherSelect
          selectedTeacher={selectedTeacher}
          teacherSearch={teacherSearch}
          setTeacherSearch={setTeacherSearch}
          showTeacherDropdown={showTeacherDropdown}
          setShowTeacherDropdown={setShowTeacherDropdown}
          onTeacherSelect={handleTeacherSelect}
          onClearTeacher={handleClearTeacher}
          teachers={filteredTeachers}
        />

        <CourseSelect
          selectedCourse={selectedCourse}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          showCourseDropdown={showCourseDropdown}
          setShowCourseDropdown={setShowCourseDropdown}
          onCourseSelect={handleCourseSelect}
          onClearCourse={handleClearCourse}
          courses={filteredCourses}
        />

        <CourseCodeInput courseCode={courseCode} />

        <AcademicPeriodInput academicPeriod={academicPeriod} />

        <MessageTextarea
          message={message}
          onChange={handleMessageChange}
          charCount={charCount}
          maxChars={maxChars}
        />

        <FormActions onGoBack={handleGoBack} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
