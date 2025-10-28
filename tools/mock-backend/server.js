const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const PORT = process.env.PORT || 7071;

function sendJSON(res, code, obj) {
  const payload = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname.replace(/\/+$/,'');
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // Collect body
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (chunk) => {
    buffer += decoder.write(chunk);
  });
  req.on('end', () => {
    buffer += decoder.end();

    try {
      // Routes
      // POST /api/auth/me
      if (method === 'POST' && path === '/api/auth/me') {
        // if body contains token, respond with user
        sendJSON(res, 200, { user: { id: 1, name: 'Norma Leon', role: 'docente' } });
        return;
      }

      // GET /api/syllabus/:id/aportes-resultados
      const syllabusMatch = path.match(/^\/api\/syllabus\/(\d+)\/aportes-resultados$/);
      if (method === 'GET' && syllabusMatch) {
        const id = syllabusMatch[1];
        const aportes = [
          { silabo_id: Number(id), resultado_programa_codigo: '1', resultado_programa_descripcion: 'Analizar un sistema complejo de computacion', aporte_valor: '' },
          { silabo_id: Number(id), resultado_programa_codigo: '2', resultado_programa_descripcion: 'Disenar implementar y evaluar', aporte_valor: '' },
          { silabo_id: Number(id), resultado_programa_codigo: '3', resultado_programa_descripcion: 'Comunicacion efectiva', aporte_valor: '' },
          { silabo_id: Number(id), resultado_programa_codigo: '4', resultado_programa_descripcion: 'Responsabilidad profesional', aporte_valor: '' },
          { silabo_id: Number(id), resultado_programa_codigo: '5', resultado_programa_descripcion: 'Trabajo en equipo', aporte_valor: '' },
          { silabo_id: Number(id), resultado_programa_codigo: '6', resultado_programa_descripcion: 'Brindar soporte', aporte_valor: '' },
          { silabo_id: Number(id), resultado_programa_codigo: '7', resultado_programa_descripcion: 'Aprendizaje continuo', aporte_valor: '' },
        ];
        sendJSON(res, 200, { aportes });
        return;
      }

      // POST /api/syllabus/:id/contribution
      const contributionMatch = path.match(/^\/api\/syllabus\/(\d+)\/contribution$/);
      if (method === 'POST' && contributionMatch) {
        // pretend to accept the contribution and return success
        sendJSON(res, 200, { success: true, message: 'Contribuciones recibidas' });
        return;
      }

      // GET /api/assignments/?idDocente=NN
      if (method === 'GET' && path === '/api/assignments') {
        const q = parsed.query || {};
        const idDocente = q.idDocente || '1';
        const assignments = [
          { cursoCodigo: 'TALLER_PROY', cursoNombre: 'Taller de Proyectos', estadoRevision: 'ASIGNADO', docenteId: Number(idDocente), syllabusId: 123 },
          { cursoCodigo: 'ALG2', cursoNombre: 'Algoritmos 2', estadoRevision: 'ANALIZANDO', docenteId: Number(idDocente), syllabusId: 124 },
          { cursoCodigo: 'INV_SYS', cursoNombre: 'Investigacion de Sistemas de informacion', estadoRevision: 'APROBADO', docenteId: Number(idDocente), syllabusId: 125 },
        ];
        sendJSON(res, 200, assignments);
        return;
      }

      // Default 404
      sendJSON(res, 404, { error: 'Not found' });
    } catch (e) {
      sendJSON(res, 500, { error: String(e) });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
