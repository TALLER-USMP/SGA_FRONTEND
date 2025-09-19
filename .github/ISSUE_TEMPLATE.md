---
name: Historia de Usuario
about: Plantilla para registrar historias de usuario con criterios de aceptación y tareas
title: "HU.X.X - [Título de la historia]"
labels: ["user-story", "backlog"]
assignees: []
---

# 📌 Historia de Usuario

**Como** [rol del usuario]  
**Quiero** [acción a realizar]  
**Para** [beneficio/valor esperado]  

---

## 🎯 Criterios de Aceptación  

📌 Usa el formato **DADO / CUANDO / ENTONCES**  

- **Escenario 1:**  
  DADO QUE [...]  
  CUANDO [...]  
  ENTONCES [...]  

- **Escenario 2:**  
  DADO QUE [...]  
  CUANDO [...]  
  ENTONCES [...]  

---

## 💬 Detalles de Conversación  
_Agrega reglas de negocio, notas o validaciones importantes._  
- La información de los campos es obligatoria y no puede estar vacía.  
- Cuando se cambia el estado de la asignatura se oculta el botón **Editar** y el ícono de **Visualizar**.  

---

## 🚦 Prioridad  
- [ ] CRÍTICA  
- [ ] ALTA  
- [ ] MEDIA  
- [ ] BAJA  

---

## 🧮 Story Points  
`[ejemplo: 3 | 5 | 8]`  

---

## ✅ Tareas  
Lista de subtareas necesarias (puedes vincular issues con `#ID`).  

- [ ] Crear modelo y API para obtener sílabo completo `GET /api/silabo/{id}` (#10)  
- [ ] Crear modelo y API para editar datos generales `PUT /api/silabo/{id}/datos-generales` (#11)  
- [ ] Maquetar paso 1 y validar sus campos - integrar con el backend (#29)  
- [ ] Maquetar paso 2 y validar sus campos - integrar con el backend (#28)  
