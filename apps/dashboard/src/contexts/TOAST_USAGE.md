# Sistema de Notificaciones Toast

Sistema de notificaciones toast profesional y reutilizable para toda la aplicación.

## 🎨 Características

- ✅ 4 tipos de notificaciones: `success`, `error`, `warning`, `info`
- ✅ Animaciones suaves de entrada
- ✅ Auto-cierre configurable
- ✅ Botón de cierre manual
- ✅ Múltiples toasts simultáneos
- ✅ Posicionamiento fijo en la esquina superior derecha
- ✅ Diseño responsive y accesible
- ✅ TypeScript completo

## 📦 Instalación

El sistema ya está configurado en `App.tsx`:

```tsx
import { ToastProvider } from "./contexts/ToastContext";

<ToastProvider>{/* Tu aplicación */}</ToastProvider>;
```

## 🚀 Uso Básico

### Importar el hook

```tsx
import { useToast } from "../contexts/ToastContext";
// o desde hooks
import { useToast } from "../hooks/useToast";
```

### Usar en un componente

```tsx
export default function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.success(
      "¡Operación exitosa!",
      "Los datos se guardaron correctamente",
    );
  };

  return <button onClick={handleClick}>Guardar</button>;
}
```

## 📚 API del Hook

### Métodos disponibles

#### `toast.success(title, message?, duration?)`

Muestra una notificación de éxito (verde).

```tsx
toast.success("¡Guardado!", "Los cambios se guardaron correctamente");
toast.success("¡Listo!", "Operación completada", 3000); // 3 segundos
```

#### `toast.error(title, message?, duration?)`

Muestra una notificación de error (rojo).

```tsx
toast.error("Error", "No se pudo conectar con el servidor");
toast.error("Error de validación", "Por favor completa todos los campos");
```

#### `toast.warning(title, message?, duration?)`

Muestra una notificación de advertencia (amarillo).

```tsx
toast.warning("Atención", "Esta acción no se puede deshacer");
toast.warning("Campos incompletos", "Algunos campos están vacíos");
```

#### `toast.info(title, message?, duration?)`

Muestra una notificación informativa (azul).

```tsx
toast.info("Información", "Los cambios se aplicarán en 5 minutos");
toast.info("Actualización disponible", "Hay una nueva versión disponible");
```

#### `toast.showToast(options)`

Método genérico para mostrar cualquier tipo de toast.

```tsx
toast.showToast({
  type: "success",
  title: "¡Éxito!",
  message: "Operación completada",
  duration: 5000, // 5 segundos (default)
});
```

## 🎯 Ejemplos de Uso

### Ejemplo 1: Formulario con validación

```tsx
const handleSubmit = async () => {
  if (!formData.name) {
    toast.error("Campo requerido", "El nombre es obligatorio");
    return;
  }

  try {
    await saveData(formData);
    toast.success("¡Guardado!", "Los datos se guardaron correctamente");
  } catch (error) {
    toast.error("Error al guardar", "Ocurrió un error. Intenta nuevamente.");
  }
};
```

### Ejemplo 2: Operación asíncrona

```tsx
const handleDelete = async (id: string) => {
  try {
    await deleteItem(id);
    toast.success("Eliminado", "El elemento se eliminó correctamente");
  } catch (error) {
    toast.error("Error", "No se pudo eliminar el elemento");
  }
};
```

### Ejemplo 3: Advertencia antes de acción

```tsx
const handleReset = () => {
  toast.warning(
    "¿Estás seguro?",
    "Esta acción eliminará todos los datos del formulario",
  );
  // Aquí podrías mostrar un modal de confirmación
};
```

### Ejemplo 4: Información al usuario

```tsx
useEffect(() => {
  if (isFirstVisit) {
    toast.info(
      "Bienvenido",
      "Completa tu perfil para obtener una mejor experiencia",
    );
  }
}, [isFirstVisit]);
```

### Ejemplo 5: Toast sin mensaje (solo título)

```tsx
toast.success("¡Guardado!");
toast.error("Error al cargar datos");
toast.warning("Sesión por expirar");
toast.info("Cargando...");
```

### Ejemplo 6: Duración personalizada

```tsx
// Toast que dura 10 segundos
toast.success("Operación larga completada", "Detalles...", 10000);

// Toast que dura 2 segundos
toast.info("Cargando...", undefined, 2000);

// Toast que no se cierra automáticamente
toast.error("Error crítico", "Contacta al administrador", 0);
```

## 🎨 Tipos de Toast

| Tipo      | Color    | Icono | Uso                  |
| --------- | -------- | ----- | -------------------- |
| `success` | Verde    | ✓     | Operaciones exitosas |
| `error`   | Rojo     | ✕     | Errores y fallos     |
| `warning` | Amarillo | ⚠    | Advertencias         |
| `info`    | Azul     | ℹ    | Información general  |

## ⚙️ Configuración

### Duración por defecto

Por defecto, los toasts se cierran automáticamente después de **5 segundos** (5000ms).

### Posición

Los toasts aparecen en la **esquina superior derecha** de la pantalla.

### Animación

Los toasts tienen una animación de entrada suave desde la derecha.

## 🔧 Personalización

Si necesitas personalizar el comportamiento, puedes modificar:

- **Duración**: Pasa el tercer parámetro en milisegundos
- **Posición**: Modifica la clase CSS en `ToastContainer`
- **Estilos**: Ajusta los colores en `getToastStyles()`

## 📱 Responsive

El sistema de toasts es completamente responsive:

- En desktop: Ancho máximo de 400px
- En mobile: Se adapta al ancho de la pantalla con padding

## ♿ Accesibilidad

- Usa `role="alert"` para lectores de pantalla
- Botón de cierre con `aria-label`
- Colores con suficiente contraste
- Iconos descriptivos

## 🐛 Troubleshooting

### El toast no aparece

Verifica que `ToastProvider` esté envolviendo tu aplicación en `App.tsx`.

### TypeScript errors

Asegúrate de importar el hook correctamente:

```tsx
import { useToast } from "../contexts/ToastContext";
```

### Múltiples toasts se superponen

Esto es normal. Los toasts se apilan verticalmente con un gap de 12px.

## 📝 Notas

- Los toasts se pueden cerrar manualmente haciendo click en la X
- Puedes tener múltiples toasts activos simultáneamente
- El sistema maneja automáticamente la limpieza de toasts cerrados
- No hay límite en el número de toasts que puedes mostrar
