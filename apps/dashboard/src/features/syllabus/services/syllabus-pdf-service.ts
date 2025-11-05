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
      .map((ra, index) => `<li>RA${index + 1}. ${ra.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{resultadosAprendizaje}}/g,
      resultadosHtml,
    );

    // Unidades Didácticas (tabla con semanas)
    const unidadesHtml = data.unidadesDidacticas
      .map((unidad) => {
        // Calcular rango de semanas basado en el array de semanas
        const semanas = unidad.semanas || [];
        const semanaMin =
          semanas.length > 0 ? Math.min(...semanas.map((s) => s.semana)) : 0;
        const semanaMax =
          semanas.length > 0 ? Math.max(...semanas.map((s) => s.semana)) : 0;
        const rangoSemanas =
          semanas.length > 0 ? `${semanaMin} - ${semanaMax}` : "";

        return `
        <tr>
          <td>${unidad.numero}</td>
          <td>${unidad.titulo}</td>
          <td>${rangoSemanas}</td>
          <td>${unidad.contenidosConceptuales || ""}</td>
          <td>${unidad.contenidosProcedimentales || ""}</td>
          <td>${unidad.actividadesAprendizaje || ""}</td>
          <td>${unidad.horasLectivasTeoria || 0}</td>
          <td>${unidad.horasLectivasPractica || 0}</td>
        </tr>
      `;
      })
      .join("\n");
    filledHtml = filledHtml.replace(/{{unidadesDidacticas}}/g, unidadesHtml);

    // Estrategias Metodológicas (ahora es un array de objetos)
    const estrategiasHtml = (data.estrategiasMetodologicas || [])
      .map(
        (est) => `
        <div class="estrategia">
          <h4>${est.nombre}</h4>
          <p>${est.descripcion}</p>
        </div>
      `,
      )
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{estrategiasMetodologicas}}/g,
      estrategiasHtml || "No se han definido estrategias metodológicas",
    );

    // Recursos Didácticos (nueva estructura con notas y recursos)
    const notasHtml = (data.recursosDidacticos.notas || [])
      .map(
        (nota) =>
          `<li><strong>${nota.nombre}:</strong> ${nota.descripcion}</li>`,
      )
      .join("\n");

    const recursosHtml = (data.recursosDidacticos.recursos || [])
      .map(
        (rec) =>
          `<li>${rec.recursoNombre} - ${rec.destino}${rec.observaciones ? ` (${rec.observaciones})` : ""}</li>`,
      )
      .join("\n");

    const todosRecursosHtml = `
      ${notasHtml ? `<h4>Notas:</h4><ul>${notasHtml}</ul>` : ""}
      ${recursosHtml ? `<h4>Recursos:</h4><ul>${recursosHtml}</ul>` : ""}
    `;

    filledHtml = filledHtml.replace(
      /{{recursosDidacticos}}/g,
      todosRecursosHtml || "No se han definido recursos",
    );

    // Evaluación del Aprendizaje - Nueva estructura
    // Plan de Evaluación (tabla)
    const planEvaluacionHtml = (data.evaluacionAprendizaje.planEvaluacion || [])
      .map(
        (item) => `
        <tr>
          <td>${item.componenteNombre}</td>
          <td>${item.instrumentoNombre}</td>
          <td>Semana ${item.semana}</td>
          <td>${item.instrucciones || ""}</td>
        </tr>
      `,
      )
      .join("\n");
    filledHtml = filledHtml.replace(
      /{{planEvaluacion}}/g,
      planEvaluacionHtml || "<tr><td colspan='4'>No definido</td></tr>",
    );

    // Fórmula de Evaluación
    const formula = data.evaluacionAprendizaje.formulaEvaluacion;
    if (formula) {
      filledHtml = filledHtml.replace(
        /{{nombreReglaEvaluacion}}/g,
        formula.nombreRegla || "",
      );
      filledHtml = filledHtml.replace(
        /{{expresionFinal}}/g,
        `${formula.variableFinalCodigo} = ${formula.expresionFinal}`,
      );

      // Variables de la fórmula
      const variablesHtml = (formula.variables || [])
        .map((v) => `<li><strong>${v.codigo}:</strong> ${v.descripcion}</li>`)
        .join("\n");
      filledHtml = filledHtml.replace(
        /{{variablesFormula}}/g,
        variablesHtml || "",
      );

      // Subfórmulas
      const subformulasHtml = (formula.subformulas || [])
        .map((sf) => `<li>${sf.variableCodigo} = ${sf.expresion}</li>`)
        .join("\n");
      filledHtml = filledHtml.replace(
        /{{subformulas}}/g,
        subformulasHtml || "",
      );
    } else {
      // Usar estructura antigua si no hay nueva
      filledHtml = filledHtml.replace(/{{nombreReglaEvaluacion}}/g, "");
      filledHtml = filledHtml.replace(
        /{{expresionFinal}}/g,
        data.evaluacionAprendizaje.formulaPF || "",
      );
      filledHtml = filledHtml.replace(/{{variablesFormula}}/g, "");
      filledHtml = filledHtml.replace(/{{subformulas}}/g, "");
    }

    // Mantener compatibilidad con campos antiguos (si existen en la plantilla)
    filledHtml = filledHtml.replace(
      /{{descripcionPF}}/g,
      data.evaluacionAprendizaje.descripcion || "",
    );

    filledHtml = filledHtml.replace(
      /{{formulaPF}}/g,
      data.evaluacionAprendizaje.formulaPF || "",
    );

    const componentesPFHtml = (data.evaluacionAprendizaje.componentesPF || [])
      .map((comp) => `<li>${comp.codigo} = ${comp.descripcion}</li>`)
      .join("\n");
    filledHtml = filledHtml.replace(/{{componentesPF}}/g, componentesPFHtml);

    filledHtml = filledHtml.replace(
      /{{descripcionPE}}/g,
      data.evaluacionAprendizaje.descripcionPE || "",
    );

    filledHtml = filledHtml.replace(
      /{{formulaPE}}/g,
      data.evaluacionAprendizaje.formulaPE || "",
    );

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
