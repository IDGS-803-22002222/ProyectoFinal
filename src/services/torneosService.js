import fetchWithAuth from "./api";

const torneosService = {
  // Obtener todos los torneos
  getTorneos: async () => {
    const response = await fetchWithAuth("/Torneos");
    return response.json();
  },

  // Obtener un torneo específico
  getTorneo: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}`);
    return response.json();
  },

  // Crear torneo (solo admin)
  createTorneo: async (torneo) => {
    const response = await fetchWithAuth("/Torneos", {
      method: "POST",
      body: JSON.stringify(torneo),
    });
    return response.json();
  },

  // Actualizar torneo
  updateTorneo: async (id, torneo) => {
    const response = await fetchWithAuth(`/Torneos/${id}`, {
      method: "PUT",
      body: JSON.stringify(torneo),
    });
    return response.json();
  },

  // Obtener equipos inscritos
  getEquiposInscritos: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}/equipos`);
    return response.json();
  },

  // Inscribir equipo
  inscribirEquipo: async (torneoId, equipoId) => {
    const response = await fetchWithAuth(`/Torneos/${torneoId}/inscribir`, {
      method: "POST",
      body: JSON.stringify({ equipoID: equipoId }),
    });
    return response.json();
  },

  // Tabla de posiciones
  getTablaPosiciones: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}/tabla-posiciones`);
    return response.json();
  },

  // Goleadores
  getGoleadores: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}/goleadores`);
    return response.json();
  },
};

export default torneosService;
