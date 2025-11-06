import fetchWithAuth from "./api";

const canchasService = {
  // Obtener todas las canchas activas
  getCanchas: async () => {
    const response = await fetchWithAuth("/Canchas");
    return response.json();
  },

  // Obtener una cancha específica
  getCancha: async (id) => {
    const response = await fetchWithAuth(`/Canchas/${id}`);
    return response.json();
  },

  // Crear una nueva cancha (solo admin)
  createCancha: async (cancha) => {
    const response = await fetchWithAuth("/Canchas", {
      method: "POST",
      body: JSON.stringify(cancha),
    });
    return response.json();
  },

  // Actualizar cancha existente (solo admin)
  updateCancha: async (id, cancha) => {
    const response = await fetchWithAuth(`/Canchas/${id}`, {
      method: "PUT",
      body: JSON.stringify(cancha),
    });
    return response.json();
  },
};

export default canchasService;
