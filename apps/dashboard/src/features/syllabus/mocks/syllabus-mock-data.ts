import type { CompleteSyllabus } from "../types/complete-syllabus";

/**
 * Mock de datos completos de un sílabo para testing
 * Basado en el sílabo de "Taller de Proyectos 2025-II"
 */
export const mockSyllabusData: CompleteSyllabus = {
  datosGenerales: {
    nombreAsignatura: "Taller de Proyectos",
    codigoAsignatura: "0302-03408",
    departamentoAcademico:
      "Departamento Académico de Ingeniería de Sistemas e Informática",
    escuelaProfesional: "Escuela Profesional de Ingeniería de Sistemas",
    programaAcademico: "Ingeniería de Sistemas",
    semestreAcademico: "2025-II",
    tipoAsignatura: "Obligatoria",
    modalidad: "Presencial",
    ciclo: "VIII",
    requisitos: "Formulación y Evaluación de Proyectos",
    creditosTeoria: 0,
    creditosPractica: 2,
    creditosTotales: 2,
    horasTeoria: 0,
    horasPractica: 10,
    horasTotales: 10,
    docentes: "Ing. Miguel Angel Iparraguirre Villanueva",
  },

  sumilla:
    "La asignatura de Taller de Proyectos es de naturaleza teórico-práctica, tiene como propósito desarrollar en el estudiante las competencias necesarias para la elaboración, gestión y evaluación de proyectos de software, aplicando metodologías ágiles y tradicionales. Comprende el estudio de: Gestión de proyectos, metodologías de desarrollo, planificación y control, gestión de riesgos, calidad de software, y presentación de proyectos.",

  competenciasCurso: [
    {
      id: 1,
      codigo: "b",
      descripcion:
        "Utiliza el pensamiento crítico, analizando los diferentes contextos, fuentes de información y hechos de la realidad.",
      orden: 1,
    },
    {
      id: 2,
      codigo: "c",
      descripcion:
        "Realiza investigaciones, relacionadas con su profesión, bajo la guía de un profesional de mayor experiencia.",
      orden: 2,
    },
    {
      id: 3,
      codigo: "d",
      descripcion:
        "Aplica adecuadamente estrategias metacognitivas, lo que lo capacita para el aprendizaje autónomo para toda la vida (Aprender a aprender).",
      orden: 3,
    },
    {
      id: 4,
      codigo: "a",
      descripcion:
        "Planifica y organiza eficazmente sus actividades y el tiempo dedicado a ellas.",
      orden: 4,
    },
    {
      id: 5,
      codigo: "d",
      descripcion:
        "Utiliza eficazmente las nuevas tecnologías de información y la comunicación.",
      orden: 5,
    },
    {
      id: 6,
      codigo: "e",
      descripcion:
        "Resuelve de manera creadora los problemas profesionales y personales a los que se enfrenta.",
      orden: 6,
    },
    {
      id: 7,
      codigo: "f",
      descripcion:
        "Lidera y participa activamente en equipos de trabajo, se compromete con las tareas y logros de los mismos.",
      orden: 7,
    },
    {
      id: 8,
      codigo: "h",
      descripcion:
        "Reconoce la diversidad cultural y la existencia de diferentes perspectivas culturales, expresadas en distintas formas de organización, sistemas de relación y visiones del mundo, lo que implica el reconocimiento y valoración del otro.",
      orden: 8,
    },
    {
      id: 9,
      codigo: "1",
      descripcion:
        "Analizar un sistema complejo de computación y aplicar principios de computación y otras disciplinas relevantes para identificar soluciones.",
      orden: 9,
    },
    {
      id: 10,
      codigo: "2",
      descripcion:
        "Diseñar, implementar y evaluar una solución basada en computación para cumplir con un determinado conjunto de requerimientos de computación en el contexto de la disciplina del programa.",
      orden: 10,
    },
    {
      id: 11,
      codigo: "3",
      descripcion:
        "Comunicación efectiva en una variedad de contextos profesionales.",
      orden: 11,
    },
    {
      id: 12,
      codigo: "5",
      descripcion:
        "Trabajar de manera efectiva como miembro o líder de un equipo comprometido con actividades propias de la disciplina del programa.",
      orden: 12,
    },
    {
      id: 13,
      codigo: "6",
      descripcion:
        "Brindar soporte a la entrega, uso, y administración de sistemas de información en un entorno de sistemas de información.",
      orden: 13,
    },
    {
      id: 14,
      codigo: "7",
      descripcion:
        "Aprendizaje Continuo: Reconoce la necesidad y tiene la capacidad para dedicarse a un aprendizaje autónomo para el desarrollo profesional continuo.",
      orden: 14,
    },
  ],

  componentesConceptuales: [
    {
      id: 1,
      silaboId: 1,
      grupo: "COMP",
      codigo: "b.3",
      descripcion:
        "Analiza los diferentes dilemas sociales teniendo en cuenta la base del pensamiento crítico.",
      orden: 1,
    },
    {
      id: 2,
      silaboId: 1,
      grupo: "COMP",
      codigo: "c.1",
      descripcion:
        "Determina el tema de investigación y las fuentes de información relacionadas al tema por investigar.",
      orden: 2,
    },
    {
      id: 3,
      silaboId: 1,
      grupo: "COMP",
      codigo: "c.2",
      descripcion:
        "Aplica técnicas y herramientas para el desarrollo de la investigación en su especialidad.",
      orden: 3,
    },
    {
      id: 4,
      silaboId: 1,
      grupo: "COMP",
      codigo: "d.2",
      descripcion: "Ensaya y evalúa diversas maneras de aprender algo nuevo.",
      orden: 4,
    },
    {
      id: 5,
      silaboId: 1,
      grupo: "COMP",
      codigo: "d.3",
      descripcion:
        "Ejecuta ejercicios de autoevaluación para medir el desarrollo de su aprendizaje.",
      orden: 5,
    },
    {
      id: 6,
      silaboId: 1,
      grupo: "COMP",
      codigo: "a.1",
      descripcion: "Planifica eficazmente sus actividades.",
      orden: 6,
    },
    {
      id: 7,
      silaboId: 1,
      grupo: "COMP",
      codigo: "a.2",
      descripcion:
        "Asigna eficientemente los tiempos para el desarrollo de sus actividades.",
      orden: 7,
    },
    {
      id: 8,
      silaboId: 1,
      grupo: "COMP",
      codigo: "d.1",
      descripcion:
        "Reconoce las diferentes tecnologías de información y comunicación.",
      orden: 8,
    },
    {
      id: 9,
      silaboId: 1,
      grupo: "COMP",
      codigo: "d.2",
      descripcion:
        "Aplica las nuevas tecnologías de información en el contexto de su desarrollo académico profesional.",
      orden: 9,
    },
    {
      id: 10,
      silaboId: 1,
      grupo: "COMP",
      codigo: "e.1",
      descripcion:
        "Resuelve de manera creativa problemas profesionales a los que se enfrenta.",
      orden: 10,
    },
    {
      id: 11,
      silaboId: 1,
      grupo: "COMP",
      codigo: "f.1",
      descripcion: "Participa en equipos de trabajo.",
      orden: 11,
    },
    {
      id: 12,
      silaboId: 1,
      grupo: "COMP",
      codigo: "f.2",
      descripcion:
        "Se compromete con las tareas y logros de su equipo de trabajo.",
      orden: 12,
    },
    {
      id: 13,
      silaboId: 1,
      grupo: "COMP",
      codigo: "h.1",
      descripcion:
        "Reconoce la importancia del enfoque de ciudadanía intercultural en la práctica social en los distintos escenarios del desempeño personal y colectivo.",
      orden: 13,
    },
    {
      id: 14,
      silaboId: 1,
      grupo: "COMP",
      codigo: "1.a",
      descripcion: "Aplica conocimiento de la especialidad.",
      orden: 14,
    },
    {
      id: 15,
      silaboId: 1,
      grupo: "COMP",
      codigo: "1.b",
      descripcion: "Analiza problemas y establece requerimientos.",
      orden: 15,
    },
    {
      id: 16,
      silaboId: 1,
      grupo: "COMP",
      codigo: "2.a",
      descripcion:
        "Diseña, implementa y/o evalúa procesos, componentes o programas.",
      orden: 16,
    },
    {
      id: 17,
      silaboId: 1,
      grupo: "COMP",
      codigo: "2.b",
      descripcion: "Usa técnicas y herramientas de la especialidad.",
      orden: 17,
    },
    {
      id: 18,
      silaboId: 1,
      grupo: "COMP",
      codigo: "3.a",
      descripcion: "Se comunica de manera efectiva.",
      orden: 18,
    },
    {
      id: 19,
      silaboId: 1,
      grupo: "COMP",
      codigo: "5.a",
      descripcion: "Trabaja en equipo.",
      orden: 19,
    },
    {
      id: 20,
      silaboId: 1,
      grupo: "COMP",
      codigo: "6.a",
      descripcion:
        "Participa en las diversas etapas de un sistema de información.",
      orden: 20,
    },
    {
      id: 21,
      silaboId: 1,
      grupo: "COMP",
      codigo: "7.a",
      descripcion: "Reconoce la importancia de la formación continua.",
      orden: 21,
    },
  ],

  componentesProcedimentales: [],

  componentesActitudinales: [
    {
      id: 1,
      silaboId: 1,
      grupo: "ACT",
      codigo: "b",
      descripcion: "Búsqueda de la verdad.",
      orden: 1,
    },
    {
      id: 2,
      silaboId: 1,
      grupo: "ACT",
      codigo: "c",
      descripcion: "Compromiso ético en todo su quehacer.",
      orden: 2,
    },
    {
      id: 3,
      silaboId: 1,
      grupo: "ACT",
      codigo: "f",
      descripcion: "Actitud innovadora y emprendedora.",
      orden: 3,
    },
  ],

  resultadosAprendizaje: [
    {
      id: 1,
      silaboId: 1,
      codigo: "RA1",
      descripcion:
        "Elabora el plan de gestión de un proyecto de software aplicando estándares internacionales (PMI, PMBOK)",
      orden: 1,
    },
    {
      id: 2,
      silaboId: 1,
      codigo: "RA2",
      descripcion:
        "Implementa metodologías ágiles en el desarrollo de proyectos de software, demostrando dominio de Scrum y Kanban",
      orden: 2,
    },
    {
      id: 3,
      silaboId: 1,
      codigo: "RA3",
      descripcion:
        "Gestiona equipos de desarrollo aplicando técnicas de liderazgo y resolución de conflictos",
      orden: 3,
    },
    {
      id: 4,
      silaboId: 1,
      codigo: "RA4",
      descripcion:
        "Evalúa la viabilidad de proyectos de software mediante análisis técnico, económico y social",
      orden: 4,
    },
  ],

  unidadesDidacticas: [
    {
      id: 1,
      silaboId: 1,
      numero: 1,
      titulo: "DISEÑO DE SOLUCIONES INNOVADORAS",
      semanaInicio: 1,
      semanaFin: 4,
      contenidosConceptuales:
        "Determina el tema de investigación y las fuentes de información relacionadas al tema por investigar.\n" +
        "Aplica técnicas y herramientas para el desarrollo de la investigación en su especialidad.\n" +
        "Ensaya y evalúa diversas maneras de aprender algo nuevo.\n" +
        "Analiza problemas y establece requerimientos.",
      contenidosProcedimentales:
        "Identifica modelos y herramientas a utilizar.\n" +
        "Reconoce y utiliza información secundaria disponible física y virtualmente.\n" +
        "Conforma el equipo de proyecto.\n" +
        "Identifica el contexto del público objetivo, sus necesidades, público objetivo, entorno y usuario.\n" +
        "Producto: Descubrimiento del problema.\n" +
        "Analiza la información recolectada e identifica oportunidades de mejora y prioriza acciones.\n" +
        "Explora ideas.\n" +
        "Usa diversas herramientas cualitativas.\n" +
        "Producto: Idea de solución.\n" +
        "Realiza actividades grupales y propuestas creativas.\n" +
        "Desarrolla el prototipo.\n" +
        "Producto: Diseño del primer prototipo.\n" +
        "Realiza creación de prototipo en grupo.\n" +
        "Realiza validación de prototipo.\n" +
        "Producto: Evaluar prototipo",
      actividadesAprendizaje:
        "Taller:\n" +
        "- Trabajo grupal en el proyecto – 2 h\n" +
        "- Expone el proyecto final - 2 h\n" +
        "- Reunión de coordinación diaria –3 h\n" +
        "- Crea informe final de proyecto –3 h.\n" +
        "De trabajo independiente:\n" +
        "- No aplica",
      horasLectivasTeoria: 0,
      horasLectivasPractica: 10,
      horasNoLectivasTeoria: 0,
      horasNoLectivasPractica: 0,
    },
    {
      id: 2,
      silaboId: 1,
      numero: 2,
      titulo: "GESTIÓN DE PROYECTOS Y APLICACIONES MODERNAS",
      semanaInicio: 5,
      semanaFin: 8,
      contenidosConceptuales:
        "Organización y planificación de proyecto ágil.\n" +
        "Planificación del sprint.\n" +
        "Seguimiento del progreso del proyecto.\n" +
        "Seguimiento de progreso.\n" +
        "La revisión y retrospectiva del sprint.\n" +
        "Negociación del alcance y el retrabajo.\n" +
        "Sincerar la capacidad del equipo.\n" +
        "Soluciones modernas, arquitectura y características tecnológicas.",
      contenidosProcedimentales:
        "Crea la pila de producto.\n" +
        "Estima el esfuerzo de la historia de usuario.\n" +
        "Define, prioriza y planifica los esprints y releases.\n" +
        "Crea informe semanal.\n" +
        "Producto: La pila de producto del Sprint.\n" +
        "Identifica y sigue el estado de las tareas.\n" +
        "Actualiza diariamente la estimación de avances del sprint y seguimiento de progreso hacia el objetivo.\n" +
        "Crea y analiza el gráfico de evolución del trabajo.\n" +
        "Producto: La pila de producto del Sprint.\n" +
        "Identifica objetivos no cumplidos.\n" +
        "Negocia el alcance del proyecto.\n" +
        "Identifica los tipos de arquitectura y tecnología que involucrara la solución que se está desarrollando.\n" +
        "Producto: Arquitectura de la solución",
      actividadesAprendizaje:
        "Taller:\n" +
        "- Trabajo grupal en el proyecto – 2 h\n" +
        "- Expone el proyecto final - 2 h\n" +
        "- Reunión de coordinación diaria –3 h\n" +
        "- Crea informe final de proyecto –3 h.\n" +
        "De trabajo independiente:\n" +
        "- No aplica",
      horasLectivasTeoria: 0,
      horasLectivasPractica: 10,
      horasNoLectivasTeoria: 0,
      horasNoLectivasPractica: 0,
    },
    {
      id: 3,
      silaboId: 1,
      numero: 3,
      titulo: "INTEGRACIÓN Y ENTREGA CONTINUA",
      semanaInicio: 9,
      semanaFin: 12,
      contenidosConceptuales:
        "Integración continua en el proyecto.\n" +
        "Herramientas de automatización de la integración.\n" +
        "Entrega continua en el proyecto.\n" +
        "Herramientas de entrega continua.\n" +
        "Despliegue continuo en el proyecto.\n" +
        "Herramientas de despliegue continuo.\n" +
        "Técnicas de automatización de administración de infraestructura en nube.\n" +
        "Herramientas de automatización de infraestructura.",
      contenidosProcedimentales:
        "Integra en la rama máster.\n" +
        "Valida la funcionalidad y trazabilidad entre las historias de usuario, prototipos, mockup.\n" +
        "Producto: Integración continua implementada en repositorio compartido central.\n" +
        "Automatiza la liberación del código y pruebas en el entorno de almacenamiento o no producción.\n" +
        "Producto: Entrega continúa implementada.\n" +
        "Realiza la implementación automática del incremento.\n" +
        "Producto: Despliegue continuo en nube.\n" +
        "Administra el entorno en nube.\n" +
        "Configura servicios y componentes en la nube.",
      actividadesAprendizaje:
        "Taller:\n" +
        "- Trabajo grupal en el proyecto – 2 h\n" +
        "- Expone el proyecto final - 2 h\n" +
        "- Reunión de coordinación diaria –3 h\n" +
        "- Crea informe final de proyecto –3 h.\n" +
        "De trabajo independiente:\n" +
        "- No aplica",
      horasLectivasTeoria: 0,
      horasLectivasPractica: 10,
      horasNoLectivasTeoria: 0,
      horasNoLectivasPractica: 0,
    },
    {
      id: 4,
      silaboId: 1,
      numero: 4,
      titulo: "PRESENTACIÓN Y EVALUACIÓN DE RESULTADOS",
      semanaInicio: 13,
      semanaFin: 16,
      contenidosConceptuales:
        "Estrategias para mostrar información a auspiciadores y e interesados.\n" +
        "Estrategias para mostrar y encontrar el lugar adecuado para difundir.\n" +
        "Transferir los resultados a la comunidad educativa.\n" +
        "Publicaciones científicas.\n" +
        "Presentación del producto.\n" +
        "El informe final.\n" +
        "Semana de exámenes finales. Este curso no tiene examen final.\n" +
        "La evaluación del producto final presenta la nota del examen final.\n" +
        "La nota WT1 representa la evaluación final de todos los entregables que componen el producto final.",
      contenidosProcedimentales:
        "Crea poster de proyecto.\n" +
        "Crea página web de proyecto.\n" +
        "Crea wiki de proyecto.\n" +
        "Producto: Wiki y página web del proyecto.\n" +
        "Crear guías y manuales del conocimiento obtenido en el proyecto.\n" +
        "Crear videos técnicos de interés en el proyecto.\n" +
        "Revisa la importancia de crear artículos de difusión de resultados.\n" +
        "Revisa la importancia de la autoría.\n" +
        "Producto: Poster, video del proyecto.\n" +
        "Crea poster de proyecto.\n" +
        "Crea diapositiva de exposición final del proyecto.\n" +
        "Producto: Artículo de revisión.\n" +
        "Sustenta los resultados del proyecto.\n" +
        "Producto: Presentación del proyecto.",
      actividadesAprendizaje:
        "Taller:\n" +
        "- Trabajo grupal en el proyecto – 2 h\n" +
        "- Expone el proyecto final - 2 h\n" +
        "- Reunión de coordinación diaria –3 h\n" +
        "- Crea informe final de proyecto –3 h.\n" +
        "De trabajo independiente:\n" +
        "- No aplica\n" +
        "Taller (L):\n" +
        "- Evaluación de final de proyecto – 4 h\n" +
        "- Instalación de los recursos configurados para el proyecto –6h\n" +
        "De trabajo independiente (T-I):\n" +
        "- No aplica",
      horasLectivasTeoria: 0,
      horasLectivasPractica: 10,
      horasNoLectivasTeoria: 0,
      horasNoLectivasPractica: 0,
    },
  ],

  estrategiasMetodologicas:
    "La asignatura se desarrolla mediante clases teóricas expositivas, talleres prácticos, desarrollo de proyectos en equipo, estudios de casos reales, y uso de herramientas de gestión de proyectos. Se fomenta el aprendizaje colaborativo y la aplicación práctica de los conocimientos mediante el desarrollo de un proyecto integrador a lo largo del semestre.",

  recursosDidacticos: [
    {
      id: 1,
      recursoId: 1,
      recursoNombre: "Jira",
      destino: "Gestión de proyectos ágiles",
      observaciones: "Herramienta para seguimiento de tareas y sprints",
    },
    {
      id: 2,
      recursoId: 2,
      recursoNombre: "Trello",
      destino: "Tableros Kanban",
      observaciones: "Visualización de flujo de trabajo",
    },
    {
      id: 3,
      recursoId: 3,
      recursoNombre: "Microsoft Project",
      destino: "Planificación de proyectos",
      observaciones: "Creación de cronogramas y diagramas de Gantt",
    },
    {
      id: 4,
      recursoId: 4,
      recursoNombre: "GitHub",
      destino: "Control de versiones",
      observaciones: "Gestión de código fuente y colaboración",
    },
  ],

  evaluacionAprendizaje: {
    planEvaluacion: [
      {
        id: 1,
        silaboId: 1,
        semana: 8,
        instrumento: "Examen Parcial",
        descripcion: "Evaluación teórica de las unidades 1 y 2",
        peso: 20,
      },
      {
        id: 2,
        silaboId: 1,
        semana: 16,
        instrumento: "Examen Final",
        descripcion: "Evaluación teórica de las unidades 3 y 4",
        peso: 20,
      },
      {
        id: 3,
        silaboId: 1,
        semana: 16,
        instrumento: "Proyecto Integrador",
        descripcion: "Desarrollo de proyecto de software en equipo",
        peso: 40,
      },
      {
        id: 4,
        silaboId: 1,
        semana: 4,
        instrumento: "Prácticas Calificadas",
        descripcion: "Talleres y ejercicios prácticos",
        peso: 15,
      },
      {
        id: 5,
        silaboId: 1,
        semana: 16,
        instrumento: "Participación",
        descripcion: "Asistencia y participación en clase",
        peso: 5,
      },
    ],
    formulaEvaluacion:
      "NF = (EP * 0.20) + (EF * 0.20) + (PI * 0.40) + (PC * 0.15) + (P * 0.05)",
  },

  fuentes: [
    {
      id: 1,
      tipo: "LIBRO",
      autores: "Project Management Institute",
      titulo:
        "A Guide to the Project Management Body of Knowledge (PMBOK Guide)",
      editorial: "PMI",
      anio: 2021,
      ciudad: "Newtown Square",
      isbn: "978-1628256642",
    },
    {
      id: 2,
      tipo: "LIBRO",
      autores: "Ken Schwaber, Jeff Sutherland",
      titulo: "The Scrum Guide",
      editorial: "Scrum.org",
      anio: 2020,
    },
    {
      id: 3,
      tipo: "LIBRO",
      autores: "Mike Cohn",
      titulo: "Agile Estimating and Planning",
      editorial: "Prentice Hall",
      anio: 2019,
      ciudad: "Boston",
      isbn: "978-0131479418",
    },
    {
      id: 4,
      tipo: "LIBRO",
      autores: "Roger S. Pressman",
      titulo: "Ingeniería del Software: Un Enfoque Práctico",
      editorial: "McGraw-Hill",
      anio: 2020,
      ciudad: "México",
      isbn: "978-6071513618",
    },
    {
      id: 5,
      tipo: "WEB",
      autores: "Atlassian",
      titulo: "Agile Project Management",
      anio: 2024,
      url: "https://www.atlassian.com/agile/project-management",
    },
  ],

  aportesResultadosPrograma: [
    {
      resultadoCodigo: "RP1",
      resultadoDescripcion:
        "Capacidad de identificar, formular y resolver problemas complejos de ingeniería",
      aporteValor: "K",
    },
    {
      resultadoCodigo: "RP2",
      resultadoDescripcion:
        "Capacidad de trabajar efectivamente en equipos multidisciplinarios",
      aporteValor: "K",
    },
    {
      resultadoCodigo: "RP3",
      resultadoDescripcion: "Capacidad de comunicarse efectivamente",
      aporteValor: "R",
    },
    {
      resultadoCodigo: "RP4",
      resultadoDescripcion:
        "Capacidad de aplicar conocimientos de gestión de proyectos",
      aporteValor: "K",
    },
  ],
};

