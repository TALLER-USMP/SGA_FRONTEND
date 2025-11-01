// Syllabus feature exports

// Components
export { DownloadPDFButton } from "./components/download-pdf-button";
export { SyllabusPDFExample } from "./components/syllabus-pdf-example";
export { SyllabusPDFMockTest } from "./components/syllabus-pdf-mock-test";

// Hooks
export { useSyllabusPDF } from "./hooks/use-syllabus-pdf";

// Services
export { syllabusPDFService } from "./services/syllabus-pdf-service";

// Mocks
export {
  mockSyllabusData,
  mockGestionFinancieraData,
} from "./mocks/syllabus-mock-data";

// Types
export type {
  CompleteSyllabus,
  DatosGenerales,
  CompetenciaCurso,
  ComponenteCompetencia,
  ResultadoAprendizaje,
  UnidadDidactica,
  RecursoDidactico,
  PlanEvaluacion,
  FuenteInformacion,
  AporteResultadoPrograma,
} from "./types/complete-syllabus";
