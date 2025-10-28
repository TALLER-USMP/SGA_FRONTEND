# Pull Request - NineStep fixes & demo

Use this template for the draft PR so reviewers know what's included and what to focus on.

Summary
-------
Short description of the changes and why they're necessary.

Files changed
-------------
- `apps/dashboard/src/components/syllabus-process/NineStep.tsx`
- `apps/dashboard/src/hooks/api/AssignmentsQuery.ts`
- `apps/dashboard/src/pages/MyAssignments.tsx`
- `apps/dashboard/src/pages/NineStepDemo.tsx` (new, dev-only)
- `tools/mock-backend/server.js` (dev-only)

Checklist for author
--------------------
- [ ] I ran `npm run build --workspace=dashboard` and it completes without errors.
- [ ] I documented dev-only artifacts in `PR_NOTE_NineStep.md`.
- [ ] I added notes about what to revert before merging to production.

Checklist for reviewers
----------------------
- [ ] Verify the business logic in `NineStep.tsx` (payload, validation, side effects).
- [ ] Confirm there are no security issues (sensitive data leaked in localStorage, auth headers).
- [ ] Confirm dev-only files are clearly marked and safe to remove before merge.

How to run locally
-------------------
See `PR_NOTE_NineStep.md` for detailed run steps.

Notes
-----
If you want me to prepare a branch/commit with only the production-safe changes (removing mocks and demo route), I can do that as a follow-up.
## 📝 Descripción

_Describe brevemente qué funcionalidad o cambio incluye este PR_

---

## ✅ ¿Qué se incluye en este PR?

- [ ] Nueva funcionalidad Frontend
- [ ] Nueva funcionalidad Backend
- [ ] Caso de prueba
- [ ] Refactor / Ajuste
- [ ] Otro (especificar):

---

## 🧪 Cómo probarlo

_Pasos o comandos para validar este cambio localmente_

```bash
# ejemplo
npm install
npm run dev
```
