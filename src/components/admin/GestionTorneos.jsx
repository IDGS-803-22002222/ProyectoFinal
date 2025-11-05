import { useState, useEffect } from "react";
import torneosService from "../../services/torneosService";

const GestionTorneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombreTorneo: "",
    categoria: "",
    tipoTorneo: "Liga",
    cuotaInscripcion: 0,
    costoArbitraje: 0,
    fechaInicio: "",
    fechaFin: "",
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
      console.error("Error al cargar torneos:", error);
    }
    setCargando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await torneosService.createTorneo(nuevoTorneo);
      await cargarTorneos();
      setMostrarModal(false);
      setNuevoTorneo({
        nombreTorneo: "",
        categoria: "",
        tipoTorneo: "Liga",
        cuotaInscripcion: 0,
        costoArbitraje: 0,
        fechaInicio: "",
        fechaFin: "",
      });
    } catch (error) {
      console.error("Error al crear torneo:", error);
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
          onClick={() => setMostrarModal(true)}
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
          <p className="mt-4 text-gray-600">Cargando torneos...</p>
        </div>
      ) : torneos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-xl font-bold text-gray-900 mb-2">
            No hay torneos registrados
          </p>
          <p className="text-gray-600">Crea tu primer torneo para comenzar</p>
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
              <div className="space-y-2 text-sm">
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
              <div className="mt-4 pt-4 border-t flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                  Ver Detalles
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear torneo */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  Crear Nuevo Torneo
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
                  value={nuevoTorneo.nombreTorneo}
                  onChange={(e) =>
                    setNuevoTorneo({
                      ...nuevoTorneo,
                      nombreTorneo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ej: Torneo Apertura 2025"
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
                    value={nuevoTorneo.categoria}
                    onChange={(e) =>
                      setNuevoTorneo({
                        ...nuevoTorneo,
                        categoria: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ej: Primera División"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tipo de Torneo
                  </label>
                  <select
                    value={nuevoTorneo.tipoTorneo}
                    onChange={(e) =>
                      setNuevoTorneo({
                        ...nuevoTorneo,
                        tipoTorneo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="Liga">Liga</option>
                    <option value="Eliminación">Eliminación Directa</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Cuota de Inscripción
                  </label>
                  <input
                    type="number"
                    value={nuevoTorneo.cuotaInscripcion}
                    onChange={(e) =>
                      setNuevoTorneo({
                        ...nuevoTorneo,
                        cuotaInscripcion: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Costo de Arbitraje
                  </label>
                  <input
                    type="number"
                    value={nuevoTorneo.costoArbitraje}
                    onChange={(e) =>
                      setNuevoTorneo({
                        ...nuevoTorneo,
                        costoArbitraje: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={nuevoTorneo.fechaInicio}
                    onChange={(e) =>
                      setNuevoTorneo({
                        ...nuevoTorneo,
                        fechaInicio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={nuevoTorneo.fechaFin}
                    onChange={(e) =>
                      setNuevoTorneo({
                        ...nuevoTorneo,
                        fechaFin: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {cargando ? "Creando..." : "Crear Torneo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTorneos;
