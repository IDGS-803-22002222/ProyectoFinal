// src/services/torneosService.js
import fetchWithAuth from "./api";

const torneosService = {
  getTorneos: async () => {
    const response = await fetchWithAuth("/Torneos");
    return response.json();
  },

  getTorneo: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}`);
    return response.json();
  },

  createTorneo: async (torneo) => {
    const response = await fetchWithAuth("/Torneos", {
      method: "POST",
      body: JSON.stringify(torneo),
    });
    return response.json();
  },

  updateTorneo: async (id, torneo) => {
    const response = await fetchWithAuth(`/Torneos/${id}`, {
      method: "PUT",
      body: JSON.stringify(torneo),
    });
    return response.json();
  },

  getEquiposInscritos: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}/equipos`);
    return response.json();
  },

  inscribirEquipo: async (torneoId, equipoId) => {
    const response = await fetchWithAuth(`/Torneos/${torneoId}/inscribir`, {
      method: "POST",
      body: JSON.stringify({ equipoID: equipoId }),
    });
    return response.json();
  },

  getTablaPosiciones: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}/tabla-posiciones`);
    return response.json();
  },

  getGoleadores: async (id) => {
    const response = await fetchWithAuth(`/Torneos/${id}/goleadores`);
    return response.json();
  },

  // Nuevo: Obtener detalles completos del torneo
  getDetallesTorneo: async (id) => {
    try {
      const [torneo, equipos, tabla, goleadores, partidos] = await Promise.all([
        torneosService.getTorneo(id),
        torneosService.getEquiposInscritos(id),
        torneosService.getTablaPosiciones(id),
        torneosService.getGoleadores(id),
        fetch(`https://localhost:7260/api/Partidos?torneoId=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((r) => r.json()),
      ]);

      return {
        torneo,
        estadisticas: {
          equiposInscritos: equipos.length,
          partidosJugados: partidos.filter((p) => p.estatus === "Finalizado")
            .length,
          partidosPendientes: partidos.filter((p) => p.estatus === "Programado")
            .length,
          partidosTotales: partidos.length,
          goleadorLider: goleadores[0]?.nombre || "N/A",
          golesLider: goleadores[0]?.goles || 0,
        },
        equipos,
        tabla,
        goleadores,
      };
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      throw error;
    }
  },
};

export default torneosService;
