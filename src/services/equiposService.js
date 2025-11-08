import fetchWithAuth from "./api";

const equiposService = {
  // Obtener todos los equipos
  getEquipos: async () => {
    const response = await fetchWithAuth("/Equipos");
    return response.json();
  },

  // Obtener un equipo
  getEquipo: async (id) => {
    const response = await fetchWithAuth(`/Equipos/${id}`);
    return response.json();
  },

  // Obtener mis equipos
  getMisEquipos: async () => {
    const response = await fetchWithAuth("/Equipos/mis-equipos");
    return response.json();
  },

  // Obtener jugadores de un equipo
  getJugadores: async (id) => {
    const response = await fetchWithAuth(`/Equipos/${id}/jugadores`);
    return response.json();
  },

  // Actualizar equipo
  updateEquipo: async (id, equipo) => {
    const response = await fetchWithAuth(`/Equipos/${id}`, {
      method: "PUT",
      body: JSON.stringify(equipo),
    });
    return response.json();
  },
  // Crear equipo (necesita endpoint en backend)
  createEquipo: async (equipo) => {
    const response = await fetchWithAuth("/Equipos", {
      method: "POST",
      body: JSON.stringify(equipo),
    });
    return response.json();
  },
};

export default equiposService;
