/**
 * data.js
 * Capa de datos: obtiene el catálogo de aplicaciones y las novedades
 * desde archivos JSON. Ningún dato de aplicaciones vive en el HTML:
 * para añadir, editar o quitar una app basta con editar data/apps.json.
 */

const KabertData = (() => {
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
      return await res.json();
    } catch (err) {
      console.error('[KabertData]', err.message);
      return [];
    }
  }

  const getApps = () => fetchJSON('data/apps.json');
  const getNews = () => fetchJSON('data/news.json');
  const getSeminars = () => fetchJSON('data/seminars.json');

  return { getApps, getNews, getSeminars };
})();
