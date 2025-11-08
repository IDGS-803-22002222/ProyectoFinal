import { useState, useEffect } from "react";
import equiposService from "../../services/equiposService";
import qrService from "../../services/qrService";

const GestionEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const [formData, setFormData] = useState({
    nombreEquipo: "",
    colorUniformePrimario: "#374151",
    colorUniformeSecundario: "#1f2937",
    logoURL: "",
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [equiposData, torneosData] = await Promise.all([
        equiposService.getEquipos(),
        fetch("https://localhost:7260/api/Torneos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((r) => r.json()),
      ]);
      setEquipos(equiposData);
      setTorneos(torneosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setCargando(false);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setEquipoSeleccionado(null);
    setFormData({
      nombreEquipo: "",
      colorUniformePrimario: "#374151",
      colorUniformeSecundario: "#1f2937",
      logoURL: "",
      activo: true,
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (equipo) => {
    setModoEdicion(true);
    setEquipoSeleccionado(equipo);
    setFormData({
      nombreEquipo: equipo.nombreEquipo,
      colorUniformePrimario: equipo.colorUniformePrimario || "#374151",
      colorUniformeSecundario: equipo.colorUniformeSecundario || "#1f2937",
      logoURL: equipo.logoURL || "",
      activo: equipo.activo,
    });
    setMostrarModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombreEquipo.trim()) {
      alert("El nombre del equipo es obligatorio");
      return;
    }

    setCargando(true);
    try {
      if (modoEdicion) {
        await equiposService.updateEquipo(
          equipoSeleccionado.equipoID,
          formData
        );
      } else {
        // Crear equipo - Este endpoint se debe modificar
        await equiposService.createEquipo(formData);
      }

      await cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      alert("Error al guardar el equipo");
    }
    setCargando(false);
  };

  const generarQR = async (equipo, torneoId) => {
    if (!torneoId) {
      alert("Selecciona un torneo primero");
      return;
    }

    try {
      const qrBlob = await qrService.generarQR(torneoId);
      const qrUrl = URL.createObjectURL(qrBlob);
      setQrData({
        url: qrUrl,
        equipo: equipo.nombreEquipo,
        torneoId: torneoId,
      });
      setMostrarQR(true);
    } catch (error) {
      console.error("Error al generar QR:", error);
      alert("Error al generar código QR");
    }
  };

  const descargarQR = () => {
    if (!qrData) return;
    const link = document.createElement("a");
    link.href = qrData.url;
    link.download = `QR_${qrData.equipo}_${Date.now()}.png`;
    link.click();
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setModoEdicion(false);
    setEquipoSeleccionado(null);
  };

  const cerrarModalQR = () => {
    setMostrarQR(false);
    if (qrData?.url) {
      URL.revokeObjectURL(qrData.url);
    }
    setQrData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">👕 Equipos</h2>
          <p className="text-gray-600">
            Gestiona equipos y genera QR para registro
          </p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Equipo
        </button>
      </div>

      {/* Lista de equipos */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : equipos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">👕</div>
          <p className="text-xl font-bold text-gray-900 mb-2">
            No hay equipos registrados
          </p>
          <p className="text-gray-600 mb-4">Crea el primer equipo</p>
          <button
            onClick={abrirModalCrear}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Crear Equipo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((equipo) => (
            <div
              key={equipo.equipoID}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              {/* Header con colores */}
              <div
                className="h-32 relative"
                style={{
                  background: `linear-gradient(135deg, ${
                    equipo.colorUniformePrimario || "#374151"
                  } 0%, ${equipo.colorUniformeSecundario || "#1f2937"} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                {equipo.logoURL ? (
                  <img
                    src={equipo.logoURL}
                    alt={equipo.nombreEquipo}
                    className="w-20 h-20 absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 absolute bottom-4 left-4 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-3xl">⚽</span>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {equipo.nombreEquipo}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{
                      backgroundColor:
                        equipo.colorUniformePrimario || "#374151",
                    }}
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{
                      backgroundColor:
                        equipo.colorUniformeSecundario || "#1f2937",
                    }}
                  ></div>
                  <span
                    className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                      equipo.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {equipo.activo ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>

                {/* Selector de torneo para QR */}
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Selecciona torneo para QR:
                  </label>
                  <select
                    onChange={(e) =>
                      e.target.value && generarQR(equipo, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold"
                    defaultValue=""
                  >
                    <option value="">-- Seleccionar --</option>
                    {torneos
                      .filter((t) => t.activo)
                      .map((torneo) => (
                        <option key={torneo.torneoID} value={torneo.torneoID}>
                          {torneo.nombreTorneo}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModalEditar(equipo)}
                    className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                    👥 Jugadores
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar Equipo */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  {modoEdicion ? "Editar Equipo" : "Nuevo Equipo"}
                </h3>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nombre del Equipo *
                </label>
                <input
                  type="text"
                  value={formData.nombreEquipo}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreEquipo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Color Primario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.colorUniformePrimario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          colorUniformePrimario: e.target.value,
                        })
                      }
                      className="w-16 h-12 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.colorUniformePrimario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          colorUniformePrimario: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.colorUniformeSecundario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          colorUniformeSecundario: e.target.value,
                        })
                      }
                      className="w-16 h-12 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.colorUniformeSecundario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          colorUniformeSecundario: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  URL del Logo (opcional)
                </label>
                <input
                  type="url"
                  value={formData.logoURL}
                  onChange={(e) =>
                    setFormData({ ...formData, logoURL: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>

              {modoEdicion && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-bold text-gray-900">
                    Equipo Activo
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {cargando
                    ? "Guardando..."
                    : modoEdicion
                    ? "Actualizar"
                    : "Crear Equipo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {mostrarQR && qrData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-t-2xl">
              <h3 className="text-2xl font-black mb-2">Código QR Generado</h3>
              <p className="text-blue-200">
                Para: <strong>{qrData.equipo}</strong>
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-6">
                <img
                  src={qrData.url}
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-yellow-800 font-semibold">
                  ⚠️ Este QR permite registrar jugadores para este equipo en el
                  torneo seleccionado
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={descargarQR}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Descargar
                </button>
                <button
                  onClick={cerrarModalQR}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEquipos;
