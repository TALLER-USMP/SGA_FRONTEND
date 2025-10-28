# PR: Fix & demo NineStep (Aportes) — Draft

Resumen breve
------------
Este PR contiene correcciones y mejoras para el componente `NineStep` (paso 8: "Aportes de la asignatura"). Además incluye artefactos de desarrollo para facilitar la revisión local: un mock backend y una ruta demo que permite abrir directamente la vista NineStep.

Cambios principales
------------------
- apps/dashboard/src/components/syllabus-process/NineStep.tsx
  - Corregidos errores de TypeScript/JSX y mejoras de UX (toast de confirmación, contador y redirección a `/mis-asignaciones`).
  - Validación cliente que comprueba que el curso pertenece al docente autenticado (solo dev; el servidor debe validar también en producción).
  - Actualización local del estado de la asignación a `ANALIZANDO` tras el envío (utiliza `updateLocalAssignmentStatus`).

- apps/dashboard/src/hooks/api/AssignmentsQuery.ts
  - Fallback local (localStorage) para desarrollo cuando el backend no está disponible.

- apps/dashboard/src/pages/MyAssignments.tsx
  - Seed de datos demo (solo dev) para mostrar asignaciones sin backend real.

- tools/mock-backend/server.js
  - Mock backend minimal que responde a los endpoints usados por el frontend: `/api/auth/me`, `/api/syllabus/:id/aportes-resultados`, `/api/syllabus/:id/contribution`, `/api/assignments`.

- apps/dashboard/src/pages/NineStepDemo.tsx (nuevo)
  - Página demo para abrir directamente `NineStep` con `?id=123&codigo=TALLER_PROY`.

Qué revisar / foco del PR
------------------------
- Lógica de negocio en `NineStep.tsx` (construcción del payload y validaciones client-side).
- Efectos secundarios: actualizaciones a localStorage usadas como fallback/dev.
- UI: accesibilidad y estilos del toast y selects.

Notas IMPORTANTES antes de merge
--------------------------------
Estos cambios incluyen artefactos de desarrollo que deben revisarse antes de merge a `main`/`master`:

- `tools/mock-backend/server.js` es un mock local **de desarrollo**. Recomendación: moverlo a una carpeta `dev/` o guardarlo tras una feature-flag antes de merge, o eliminarlo si el backend real está disponible.
- Se añadieron fallbacks y seed en localStorage (`assignments_mock`). El comportamiento de persistencia real debe manejarlo el backend; elimina estos fallbacks en el PR final si ya hay backend.
- La ruta `/nine-step-demo` está pensada solo para desarrollo y prueba rápida. Eliminar antes de merge si no es necesaria.

Cómo ejecutar localmente (rápido)
--------------------------------
1. Instala dependencias (si aún no lo hiciste):

```powershell
npm install
```

2. Arranca el mock backend (opcional si tienes backend):

```powershell
node tools/mock-backend/server.js
# debe escuchar en http://localhost:7071
```

3. Arranca la app `dashboard` en modo dev:

```powershell
npm run dev --workspace=dashboard
```

4. Abrir la demo (opcional):

http://localhost:5173/nine-step-demo?id=123&codigo=TALLER_PROY

5. Flujo para probar:
 - En la demo, modifica los selects K/R en varias filas.
 - Pulsa "Siguiente" desde el StepControls para ejecutar `validateAndNext`.
 - Revisa Network → POST /api/syllabus/123/contribution y la aparición del toast.

Checklist para quien revise
--------------------------
- [ ] ¿La validación cliente es correcta y no rompe caso multi-usuario? (Se recomienda revisar el código que usa `assignments_mock` antes de merge)
- [ ] ¿El toast y la redirección cumplen la UX solicitada?
- [ ] ¿El código es lo suficientemente genérico y sin duplicados? (hay cierta duplicación con hooks API que se pueden refactorizar)

Pasos sugeridos para merge final
-------------------------------
1. Eliminar/aislar `tools/mock-backend/server.js` (o marcarlo como `dev-only`).
2. Quitar seed/fallbacks en `AssignmentsQuery` y `MyAssignments`.
3. Reemplazar `NineStepDemo` por tests de integración / e2e que verifiquen el flujo.
4. Ejecutar linters/tests y revisar el build.

Notas finales
------------
Si quieres, puedo crear una rama y aplicar los cambios en un commit listo para PR y dejar un mensaje sugerido. También puedo preparar el diff para revertir las partes dev-only antes del merge.

-- End of note
