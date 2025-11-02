// Tipos para el sílabo completo según el backend

export interface DatosGenerales {
  nombreAsignatura?: string;
  departamentoAcademico?: string;
  escuelaProfesional?: string;
  programaAcademico?: string;
  semestreAcademico?: string;
  tipoAsignatura?: string;
  tipoEstudios?: string;
  modalidad?: string;
  codigoAsignatura?: string;
  ciclo?: string;
  requisitos?: string;
  creditosTeoria?: number;
  creditosPractica?: number;
  creditosTotales?: number;
  docentes?: string;
  horasTeoria?: number;
  horasPractica?: number;
  horasTotales?: number;
  areaCurricular?: string | null;
}

export interface CompetenciaCurso {
  id: number;
  codigo: string;
  descripcion: string;
  orden: number;
}

export interface ComponenteCompetencia {
  id: number;
  silaboId: number;
  grupo: "COMP" | "PROC" | "ACT";
  codigo: string;
  descripcion: string;
  orden: number;
}

export interface ResultadoAprendizaje {
  id: number;
  silaboId: number;
  codigo: string;
  descripcion: string;
  orden: number;
}

export interface UnidadDidactica {
  id: number;
  silaboId: number;
  numero: number;
  titulo: string;
  semanaInicio: number;
  semanaFin: number;
  contenidosConceptuales?: string;
  contenidosProcedimentales?: string;
  actividadesAprendizaje?: string;
  horasLectivasTeoria?: number;
  horasLectivasPractica?: number;
  horasNoLectivasTeoria?: number;
  horasNoLectivasPractica?: number;
}

export interface RecursoDidactico {
  id: number;
  recursoId: number;
  recursoNombre: string;
  destino: string;
  observaciones?: string;
}

export interface PlanEvaluacion {
  id: number;
  silaboId: number;
  semana: number;
  instrumento: string;
  descripcion?: string;
  peso?: number;
}

export interface FuenteInformacion {
  id: number;
  tipo: "LIBRO" | "ARTICULO" | "WEB" | "OTRO";
  autores: string;
  anio?: number;
  titulo: string;
  editorial?: string;
  ciudad?: string;
  isbn?: string;
  url?: string;
}

export interface AporteResultadoPrograma {
  resultadoCodigo: string;
  resultadoDescripcion: string;
  aporteValor: "K" | "R" | "";
}

export interface ComponenteEvaluacion {
  codigo: string;
  descripcion: string;
}

export interface EvaluacionAprendizaje {
  descripcion?: string;
  formulaPF?: string;
  componentesPF?: ComponenteEvaluacion[];
  descripcionPE?: string;
  formulaPE?: string;
  componentesPE?: ComponenteEvaluacion[];
}

export interface CompleteSyllabus {
  datosGenerales: DatosGenerales;
  sumilla: string | null;
  competenciasCurso: CompetenciaCurso[];
  componentesConceptuales: ComponenteCompetencia[];
  componentesProcedimentales: ComponenteCompetencia[];
  componentesActitudinales: ComponenteCompetencia[];
  resultadosAprendizaje: ResultadoAprendizaje[];
  unidadesDidacticas: UnidadDidactica[];
  estrategiasMetodologicas: string | null;
  recursosDidacticos: RecursoDidactico[];
  evaluacionAprendizaje: EvaluacionAprendizaje;
  fuentes: FuenteInformacion[];
  aportesResultadosPrograma: AporteResultadoPrograma[];
}
