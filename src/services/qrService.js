import fetchWithAuth from "./api";

const qrService = {
  // Generar QR para un torneo (devuelve imagen)
  generarQR: async (torneoId, diasValidez = 7) => {
    const response = await fetchWithAuth("/qr/generar", {
      method: "POST",
      body: JSON.stringify({
        torneoID: torneoId,
        diasValidez: diasValidez,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al generar QR");
    }

    // La respuesta es una imagen PNG
    const blob = await response.blob();
    return blob;
  },

  // Validar un código QR
  validarQR: async (codigoUnico) => {
    const response = await fetchWithAuth(`/qr/${codigoUnico}/validar`);
    return response.json();
  },
};

export default qrService;
