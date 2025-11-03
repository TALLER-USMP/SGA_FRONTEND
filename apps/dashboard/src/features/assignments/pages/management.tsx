import { useState, useEffect } from "react";
import { getCurrentAcademicPeriod } from "../../../common/utils/academic-period";
import { useToast } from "../../../common/hooks/use-toast";
import { useSendAssignmentEmail } from "../hooks/use-send-assignment-email";
import { useTeachers, type Teacher } from "../hooks/use-teachers";
import { useCourses, type Course } from "../hooks/use-courses";
import { useCreateAssignment } from "../hooks/use-create-assignment";
import TeacherSelect from "../components/teacher-select";
import CourseSelect from "../components/course-select";
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

  // Cargar docentes y cursos desde el backend
  const {
    data: teachers = [],
    isLoading: isLoadingTeachers,
    isError: isErrorTeachers,
    error: teachersError,
  } = useTeachers();

  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
    error: coursesError,
  } = useCourses();

  const createAssignment = useCreateAssignment();
  const { sendEmail, isSending } = useSendAssignmentEmail();

  // Estado para prevenir doble ejecución
  const [isProcessing, setIsProcessing] = useState(false);

  // Mostrar errores de carga
  useEffect(() => {
    if (isErrorTeachers) {
      toast.error(
        "Error al cargar docentes",
        teachersError?.message || "No se pudieron cargar los docentes",
      );
    }
  }, [isErrorTeachers, teachersError, toast]);

  useEffect(() => {
    if (isErrorCourses) {
      toast.error(
        "Error al cargar cursos",
        coursesError?.message || "No se pudieron cargar los cursos",
      );
    }
  }, [isErrorCourses, coursesError, toast]);

  // Filtrar docentes
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()),
  );

  // Filtrar cursos
  const filteredCourses = courses.filter((course) =>
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
    // Prevenir doble ejecución
    if (isProcessing || isSending || createAssignment.isPending) {
      console.warn("⚠️ Proceso ya en ejecución, ignorando...");
      return;
    }

    setIsProcessing(true);

    try {
      await executeAssignment();
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAssignment = async () => {
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

    if (!courseCode.trim()) {
      toast.error(
        "Código de curso requerido",
        "Por favor ingresa el código del curso",
      );
      return;
    }

    if (!academicPeriod.trim()) {
      toast.error(
        "Periodo académico requerido",
        "Por favor ingresa el periodo académico",
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
      console.log("🔍 Verificando token de correo...");
      const mailToken = sessionStorage.getItem("mailToken");
      if (!mailToken) {
        toast.error(
          "Token de correo no disponible",
          "No se puede enviar el correo de notificación. Por favor, cierra sesión y vuelve a iniciar sesión.",
        );
        return;
      }
      console.log("✅ Token de correo disponible");

      // PASO 2: Enviar correo PRIMERO (antes de guardar en BD)
      console.log("📧 Enviando correo de notificación...");
      console.log("📧 Destinatario:", selectedTeacher.email);

      await sendEmail({
        teacherName: selectedTeacher.name,
        teacherEmail: selectedTeacher.email,
        courseName: selectedCourse.name,
        courseCode: courseCode.trim(),
        academicPeriod: academicPeriod.trim(),
        additionalMessage: message.trim() || undefined,
      });

      console.log("✅ Correo enviado exitosamente");

      // PASO 3: Solo si el correo se envió correctamente, guardar en BD
      console.log("📝 Guardando asignación en la base de datos...");
      console.log("📊 Datos de asignación:", {
        teacherId,
        syllabusId,
        courseCode: courseCode.trim(),
        academicPeriod: academicPeriod.trim(),
      });

      const assignmentData = {
        teacherId,
        syllabusId,
        courseCode: courseCode.trim(),
        academicPeriod: academicPeriod.trim(),
        message: message.trim() || "",
      };

      const assignmentResult =
        await createAssignment.mutateAsync(assignmentData);
      console.log("✅ Asignación guardada exitosamente:", assignmentResult);

      // PASO 4: Mostrar mensaje de éxito
      toast.success(
        "Asignación completada",
        `Se ha notificado a ${selectedTeacher.name} por correo electrónico y se guardó la asignación`,
      );

      // PASO 5: Limpiar formulario
      setSelectedTeacher(null);
      setSelectedCourse(null);
      setTeacherSearch("");
      setCourseSearch("");
      setCourseCode("");
      setMessage("");
      setCharCount(0);
    } catch (error) {
      console.error(
        "❌ Error en el proceso de asignación verifica que no dupliques asignaciones",
      );

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
        {(isLoadingTeachers || isLoadingCourses) && (
          <div className="mb-4 text-center text-sm text-gray-600">
            Cargando datos...
          </div>
        )}

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

        <FormActions
          onGoBack={handleGoBack}
          onSubmit={handleSubmit}
          isDisabled={
            !selectedTeacher ||
            !selectedCourse ||
            !courseCode.trim() ||
            !academicPeriod.trim()
          }
          isLoading={isProcessing || isSending || createAssignment.isPending}
        />
      </div>
    </div>
  );
}
