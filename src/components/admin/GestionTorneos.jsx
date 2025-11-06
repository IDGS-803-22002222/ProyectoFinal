import { useState, useEffect } from "react";
import torneosService from "../../services/torneosService";

const GestionTorneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [detalles, setDetalles] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    nombreTorneo: "",
    categoria: "",
    tipoTorneo: "Liga",
    cuotaInscripcion: 0,
    costoArbitraje: 0,
    fechaInicio: "",
    fechaFin: "",
    activo: true,
  });

  useEffect(() => {
    cargarTorneos();
  }, []);

  const cargarTorneos = async () => {
    setCargando(true);
    try {
      const data = await torneosService.getTorneos();
      setTorneos(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar torneos");
    }
    setCargando(false);
  };

  const cargarDetalles = async (id) => {
    try {
      const data = await torneosService.getDetallesTorneo(id);
      setDetalles(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormData({
      nombreTorneo: "",
      categoria: "",
      tipoTorneo: "Liga",
      cuotaInscripcion: 0,
      costoArbitraje: 0,
      fechaInicio: "",
      fechaFin: "",
      activo: true,
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (torneo) => {
    setModoEdicion(true);
    setTorneoSeleccionado(torneo);
    setFormData({
      nombreTorneo: torneo.nombreTorneo,
      categoria: torneo.categoria || "",
      tipoTorneo: torneo.tipoTorneo || "Liga",
      cuotaInscripcion: torneo.cuotaInscripcion || 0,
      costoArbitraje: torneo.costoArbitraje || 0,
      fechaInicio: torneo.fechaInicio?.split("T")[0] || "",
      fechaFin: torneo.fechaFin?.split("T")[0] || "",
      activo: torneo.activo,
    });
    setMostrarModal(true);
  };

  const abrirModalDetalles = async (torneo) => {
    setTorneoSeleccionado(torneo);
    await cargarDetalles(torneo.torneoID);
    setMostrarModalDetalles(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (modoEdicion) {
        await torneosService.updateTorneo(
          torneoSeleccionado.torneoID,
          formData
        );
        alert("Torneo actualizado exitosamente");
      } else {
        await torneosService.createTorneo(formData);
        alert("Torneo creado exitosamente");
      }
      await cargarTorneos();
      setMostrarModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar torneo");
    }
    setCargando(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">🏆 Torneos</h2>
          <p className="text-gray-600">Gestiona todos los torneos de la liga</p>
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
          Nuevo Torneo
        </button>
      </div>

      {/* Lista de torneos */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      ) : torneos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-xl font-bold text-gray-900 mb-2">No hay torneos</p>
          <p className="text-gray-600">Crea tu primer torneo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneos.map((torneo) => (
            <div
              key={torneo.torneoID}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-black text-gray-900">
                  {torneo.nombreTorneo}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    torneo.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {torneo.activo ? "ACTIVO" : "INACTIVO"}
                </span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-gray-600">
                  <span className="font-bold">Categoría:</span>{" "}
                  {torneo.categoria || "General"}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Tipo:</span>{" "}
                  {torneo.tipoTorneo || "N/A"}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Inscripción:</span> $
                  {torneo.cuotaInscripcion || 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Inicio:</span>{" "}
                  {new Date(torneo.fechaInicio).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirModalEditar(torneo)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  {modoEdicion ? "Editar Torneo" : "Crear Torneo"}
                </h3>
                <button
                  onClick={() => setMostrarModal(false)}
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
                  Nombre del Torneo *
                </label>
                <input
                  type="text"
                  value={formData.nombreTorneo}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreTorneo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.tipoTorneo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoTorneo: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Liga">Liga</option>
                    <option value="Eliminación">Eliminación</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Cuota Inscripción
                  </label>
                  <input
                    type="number"
                    value={formData.cuotaInscripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cuotaInscripcion: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Costo Arbitraje
                  </label>
                  <input
                    type="number"
                    value={formData.costoArbitraje}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costoArbitraje: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {modoEdicion && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-bold text-gray-900">
                    Torneo Activo
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
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
                    : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {mostrarModalDetalles && detalles && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
              <button
                onClick={() => setMostrarModalDetalles(false)}
                className="float-right bg-white/20 hover:bg-white/30 p-2 rounded-lg"
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
              <h2 className="text-4xl font-black mb-2">
                {detalles.torneo.nombreTorneo}
              </h2>
              <p className="text-blue-200">
                {detalles.torneo.categoria} • {detalles.torneo.tipoTorneo}
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold">Equipos</p>
                  <p className="text-3xl font-black text-blue-900">
                    {detalles.estadisticas.equiposInscritos}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-semibold">
                    Partidos Jugados
                  </p>
                  <p className="text-3xl font-black text-green-900">
                    {detalles.estadisticas.partidosJugados}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-semibold">
                    Pendientes
                  </p>
                  <p className="text-3xl font-black text-yellow-900">
                    {detalles.estadisticas.partidosPendientes}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold">
                    Total Partidos
                  </p>
                  <p className="text-3xl font-black text-purple-900">
                    {detalles.estadisticas.partidosTotales}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  Información
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">
                      Cuota Inscripción
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ${detalles.torneo.cuotaInscripcion || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">
                      Costo Arbitraje
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ${detalles.torneo.costoArbitraje || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">
                      Fecha Inicio
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(
                        detalles.torneo.fechaInicio
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">
                      Goleador Líder
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {detalles.estadisticas.goleadorLider || "N/A"} (
                      {detalles.estadisticas.golesLider})
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMostrarModalDetalles(false)}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTorneos;
