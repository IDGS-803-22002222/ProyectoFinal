import fetchWithAuth from "./api";

const jugadoresService = {
  // Obtener jugador
  getJugador: async (id) => {
    const response = await fetchWithAuth(`/Jugadores/${id}`);
    return response.json();
  },

  // Crear jugador
  createJugador: async (jugador) => {
    const response = await fetchWithAuth("/Jugadores", {
      method: "POST",
      body: JSON.stringify(jugador),
    });
    return response.json();
  },

  // Actualizar jugador
  updateJugador: async (id, jugador) => {
    const response = await fetchWithAuth(`/Jugadores/${id}`, {
      method: "PUT",
      body: JSON.stringify(jugador),
    });
    return response.json();
  },

  // Eliminar jugador
  deleteJugador: async (id) => {
    const response = await fetchWithAuth(`/Jugadores/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Subir documento
  subirDocumento: async (id, documento) => {
    const response = await fetchWithAuth(`/Jugadores/${id}/documentos`, {
      method: "POST",
      body: JSON.stringify(documento),
    });
    return response.json();
  },

  // Obtener documentos
  getDocumentos: async (id) => {
    const response = await fetchWithAuth(`/Jugadores/${id}/documentos`);
    return response.json();
  },

  // Obtener sanciones
  getSanciones: async (id) => {
    const response = await fetchWithAuth(`/Jugadores/${id}/sanciones`);
    return response.json();
  },
};

export default jugadoresService;
