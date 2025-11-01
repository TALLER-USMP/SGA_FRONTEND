# 📄 Generación de PDF de Sílabos

Sistema completo para generar PDFs de sílabos desde el frontend usando plantillas HTML y datos del backend.

## 🎯 Características

- ✅ Generación de PDF desde plantillas HTML
- ✅ Obtención automática de datos desde el endpoint `/api/syllabus/{id}/complete`
- ✅ Reemplazo dinámico de placeholders con datos reales
- ✅ Vista previa HTML antes de generar PDF
- ✅ Notificaciones de éxito/error con Sonner
- ✅ Componente de botón reutilizable
- ✅ Hook personalizado para uso avanzado

## 📦 Instalación

Las dependencias ya están instaladas:

```bash
npm install html2pdf.js
npm install --save-dev @types/html2pdf.js
```

## 🚀 Uso Rápido

### Opción 1: Usar el componente de botón

```tsx
import { DownloadPDFButton } from "@/features/syllabus";

function MyPage() {
  return (
    <div>
      <h1>Mi Sílabo</h1>
      <DownloadPDFButton syllabusId={1} />
    </div>
  );
}
```

### Opción 2: Usar el hook directamente

```tsx
import { useSyllabusPDF } from "@/features/syllabus";

function MyComponent() {
  const { generatePDF, isGenerating, error } = useSyllabusPDF({
    onSuccess: () => alert("PDF generado!"),
    onError: (err) => console.error(err),
  });

  return (
    <button onClick={() => generatePDF(1)} disabled={isGenerating}>
      {isGenerating ? "Generando..." : "Descargar PDF"}
    </button>
  );
}
```

## 🔧 API del Componente

### `<DownloadPDFButton />`

| Prop           | Tipo                                    | Default                                              | Descripción                   |
| -------------- | --------------------------------------- | ---------------------------------------------------- | ----------------------------- |
| `syllabusId`   | `number`                                | **requerido**                                        | ID del sílabo a descargar     |
| `templateName` | `string`                                | `"8.Taller-de-Proyectos-2025-II (1)-converted.html"` | Nombre de la plantilla HTML   |
| `variant`      | `"primary" \| "secondary" \| "outline"` | `"primary"`                                          | Estilo del botón              |
| `showPreview`  | `boolean`                               | `false`                                              | Mostrar botón de vista previa |
| `className`    | `string`                                | `""`                                                 | Clases CSS adicionales        |

### Hook `useSyllabusPDF()`

```tsx
const {
  generatePDF,      // (syllabusId: number, filename?: string) => Promise<void>
  previewHTML,      // (syllabusId: number) => Promise<void>
  isGenerating,     // boolean
  error,            // Error | null
} = useSyllabusPDF({
  templateName?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
});
```

## 📁 Estructura de Archivos

```
apps/dashboard/src/features/syllabus/
├── components/
│   ├── download-pdf-button.tsx       # Componente de botón
│   └── syllabus-pdf-example.tsx      # Ejemplo de uso
├── hooks/
│   └── use-syllabus-pdf.ts           # Hook principal
├── services/
│   └── syllabus-pdf-service.ts       # Servicio de API y plantillas
├── types/
│   └── complete-syllabus.ts          # Tipos TypeScript
└── index.ts                          # Exports públicos

apps/dashboard/public/assets/
└── 8.Taller-de-Proyectos-2025-II (1)-converted.html  # Plantilla HTML
```

## 🎨 Personalizar Plantilla HTML

### 1. Crear nueva plantilla

Copia tu plantilla HTML a `public/assets/mi-plantilla.html`

### 2. Agregar placeholders

Reemplaza los valores estáticos con placeholders:

```html
<h1>{{nombreAsignatura}}</h1>
<p>Código: {{codigoAsignatura}}</p>
<p>Créditos: {{creditosTotales}}</p>
```

### 3. Actualizar el servicio

Edita `syllabus-pdf-service.ts` para agregar más reemplazos en el método `fillTemplate()`:

```typescript
fillTemplate(htmlTemplate: string, data: CompleteSyllabus): string {
  let filledHtml = htmlTemplate;

  // Agregar tus propios reemplazos
  filledHtml = filledHtml
    .replace(/{{miCampo}}/g, data.miCampo || "")
    .replace(/{{otroCampo}}/g, data.otroCampo || "");

  return filledHtml;
}
```

### 4. Usar la nueva plantilla

```tsx
<DownloadPDFButton syllabusId={1} templateName="mi-plantilla.html" />
```

## 🔍 Placeholders Disponibles

### Datos Generales

- `{{nombreAsignatura}}`
- `{{codigoAsignatura}}`
- `{{departamentoAcademico}}`
- `{{escuelaProfesional}}`
- `{{programaAcademico}}`
- `{{semestreAcademico}}`
- `{{tipoAsignatura}}`
- `{{modalidad}}`
- `{{ciclo}}`
- `{{requisitos}}`
- `{{creditosTeoria}}`, `{{creditosPractica}}`, `{{creditosTotales}}`
- `{{horasTeoria}}`, `{{horasPractica}}`, `{{horasTotales}}`
- `{{docentes}}`

### Contenido

- `{{sumilla}}`
- `{{competenciasCurso}}` - Lista HTML de competencias
- `{{componentesConceptuales}}` - Lista HTML
- `{{componentesProcedimentales}}` - Lista HTML
- `{{componentesActitudinales}}` - Lista HTML
- `{{resultadosAprendizaje}}` - Lista HTML
- `{{unidadesDidacticas}}` - Filas de tabla HTML
- `{{estrategiasMetodologicas}}`
- `{{recursosDidacticos}}` - Lista HTML
- `{{planEvaluacion}}` - Filas de tabla HTML
- `{{formulaEvaluacion}}`
- `{{fuentes}}` - Lista HTML con citas
- `{{aportesResultadosPrograma}}` - Filas de tabla HTML

## 🐛 Debugging

### Ver vista previa HTML

```tsx
<DownloadPDFButton syllabusId={1} showPreview={true} />
```

O usar el hook:

```tsx
const { previewHTML } = useSyllabusPDF();

<button onClick={() => previewHTML(1)}>Ver HTML</button>;
```

### Logs en consola

El hook muestra logs detallados:

- 📥 Obteniendo datos del sílabo...
- 📄 Cargando plantilla...
- ✏️ Llenando plantilla con datos...
- 🔄 Generando PDF...
- ✅ PDF generado exitosamente!

## ⚠️ Solución de Problemas

### Error: "No se encuentra la plantilla"

Asegúrate de que el archivo HTML esté en `public/assets/`

### Error: "Sílabo no encontrado"

Verifica que el ID del sílabo exista en el backend

### El PDF se ve mal

1. Revisa que los estilos CSS estén en el `<head>` del HTML
2. Ajusta las opciones de `html2canvas` en el hook
3. Usa `showPreview={true}` para ver el HTML antes de generar

### Placeholders no se reemplazan

Verifica que:

1. Los placeholders usen doble llave: `{{nombreCampo}}`
2. El campo exista en el tipo `CompleteSyllabus`
3. El reemplazo esté en el método `fillTemplate()`

## 📚 Ejemplos Adicionales

Ver `syllabus-pdf-example.tsx` para un ejemplo completo con UI.

## 🔗 Endpoints del Backend

El sistema usa el siguiente endpoint:

```
GET /api/syllabus/{id}/complete
```

Respuesta esperada según `CompleteSyllabus` type.
