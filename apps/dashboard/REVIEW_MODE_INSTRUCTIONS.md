# Instrucciones para Agregar Botones de Revisión a los Pasos del Formulario

## Contexto

Se ha implementado un sistema de revisión de sílabos donde el coordinador puede revisar cada campo del formulario con botones de aprobación/rechazo/comentario.

## Componentes Creados

### 1. `ReviewModeContext` (`apps/dashboard/src/features/coordinator/contexts/review-mode-context.tsx`)
- Provee el contexto de modo revisión
- Hook: `useReviewMode()` retorna `{ isReviewMode, onFieldReview, onFieldComment }`

### 2. `ReviewFieldWrapper` (`apps/dashboard/src/features/coordinator/components/review-field-wrapper.tsx`)
- Componente wrapper que agrega botones de revisión a un campo
- Props:
  - `fieldId`: ID único del campo
  - `children`: El campo a envolver
  - `orientation`: "horizontal" | "vertical" (default: "horizontal")

### 3. `ReviewButtons` (`apps/dashboard/src/features/coordinator/components/review-buttons.tsx`)
- Botones de aprobación (✓), rechazo (✗) y comentario (💬)
- Incluye atributo `data-review-button="true"` para que no sean bloqueados por CSS

## CSS Implementado

En `apps/dashboard/src/index.css`:

```css
/* Bloquear todos los inputs, textareas y selects */
.syllabus-review-readonly input,
.syllabus-review-readonly textarea,
.syllabus-review-readonly select {
  pointer-events: none !important;
  background-color: #f3f4f6 !important;
  color: #6b7280 !important;
  cursor: not-allowed !important;
}

/* Bloquear TODOS los botones excepto los de revisión */
.syllabus-review-readonly button {
  pointer-events: none !important;
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

/* Permitir solo los botones de revisión */
.syllabus-review-readonly button[data-review-button="true"] {
  pointer-events: auto !important;
  opacity: 1 !important;
  cursor: pointer !important;
}
```

## Cómo Modificar un Paso para Agregar Botones de Revisión

### Paso 1: Importar el wrapper

```tsx
import { ReviewFieldWrapper } from "../../coordinator/components/review-field-wrapper";
```

### Paso 2: Envolver cada campo con ReviewFieldWrapper

**Antes:**
```tsx
<div className="mb-6">
  <div className="w-full h-12 rounded-md px-4 flex items-center text-lg bg-blue-50 border border-blue-100">
    {form.nombreAsignatura || "TALLER DE PROYECTOS"}
  </div>
</div>
```

**Después:**
```tsx
<ReviewFieldWrapper fieldId="nombreAsignatura" orientation="vertical">
  <div className="mb-6">
    <div className="w-full h-12 rounded-md px-4 flex items-center text-lg bg-blue-50 border border-blue-100">
      {form.nombreAsignatura || "TALLER DE PROYECTOS"}
    </div>
  </div>
</ReviewFieldWrapper>
```

### Paso 3: Aplicar a todos los campos

Cada input, textarea, select o grupo de campos debe estar envuelto en `ReviewFieldWrapper` con un `fieldId` único.

**Ejemplo para campos en grid:**
```tsx
{fields.map(([label, name]) => (
  <ReviewFieldWrapper key={name} fieldId={name} orientation="horizontal">
    <div className="grid grid-cols-[250px_24px_1fr] items-start gap-2 py-2 border-b last:border-b-0">
      <div className="text-sm text-gray-700 flex items-center">
        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded w-full text-center">
          {label}
        </div>
      </div>
      <div className="text-gray-400 flex items-center justify-left">-</div>
      <div className="pr-2">
        <input
          type="text"
          value={form[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          className="w-full rounded-md px-3 py-2 bg-gray-100 border border-gray-300"
        />
      </div>
    </div>
  </ReviewFieldWrapper>
))}
```

## Orientaciones

- **`horizontal`**: Botones a la derecha del campo (default)
  - Usar para campos en una sola línea
  - Los botones se alinean verticalmente con el campo

- **`vertical`**: Botones debajo del campo
  - Usar para campos de múltiples líneas (textareas)
  - Usar para grupos de campos complejos

## Notas Importantes

1. **Los botones solo aparecen en modo revisión**: Si `isReviewMode` es `false`, el wrapper no hace nada
2. **Todos los botones están bloqueados**: Excepto los que tienen `data-review-button="true"`
3. **Los controles de paso están ocultos**: El componente `StepControls` no se muestra en modo revisión
4. **El textarea de comentarios funciona**: Tiene `style={{ pointerEvents: 'auto' }}` para permitir escritura

## Pasos a Modificar

Todos los componentes de paso necesitan ser modificados:
- ✅ `first-step.tsx` - Datos Generales (ejemplo a continuación)
- ⏳ `second-step.tsx` - Sumilla
- ⏳ `third-step.tsx` - Competencias y Componentes
- ⏳ `fourth-step.tsx` - Unidades
- ⏳ `fifth-step.tsx` - Estrategias Metodológicas y Recursos Didácticos
- ⏳ `sixth-step.tsx` - Evaluación del Aprendizaje
- ⏳ `seventh-step.tsx` - Fuentes de Consulta
- ⏳ `eighth-step.tsx` - Aporte de la Asignatura

## Ejemplo Completo: Modificar FirstStep

Ver el archivo modificado en la siguiente sección...

