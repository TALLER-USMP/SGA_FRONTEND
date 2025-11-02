import type { CompleteSyllabus } from "../types/complete-syllabus";

class SyllabusPDFService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";
  }

  /**
   * Obtiene el sílabo completo desde el backend
   */
  async fetchCompleteSyllabus(syllabusId: number): Promise<CompleteSyllabus> {
    const url = `${this.baseUrl}/syllabus/${syllabusId}/complete`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Error al obtener sílabo completo: ${res.status} ${errorText}`,
      );
    }

    const response = await res.json();

    // El backend devuelve: { success: true, message: '...', data: {...} }
    // Extraemos solo el campo 'data' que contiene el sílabo
    if (response.success && response.data) {
      return response.data;
    }

    // Si no tiene la estructura esperada, devolver la respuesta completa
    return response;
  }

  /**
   * Carga la plantilla HTML desde assets
   */
  async loadTemplate(templateName: string): Promise<string> {
    const response = await fetch(`/assets/${templateName}`);

    if (!response.ok) {
      throw new Error(`Error al cargar plantilla: ${response.status}`);
    }

    return response.text();
  }

  /**
   * Reemplaza los placeholders en el HTML con los datos del sílabo
   */
  fillTemplate(htmlTemplate: string, data: CompleteSyllabus): string {
    let filledHtml = htmlTemplate;

    // Datos Generales
    const dg = data.datosGenerales;
    filledHtml = filledHtml
      .replace(/{{nombreAsignatura}}/g, dg.nombreAsignatura || "")
      .replace(/{{codigoAsignatura}}/g, dg.codigoAsignatura || "")
      .replace(/{{departamentoAcademico}}/g, dg.departamentoAcademico || "")
      .replace(/{{escuelaProfesional}}/g, dg.escuelaProfesional || "")
      .replace(/{{programaAcademico}}/g, dg.programaAcademico || "")
      .replace(/{{semestreAcademico}}/g, dg.semestreAcademico || "")
      .replace(/{{tipoAsignatura}}/g, dg.tipoAsignatura || "")
      .replace(/{{tipoEstudios}}/g, dg.tipoEstudios || "")
      .replace(/{{modalidad}}/g, dg.modalidad || "")
      .replace(/{{ciclo}}/g, dg.ciclo || "")
      .replace(/{{requisitos}}/g, dg.requisitos || "Sin requisitos")
      .replace(/{{creditosTeoria}}/g, String(dg.creditosTeoria || 0))
      .replace(/{{creditosPractica}}/g, String(dg.creditosPractica || 0))
      .replace(/{{creditosTotales}}/g, String(dg.creditosTotales || 0))
      .replace(/{{horasTeoria}}/g, String(dg.horasTeoria || 0))
      .replace(/{{horasPractica}}/g, String(dg.horasPractica || 0))
      .replace(/{{horasTotales}}/g, String(dg.horasTotales || 0))
      .replace(/{{docentes}}/g, dg.docentes || "");

    // Sumilla
    filledHtml = filledHtml.replace(/{{sumilla}}/g, data.sumilla || "");

    // Competencias del Curso
    const competenciasHtml = data.competenciasCurso
      .map((comp) => `<li>${comp.codigo}. ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(/{{competenciasCurso}}/g, competenciasHtml);

    // Componentes Conceptuales
    const conceptualesHtml = data.componentesConceptuales
      .map((comp) => `<li>${comp.codigo}. ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{componentesConceptuales}}/g,
      conceptualesHtml,
    );

    // Componentes Procedimentales
    const procedimentalesHtml = data.componentesProcedimentales
      .map((comp) => `<li>${comp.codigo}. ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{componentesProcedimentales}}/g,
      procedimentalesHtml,
    );

    // Componentes Actitudinales
    const actitudinalesHtml = data.componentesActitudinales
      .map((comp) => `<li>${comp.codigo}. ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{componentesActitudinales}}/g,
      actitudinalesHtml,
    );

    // Resultados de Aprendizaje
    const resultadosHtml = data.resultadosAprendizaje
      .map((ra) => `<li>${ra.codigo}. ${ra.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{resultadosAprendizaje}}/g,
      resultadosHtml,
    );

    // Unidades Didácticas (tabla)
    const unidadesHtml = data.unidadesDidacticas
      .map(
        (unidad) => `
        <tr>
          <td>${unidad.numero}</td>
          <td>${unidad.titulo}</td>
          <td>${unidad.semanaInicio} - ${unidad.semanaFin}</td>
          <td>${unidad.contenidosConceptuales || ""}</td>
          <td>${unidad.contenidosProcedimentales || ""}</td>
          <td>${unidad.actividadesAprendizaje || ""}</td>
          <td>${unidad.horasLectivasTeoria || 0}</td>
          <td>${unidad.horasLectivasPractica || 0}</td>
        </tr>
      `,
      )
      .join("\n");
    filledHtml = filledHtml.replace(/{{unidadesDidacticas}}/g, unidadesHtml);

    // Estrategias Metodológicas
    filledHtml = filledHtml.replace(
      /{{estrategiasMetodologicas}}/g,
      data.estrategiasMetodologicas || "",
    );

    // Recursos Didácticos
    const recursosHtml = data.recursosDidacticos
      .map((rec) => `<li>${rec.recursoNombre} - ${rec.destino}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(/{{recursosDidacticos}}/g, recursosHtml);

    // Evaluación del Aprendizaje - Descripción PF
    filledHtml = filledHtml.replace(
      /{{descripcionPF}}/g,
      data.evaluacionAprendizaje.descripcion || "",
    );

    // Fórmula PF
    filledHtml = filledHtml.replace(
      /{{formulaPF}}/g,
      data.evaluacionAprendizaje.formulaPF || "",
    );

    // Componentes PF
    const componentesPFHtml = (data.evaluacionAprendizaje.componentesPF || [])
      .map((comp) => `<li>${comp.codigo} = ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(/{{componentesPF}}/g, componentesPFHtml);

    // Evaluación del Aprendizaje - Descripción PE
    filledHtml = filledHtml.replace(
      /{{descripcionPE}}/g,
      data.evaluacionAprendizaje.descripcionPE || "",
    );

    // Fórmula PE
    filledHtml = filledHtml.replace(
      /{{formulaPE}}/g,
      data.evaluacionAprendizaje.formulaPE || "",
    );

    // Componentes PE
    const componentesPEHtml = (data.evaluacionAprendizaje.componentesPE || [])
      .map((comp) => `<li>${comp.codigo} = ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(/{{componentesPE}}/g, componentesPEHtml);

    // Fuentes de Información
    const fuentesHtml = data.fuentes
      .map((fuente) => {
        let citation = `${fuente.autores} (${fuente.anio || "s.f."}). <i>${fuente.titulo}</i>.`;
        if (fuente.editorial) citation += ` ${fuente.editorial}.`;
        if (fuente.ciudad) citation += ` ${fuente.ciudad}.`;
        if (fuente.url)
          citation += ` <a href="${fuente.url}">${fuente.url}</a>`;
        return `<li>${citation}</li>`;
      })
      .join("\n");
    filledHtml = filledHtml.replace(/{{fuentes}}/g, fuentesHtml);

    // Aportes a Resultados del Programa
    const aportesHtml = data.aportesResultadosPrograma
      .map(
        (aporte) => `
        <tr>
          <td>${aporte.resultadoCodigo}</td>
          <td>${aporte.resultadoDescripcion}</td>
          <td>${aporte.aporteValor}</td>
        </tr>
      `,
      )
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{aportesResultadosPrograma}}/g,
      aportesHtml,
    );

    return filledHtml;
  }
}

export const syllabusPDFService = new SyllabusPDFService();