/**
 * Mock de datos para Gestión Financiera
 */
export const mockGestionFinancieraData: CompleteSyllabus = {
  datosGenerales: {
    nombreAsignatura: "Gestión Financiera",
    codigoAsignatura: "0302-03305",
    departamentoAcademico:
      "Departamento Académico de Ingeniería de Sistemas e Informática",
    escuelaProfesional: "Escuela Profesional de Ingeniería de Sistemas",
    programaAcademico: "Ingeniería de Sistemas",
    semestreAcademico: "2024-I",
    tipoAsignatura: "Obligatoria",
    modalidad: "Presencial",
    ciclo: "VII",
    requisitos: "Contabilidad General",
    creditosTeoria: 2,
    creditosPractica: 1,
    creditosTotales: 3,
    horasTeoria: 2,
    horasPractica: 2,
    horasTotales: 4,
    docentes: "Mg. Carlos Ramírez Torres",
  },

  sumilla:
    "La asignatura de Gestión Financiera es de naturaleza teórico-práctica, tiene como propósito desarrollar en el estudiante las competencias necesarias para la gestión financiera de organizaciones, análisis de estados financieros, evaluación de inversiones y toma de decisiones financieras. Comprende el estudio de: Análisis financiero, presupuestos, flujo de caja, evaluación de proyectos de inversión, y gestión del capital de trabajo.",

  competenciasCurso: [
    {
      id: 1,
      codigo: "C1",
      descripcion:
        "Analiza estados financieros aplicando técnicas de análisis vertical, horizontal y ratios financieros.",
      orden: 1,
    },
    {
      id: 2,
      codigo: "C2",
      descripcion:
        "Elabora presupuestos y proyecciones financieras para la toma de decisiones empresariales.",
      orden: 2,
    },
  ],

  componentesConceptuales: [
    {
      id: 1,
      silaboId: 2,
      grupo: "COMP",
      codigo: "COMP-1",
      descripcion: "Fundamentos de gestión financiera",
      orden: 1,
    },
    {
      id: 2,
      silaboId: 2,
      grupo: "COMP",
      codigo: "COMP-2",
      descripcion: "Análisis de estados financieros",
      orden: 2,
    },
  ],

  componentesProcedimentales: [
    {
      id: 3,
      silaboId: 2,
      grupo: "PROC",
      codigo: "PROC-1",
      descripcion: "Elabora análisis financieros de empresas",
      orden: 1,
    },
  ],

  componentesActitudinales: [
    {
      id: 4,
      silaboId: 2,
      grupo: "ACT",
      codigo: "ACT-1",
      descripcion:
        "Demuestra ética profesional en el manejo de información financiera",
      orden: 1,
    },
  ],

  resultadosAprendizaje: [
    {
      id: 1,
      silaboId: 2,
      codigo: "RA1",
      descripcion: "Analiza estados financieros aplicando ratios financieros",
      orden: 1,
    },
  ],

  unidadesDidacticas: [
    {
      id: 1,
      silaboId: 2,
      numero: 1,
      titulo: "Introducción a la Gestión Financiera",
      semanaInicio: 1,
      semanaFin: 4,
      contenidosConceptuales:
        "Conceptos básicos de gestión financiera. Estados financieros. Análisis financiero.",
      contenidosProcedimentales: "Elaboración de análisis financieros.",
      actividadesAprendizaje: "Casos prácticos de análisis financiero.",
      horasLectivasTeoria: 8,
      horasLectivasPractica: 8,
      horasNoLectivasTeoria: 4,
      horasNoLectivasPractica: 4,
    },
  ],

  estrategiasMetodologicas:
    "Clases teóricas, casos prácticos, análisis de empresas reales, uso de software financiero.",

  recursosDidacticos: [
    {
      id: 1,
      recursoId: 1,
      recursoNombre: "Microsoft Excel",
      destino: "Análisis financiero",
      observaciones: "Herramienta para cálculos y análisis financiero",
    },
  ],

  evaluacionAprendizaje: {
    planEvaluacion: [
      {
        id: 1,
        silaboId: 2,
        semana: 8,
        instrumento: "Examen Parcial",
        descripcion: "Evaluación teórica",
        peso: 30,
      },
      {
        id: 2,
        silaboId: 2,
        semana: 16,
        instrumento: "Examen Final",
        descripcion: "Evaluación final",
        peso: 30,
      },
      {
        id: 3,
        silaboId: 2,
        semana: 12,
        instrumento: "Trabajos",
        descripcion: "Casos prácticos",
        peso: 40,
      },
    ],
    formulaEvaluacion: "NF = (EP * 0.30) + (EF * 0.30) + (T * 0.40)",
  },

  fuentes: [
    {
      id: 1,
      tipo: "LIBRO",
      autores: "Stephen Ross, Randolph Westerfield",
      titulo: "Finanzas Corporativas",
      editorial: "McGraw-Hill",
      anio: 2020,
      ciudad: "México",
      isbn: "978-6071513618",
    },
  ],

  aportesResultadosPrograma: [
    {
      resultadoCodigo: "RP1",
      resultadoDescripcion: "Capacidad de análisis financiero",
      aporteValor: "K",
    },
  ],
};
