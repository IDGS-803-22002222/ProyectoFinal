import fetchWithAuth from "./api";

const authService = {
  // Login
  login: async (email, password) => {
    const response = await fetchWithAuth("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Registro con QR
  registerWithQR: async (data) => {
    const response = await fetchWithAuth("/Auth/register-with-qr", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Crear admin temporal (solo para pruebas)
  crearAdminTemporal: async () => {
    const response = await fetchWithAuth("/Auth/crear-admin-temporal", {
      method: "POST",
    });
    return response.json();
  },
};

export default authService;
