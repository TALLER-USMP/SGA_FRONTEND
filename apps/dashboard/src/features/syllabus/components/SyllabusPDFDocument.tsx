import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CompleteSyllabus } from "../types/complete-syllabus";

const styles = StyleSheet.create({
  page: {
    padding: "20mm 15mm",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.2,
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
    marginBottom: 3,
  },
  table: {
    width: "100%",
    border: "1pt solid black",
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid black",
  },
  tableCell: {
    padding: "3pt 5pt",
    borderRight: "1pt solid black",
    fontSize: 10,
  },
  tableCellHeader: {
    padding: "3pt 5pt",
    borderRight: "1pt solid black",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f0f0f0",
  },
  tableCellLeft: {
    width: "40%",
  },
  tableCellRight: {
    width: "60%",
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
    textAlign: "justify",
  },
  textBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  textItalic: {
    fontSize: 10,
    fontFamily: "Helvetica-Oblique",
  },
  listItem: {
    fontSize: 10,
    marginLeft: 15,
    marginBottom: 2,
  },
});

interface SyllabusPDFDocumentProps {
  data: CompleteSyllabus;
}

export function SyllabusPDFDocument({ data }: SyllabusPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <Text style={styles.title}>SÍLABO</Text>
        <Text style={styles.mainTitle}>
          {data.datosGenerales.nombreAsignatura?.toUpperCase() || ""}
        </Text>
        <Text style={styles.subtitle}>
          ÁREA CURRICULAR:{" "}
          {data.datosGenerales.areaCurricular?.toUpperCase() || ""}
        </Text>

        {/* I. DATOS GENERALES */}
        <View>
          <Text style={styles.sectionTitle}>I. DATOS GENERALES</Text>
          <View style={styles.table}>
            {/* Departamento Académico */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Departamento Académico</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.departamentoAcademico || ""}</Text>
              </View>
            </View>

            {/* Escuela Profesional */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Escuela Profesional</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.escuelaProfesional || ""}</Text>
              </View>
            </View>

            {/* Programa académico */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Programa académico</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.programaAcademico || ""}</Text>
              </View>
            </View>

            {/* Semestre Académico */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Semestre Académico</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.semestreAcademico || ""}</Text>
              </View>
            </View>

            {/* Tipo de asignatura */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Tipo de asignatura</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.tipoAsignatura || ""}</Text>
              </View>
            </View>

            {/* Código de la asignatura */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Código de la asignatura</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.codigoAsignatura || ""}</Text>
              </View>
            </View>

            {/* Ciclo */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Ciclo</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.ciclo || ""}</Text>
              </View>
            </View>

            {/* Cantidad de Créditos */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Cantidad de Créditos</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>
                  Teoría ({data.datosGenerales.creditosTeoria || "00"}) Práctica
                  ({data.datosGenerales.creditosPractica || "00"}) Total
                  créditos ({data.datosGenerales.creditosTotales || "00"})
                </Text>
              </View>
            </View>

            {/* Docente(s) */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellLeft]}>
                <Text>Docente(s)</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellRight]}>
                <Text>{data.datosGenerales.docentes || ""}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* II. SUMILLA */}
        <View>
          <Text style={styles.sectionTitle}>II. SUMILLA</Text>
          <Text style={styles.text}>{data.sumilla || ""}</Text>
        </View>

        {/* III. COMPETENCIAS */}
        <View>
          <Text style={styles.sectionTitle}>
            III. COMPETENCIAS Y SUS COMPONENTES COMPRENDIDOS EN LA ASIGNATURA
          </Text>

          {/* Competencias del Curso */}
          {data.competenciasCurso && data.competenciasCurso.length > 0 && (
            <View>
              <Text style={styles.textBold}>3.1 Competencia</Text>
              {data.competenciasCurso.map((comp, idx) => (
                <Text key={idx} style={styles.listItem}>
                  - {comp.descripcion} ({comp.codigo})
                </Text>
              ))}
            </View>
          )}

          {/* Componentes Conceptuales */}
          {data.componentesConceptuales &&
            data.componentesConceptuales.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.textBold}>
                  3.2 Componentes Conceptuales
                </Text>
                {data.componentesConceptuales.map((comp, idx) => (
                  <Text key={idx} style={styles.listItem}>
                    - {comp.descripcion} ({comp.codigo})
                  </Text>
                ))}
              </View>
            )}

          {/* Componentes Procedimentales */}
          {data.componentesProcedimentales &&
            data.componentesProcedimentales.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.textBold}>
                  3.3 Componentes Procedimentales
                </Text>
                {data.componentesProcedimentales.map((comp, idx) => (
                  <Text key={idx} style={styles.listItem}>
                    - {comp.descripcion} ({comp.codigo})
                  </Text>
                ))}
              </View>
            )}

          {/* Contenidos actitudinales */}
          {data.componentesActitudinales &&
            data.componentesActitudinales.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.textBold}>Contenidos actitudinales</Text>
                {data.componentesActitudinales.map((cont, idx) => (
                  <Text key={idx} style={styles.listItem}>
                    - {cont.descripcion} ({cont.codigo})
                  </Text>
                ))}
              </View>
            )}
        </View>
      </Page>

      {/* Página 2: Programación de Contenidos - FORMATO HORIZONTAL */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.sectionTitle}>IV. PROGRAMACIÓN DE CONTENIDOS</Text>

        {data.unidadesDidacticas &&
          data.unidadesDidacticas.map((unidad, idx) => (
            <View
              key={idx}
              style={{ marginBottom: 10, border: "1pt solid black" }}
              wrap={false}
            >
              {/* Título de la unidad - centrado */}
              <View
                style={{
                  backgroundColor: "#d9d9d9",
                  padding: "6pt",
                  borderBottom: "1pt solid black",
                }}
              >
                <Text
                  style={[
                    styles.textBold,
                    { textAlign: "center", fontSize: 10 },
                  ]}
                >
                  UNIDAD {unidad.numero}: {unidad.titulo?.toUpperCase() || ""}
                </Text>
              </View>

              {/* Fila CAPACIDAD que abarca todo el ancho */}
              <View style={{ borderBottom: "1pt solid black" }}>
                <View style={{ padding: "4pt 6pt" }}>
                  <Text style={[styles.textBold, { fontSize: 9 }]}>
                    CAPACIDAD:
                  </Text>
                  {unidad.contenidosConceptuales
                    ?.split("\n")
                    .map((linea, i) => (
                      <Text
                        key={i}
                        style={{ fontSize: 8, marginLeft: 8, marginTop: 1 }}
                      >
                        - {linea.trim()}
                      </Text>
                    ))}
                </View>
              </View>

              {/* Fila de encabezados de columnas */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff",
                  borderBottom: "1pt solid black",
                }}
              >
                <View
                  style={{
                    width: "6%",
                    padding: "3pt 2pt",
                    borderRight: "1pt solid black",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 7, textAlign: "center" },
                    ]}
                  >
                    SEMANA
                  </Text>
                </View>
                <View
                  style={{
                    width: "29%",
                    padding: "3pt",
                    borderRight: "1pt solid black",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 7, textAlign: "center" },
                    ]}
                  >
                    CONTENIDOS CONCEPTUALES
                  </Text>
                </View>
                <View
                  style={{
                    width: "22%",
                    padding: "3pt",
                    borderRight: "1pt solid black",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 7, textAlign: "center" },
                    ]}
                  >
                    CONTENIDOS PROCEDIMENTALES
                  </Text>
                </View>
                <View
                  style={{
                    width: "21%",
                    padding: "3pt",
                    borderRight: "1pt solid black",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 7, textAlign: "center" },
                    ]}
                  >
                    ACTIVIDAD DE APRENDIZAJE
                  </Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    padding: "2pt 1pt",
                    borderRight: "1pt solid black",
                  }}
                >
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 6.5, textAlign: "center", marginBottom: 2 },
                    ]}
                  >
                    HORAS
                  </Text>
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 6.5, textAlign: "center", marginBottom: 2 },
                    ]}
                  >
                    LECTIVAS
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      borderTop: "1pt solid black",
                      paddingTop: 1,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderRight: "0.5pt solid black",
                        paddingRight: 1,
                      }}
                    >
                      <Text
                        style={[
                          styles.textBold,
                          { fontSize: 6, textAlign: "center" },
                        ]}
                      >
                        TEORÍA
                      </Text>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 1 }}>
                      <Text
                        style={[
                          styles.textBold,
                          { fontSize: 6, textAlign: "center" },
                        ]}
                      >
                        PRÁCTICA
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: "12%", padding: "2pt 1pt" }}>
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 6.5, textAlign: "center", marginBottom: 2 },
                    ]}
                  >
                    HORAS NO
                  </Text>
                  <Text
                    style={[
                      styles.textBold,
                      { fontSize: 6.5, textAlign: "center", marginBottom: 2 },
                    ]}
                  >
                    LECTIVAS
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      borderTop: "1pt solid black",
                      paddingTop: 1,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderRight: "0.5pt solid black",
                        paddingRight: 1,
                      }}
                    >
                      <Text
                        style={[
                          styles.textBold,
                          { fontSize: 6, textAlign: "center" },
                        ]}
                      >
                        TEORÍA
                      </Text>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 1 }}>
                      <Text
                        style={[
                          styles.textBold,
                          { fontSize: 6, textAlign: "center" },
                        ]}
                      >
                        PRÁCTICA
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Filas con el contenido - una fila por cada semana */}
              {(unidad.semanas || []).map((semana, semanaIdx) => {
                const numeroSemana = semana.semana;

                return (
                  <View
                    key={semanaIdx}
                    style={{
                      flexDirection: "row",
                      borderTop: semanaIdx > 0 ? "1pt solid black" : "none",
                      minHeight: 50,
                    }}
                  >
                    <View
                      style={{
                        width: "6%",
                        padding: "4pt 2pt",
                        borderRight: "1pt solid black",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text style={{ fontSize: 8, textAlign: "center" }}>
                        {numeroSemana}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "29%",
                        padding: "3pt 4pt",
                        borderRight: "1pt solid black",
                      }}
                    >
                      {semana.contenidosConceptuales && (
                        <Text
                          style={{
                            fontSize: 7.5,
                            marginBottom: 1.5,
                            lineHeight: 1.3,
                          }}
                        >
                          {semana.contenidosConceptuales}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        width: "22%",
                        padding: "3pt 4pt",
                        borderRight: "1pt solid black",
                      }}
                    >
                      {semana.contenidosProcedimentales && (
                        <Text
                          style={{
                            fontSize: 7.5,
                            marginBottom: 1.5,
                            lineHeight: 1.3,
                          }}
                        >
                          {semana.contenidosProcedimentales}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        width: "21%",
                        padding: "3pt 4pt",
                        borderRight: "1pt solid black",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Helvetica-Bold",
                            textDecoration: "underline",
                          }}
                        >
                          Taller:
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginLeft: 4,
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        - Trabajo grupal en el proyecto – 2 h
                      </Text>
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        - Exposición del proyecto final – 2 h
                      </Text>
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        - Reunión de coordinación diaria –3 h
                      </Text>
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginBottom: 3,
                          lineHeight: 1.3,
                        }}
                      >
                        - Crea informe final del proyecto –3 h.
                      </Text>
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Helvetica-Bold",
                            textDecoration: "underline",
                          }}
                        >
                          De trabajo independiente:
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 7.5,
                          marginLeft: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        - No aplica
                      </Text>
                    </View>
                    <View
                      style={{ width: "10%", borderRight: "1pt solid black" }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            borderRight: "0.5pt solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 7.5, textAlign: "center" }}>
                            {unidad.horasLectivasTeoria || 0}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 7.5, textAlign: "center" }}>
                            {unidad.horasLectivasPractica || 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ width: "12%" }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            borderRight: "0.5pt solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 7.5, textAlign: "center" }}>
                            {unidad.horasNoLectivasTeoria || 0}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 7.5, textAlign: "center" }}>
                            {unidad.horasNoLectivasPractica || 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
      </Page>

      {/* Página 3: Resto de secciones */}
      <Page size="A4" style={styles.page}>
        {/* V. ESTRATEGIAS METODOLÓGICAS */}
        {data.estrategiasMetodologicas &&
          data.estrategiasMetodologicas.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>
                V. ESTRATEGIAS METODOLÓGICAS
              </Text>
              {data.estrategiasMetodologicas.map((estrategia, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={{ ...styles.text, fontWeight: "bold" }}>
                    {estrategia.nombre}
                  </Text>
                  <Text style={styles.text}>{estrategia.descripcion}</Text>
                </View>
              ))}
            </View>
          )}

        {/* VI. RECURSOS DIDÁCTICOS */}
        {data.recursosDidacticos && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>VI. RECURSOS DIDÁCTICOS</Text>

            {/* Notas */}
            {data.recursosDidacticos.notas &&
              data.recursosDidacticos.notas.length > 0 && (
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ ...styles.text, fontWeight: "bold" }}>
                    Notas:
                  </Text>
                  {data.recursosDidacticos.notas.map((nota, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      - {nota.nombre}: {nota.descripcion}
                    </Text>
                  ))}
                </View>
              )}

            {/* Recursos */}
            {data.recursosDidacticos.recursos &&
              data.recursosDidacticos.recursos.length > 0 && (
                <View>
                  <Text style={{ ...styles.text, fontWeight: "bold" }}>
                    Recursos:
                  </Text>
                  {data.recursosDidacticos.recursos.map((recurso, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      - {recurso.recursoNombre} ({recurso.destino})
                      {recurso.observaciones && ` - ${recurso.observaciones}`}
                    </Text>
                  ))}
                </View>
              )}
          </View>
        )}

        {/* VII. EVALUACIÓN DEL APRENDIZAJE */}
        {data.evaluacionAprendizaje && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>
              VII. EVALUACIÓN DEL APRENDIZAJE
            </Text>

            {/* Nueva estructura con formulaEvaluacion */}
            {data.evaluacionAprendizaje.formulaEvaluacion && (
              <View>
                {/* Texto introductorio */}
                <Text style={[styles.text, { marginTop: 6, marginBottom: 8 }]}>
                  El promedio final (PF) de la asignatura se obtiene con la
                  siguiente fórmula:
                </Text>

                {/* Fórmula principal */}
                <Text
                  style={[
                    styles.text,
                    {
                      textAlign: "center",
                      fontFamily: "Helvetica-Bold",
                      marginBottom: 8,
                      fontSize: 10,
                    },
                  ]}
                >
                  {
                    data.evaluacionAprendizaje.formulaEvaluacion
                      .variableFinalCodigo
                  }{" "}
                  ={" "}
                  {data.evaluacionAprendizaje.formulaEvaluacion.expresionFinal}
                </Text>

                {/* Donde: */}
                <Text style={[styles.text, { marginBottom: 4 }]}>Donde:</Text>

                {/* Variables */}
                {data.evaluacionAprendizaje.formulaEvaluacion.variables &&
                  data.evaluacionAprendizaje.formulaEvaluacion.variables
                    .length > 0 && (
                    <View style={{ marginLeft: 10, marginBottom: 8 }}>
                      {data.evaluacionAprendizaje.formulaEvaluacion.variables.map(
                        (variable, idx) => (
                          <Text
                            key={idx}
                            style={[styles.text, { marginBottom: 2 }]}
                          >
                            {variable.codigo} = {variable.descripcion}
                          </Text>
                        ),
                      )}
                    </View>
                  )}

                {/* Subfórmulas */}
                {data.evaluacionAprendizaje.formulaEvaluacion.subformulas &&
                  data.evaluacionAprendizaje.formulaEvaluacion.subformulas
                    .length > 0 && (
                    <View style={{ marginLeft: 10, marginBottom: 8 }}>
                      {data.evaluacionAprendizaje.formulaEvaluacion.subformulas.map(
                        (subformula, idx) => (
                          <Text
                            key={idx}
                            style={[styles.text, { marginBottom: 2 }]}
                          >
                            {subformula.variableCodigo} = {subformula.expresion}
                          </Text>
                        ),
                      )}
                    </View>
                  )}

                {/* Texto adicional para PE */}
                <Text style={[styles.text, { marginTop: 8, marginBottom: 8 }]}>
                  El promedio de evaluaciones (PE) se obtiene de la siguiente
                  manera:
                </Text>

                {/* Plan de evaluación como tabla */}
                {data.evaluacionAprendizaje.planEvaluacion &&
                  data.evaluacionAprendizaje.planEvaluacion.length > 0 && (
                    <View
                      style={{
                        border: "1pt solid black",
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    >
                      {/* Encabezado de tabla */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderBottom: "1pt solid black",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        <View
                          style={{
                            width: "25%",
                            padding: "4pt",
                            borderRight: "1pt solid black",
                          }}
                        >
                          <Text style={[styles.textBold, { fontSize: 8 }]}>
                            Componente
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "25%",
                            padding: "4pt",
                            borderRight: "1pt solid black",
                          }}
                        >
                          <Text style={[styles.textBold, { fontSize: 8 }]}>
                            Instrumento
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "15%",
                            padding: "4pt",
                            borderRight: "1pt solid black",
                          }}
                        >
                          <Text style={[styles.textBold, { fontSize: 8 }]}>
                            Semana
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "35%",
                            padding: "4pt",
                          }}
                        >
                          <Text style={[styles.textBold, { fontSize: 8 }]}>
                            Instrucciones
                          </Text>
                        </View>
                      </View>

                      {/* Filas de datos */}
                      {data.evaluacionAprendizaje.planEvaluacion.map(
                        (item, idx) => (
                          <View
                            key={idx}
                            style={{
                              flexDirection: "row",
                              borderBottom:
                                idx <
                                data.evaluacionAprendizaje.planEvaluacion!
                                  .length -
                                  1
                                  ? "1pt solid black"
                                  : "none",
                            }}
                          >
                            <View
                              style={{
                                width: "25%",
                                padding: "4pt",
                                borderRight: "1pt solid black",
                              }}
                            >
                              <Text style={{ fontSize: 8 }}>
                                {item.componenteNombre}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "25%",
                                padding: "4pt",
                                borderRight: "1pt solid black",
                              }}
                            >
                              <Text style={{ fontSize: 8 }}>
                                {item.instrumentoNombre}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "15%",
                                padding: "4pt",
                                borderRight: "1pt solid black",
                              }}
                            >
                              <Text style={{ fontSize: 8 }}>{item.semana}</Text>
                            </View>
                            <View
                              style={{
                                width: "35%",
                                padding: "4pt",
                              }}
                            >
                              <Text style={{ fontSize: 8 }}>
                                {item.instrucciones || "-"}
                              </Text>
                            </View>
                          </View>
                        ),
                      )}
                    </View>
                  )}
              </View>
            )}

            {/* Mantener compatibilidad con estructura antigua (si no hay formulaEvaluacion) */}
            {!data.evaluacionAprendizaje.formulaEvaluacion && (
              <View>
                {/* Descripción del promedio final */}
                {data.evaluacionAprendizaje.descripcion && (
                  <Text
                    style={[styles.text, { marginTop: 6, marginBottom: 4 }]}
                  >
                    {data.evaluacionAprendizaje.descripcion}
                  </Text>
                )}

                {/* Fórmula PF */}
                {data.evaluacionAprendizaje.formulaPF && (
                  <Text
                    style={[
                      styles.text,
                      {
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                        marginBottom: 6,
                      },
                    ]}
                  >
                    {data.evaluacionAprendizaje.formulaPF}
                  </Text>
                )}

                {/* Componentes PF (Donde:) */}
                {data.evaluacionAprendizaje.componentesPF &&
                  data.evaluacionAprendizaje.componentesPF.length > 0 && (
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.text}>Donde:</Text>
                      {data.evaluacionAprendizaje.componentesPF.map(
                        (comp, idx) => (
                          <Text
                            key={idx}
                            style={[styles.text, { marginLeft: 10 }]}
                          >
                            {comp.codigo} = {comp.descripcion}
                          </Text>
                        ),
                      )}
                    </View>
                  )}

                {/* Descripción PE */}
                {data.evaluacionAprendizaje.descripcionPE && (
                  <Text style={[styles.text, { marginBottom: 4 }]}>
                    {data.evaluacionAprendizaje.descripcionPE}
                  </Text>
                )}

                {/* Fórmula PE */}
                {data.evaluacionAprendizaje.formulaPE && (
                  <Text
                    style={[
                      styles.text,
                      {
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                        marginBottom: 6,
                      },
                    ]}
                  >
                    {data.evaluacionAprendizaje.formulaPE}
                  </Text>
                )}

                {/* Componentes PE (Donde:) */}
                {data.evaluacionAprendizaje.componentesPE &&
                  data.evaluacionAprendizaje.componentesPE.length > 0 && (
                    <View style={{ marginBottom: 4 }}>
                      <Text style={styles.text}>Donde:</Text>
                      {data.evaluacionAprendizaje.componentesPE.map(
                        (comp, idx) => (
                          <Text
                            key={idx}
                            style={[styles.text, { marginLeft: 10 }]}
                          >
                            {comp.codigo} = {comp.descripcion}
                          </Text>
                        ),
                      )}
                    </View>
                  )}
              </View>
            )}
          </View>
        )}

        {/* VIII. FUENTES DE CONSULTA */}
        {data.fuentes && data.fuentes.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>VIII. FUENTES DE CONSULTA</Text>

            {/* Agrupar por tipo */}
            {["LIBRO", "ARTICULO", "WEB", "OTRO"].map((tipo) => {
              const fuentesPorTipo = data.fuentes.filter(
                (f) => f.tipo === tipo,
              );
              if (fuentesPorTipo.length === 0) return null;

              return (
                <View key={tipo} style={{ marginTop: 4 }}>
                  <Text style={styles.textBold}>
                    {tipo === "LIBRO"
                      ? "Bibliograficas"
                      : tipo === "ARTICULO"
                        ? "Artículos"
                        : tipo === "WEB"
                          ? "Electronicas"
                          : "Otros"}
                  </Text>
                  {fuentesPorTipo.map((fuente, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      • {fuente.autores} ({fuente.anio || "s.f."}).{" "}
                      {fuente.titulo}. {fuente.editorial || ""}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* IX. APORTE DE LA ASIGNATURA AL LOGRO DE RESULTADOS */}
        {data.aportesResultadosPrograma &&
          data.aportesResultadosPrograma.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>
                IX. APORTE DE LA ASIGNATURA AL LOGRO DE RESULTADOS
              </Text>

              <Text style={[styles.text, { marginTop: 6, marginBottom: 8 }]}>
                El aporte de la asignatura al logro de los Resultados del
                Estudiante (
                <Text style={styles.textItalic}>Student Outcomes</Text>) en la
                formación del graduado en Ingeniería de Computación y Sistemas,
                se establece en la tabla siguiente:
              </Text>

              <Text style={[styles.text, { marginBottom: 6 }]}>
                <Text style={styles.textBold}>K</Text> = clave{" "}
                <Text style={styles.textBold}>R</Text> = relacionado{" "}
                <Text style={styles.textBold}>Recuadro vacío</Text> = no aplica
              </Text>

              {/* Tabla de aportes */}
              <View
                style={{
                  border: "1pt solid black",
                  marginTop: 4,
                }}
              >
                {/* Fila de encabezado */}
                <View
                  style={{
                    flexDirection: "row",
                    borderBottom: "1pt solid black",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <View
                    style={{
                      width: "8%",
                      padding: "4pt",
                      borderRight: "1pt solid black",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={[styles.textBold, { fontSize: 8 }]}>#</Text>
                  </View>
                  <View
                    style={{
                      width: "77%",
                      padding: "4pt",
                      borderRight: "1pt solid black",
                    }}
                  >
                    <Text style={[styles.textBold, { fontSize: 8 }]}>
                      RESULTADO DEL ESTUDIANTE
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      padding: "4pt",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={[styles.textBold, { fontSize: 8 }]}>
                      APORTE
                    </Text>
                  </View>
                </View>

                {/* Filas de datos */}
                {data.aportesResultadosPrograma.map((aporte, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      borderBottom:
                        idx < data.aportesResultadosPrograma.length - 1
                          ? "1pt solid black"
                          : "none",
                    }}
                  >
                    <View
                      style={{
                        width: "8%",
                        padding: "6pt 4pt",
                        borderRight: "1pt solid black",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 8 }}>
                        {aporte.resultadoCodigo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "77%",
                        padding: "6pt 8pt",
                        borderRight: "1pt solid black",
                      }}
                    >
                      <Text style={{ fontSize: 8, lineHeight: 1.4 }}>
                        {aporte.resultadoDescripcion}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "15%",
                        padding: "6pt 4pt",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={[
                          aporte.aporteValor ? styles.textBold : {},
                          { fontSize: 8 },
                        ]}
                      >
                        {aporte.aporteValor || ""}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
      </Page>
    </Document>
  );
}
