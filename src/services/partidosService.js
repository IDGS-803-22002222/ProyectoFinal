import fetchWithAuth from "./api";

const partidosService = {
  // Obtener todos los partidos
  getPartidos: async (torneoId = null) => {
    const url = torneoId ? `/Partidos?torneoId=${torneoId}` : "/Partidos";
    const response = await fetchWithAuth(url);
    return response.json();
  },

  // Obtener un partido
  getPartido: async (id) => {
    const response = await fetchWithAuth(`/Partidos/${id}`);
    return response.json();
  },

  // Crear partido (admin)
  createPartido: async (partido) => {
    const response = await fetchWithAuth("/Partidos", {
      method: "POST",
      body: JSON.stringify(partido),
    });
    return response.json();
  },

  // Mis partidos
  getMisPartidos: async () => {
    const response = await fetchWithAuth("/Partidos/mis-partidos");
    return response.json();
  },

  // Partidos para arbitrar
  getPartidosArbitrar: async () => {
    const response = await fetchWithAuth("/Partidos/arbitrar");
    return response.json();
  },

  // Iniciar partido (árbitro)
  iniciarPartido: async (id) => {
    const response = await fetchWithAuth(`/Partidos/${id}/iniciar`, {
      method: "POST",
    });
    return response.json();
  },

  // Finalizar partido (árbitro)
  finalizarPartido: async (id) => {
    const response = await fetchWithAuth(`/Partidos/${id}/finalizar`, {
      method: "POST",
    });
    return response.json();
  },

  // Registrar gol
  registrarGol: async (id, data) => {
    const response = await fetchWithAuth(`/Partidos/${id}/eventos/gol`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Registrar tarjeta
  registrarTarjeta: async (id, data) => {
    const response = await fetchWithAuth(`/Partidos/${id}/eventos/tarjeta`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Reportar incidente
  reportarIncidente: async (id, data) => {
    const response = await fetchWithAuth(`/Partidos/${id}/incidentes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Obtener eventos
  getEventos: async (id) => {
    const response = await fetchWithAuth(`/Partidos/${id}/eventos`);
    return response.json();
  },
};

export default partidosService;
