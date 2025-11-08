import { useState, useEffect } from "react";
import canchasService from "../../services/CanchasService";

const CatalogoCanchas = ({ usuario }) => {
  const [canchas, setCanchas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [nuevaCancha, setNuevaCancha] = useState({
    canchaID: 0,
    nombreCancha: "",
    direccion: "",
    latitud: 0,
    longitud: 0,
    capacidad: 0,
    tipoSuperficie: "",
    activo: true,
  });

  useEffect(() => {
    cargarCanchas();
    console.log("Usuario actual:", usuario);
  }, []);

  const cargarCanchas = async () => {
    setCargando(true);
    try {
      const data = await canchasService.getCanchas();
      setCanchas(data);
    } catch (error) {
      console.error("Error al cargar canchas:", error);
    }
    setCargando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaCancha.nombreCancha.trim()) {
      alert("El nombre de la cancha es obligatorio");
      return;
    }

    setCargando(true);
    try {
      if (modoEdicion && nuevaCancha.canchaID > 0) {
        await canchasService.updateCancha(nuevaCancha.canchaID, nuevaCancha);
      } else {
        await canchasService.createCancha(nuevaCancha);
      }

      await cargarCanchas();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar la cancha:", error);
    }
    setCargando(false);
  };

  const abrirModalNueva = () => {
    setModoEdicion(false);
    setNuevaCancha({
      canchaID: 0,
      nombreCancha: "",
      direccion: "",
      latitud: 0,
      longitud: 0,
      capacidad: 0,
      tipoSuperficie: "",
      activo: true,
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (cancha) => {
    setModoEdicion(true);
    setNuevaCancha({ ...cancha });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setModoEdicion(false);
  };

  const puedeGestionar = !usuario || usuario?.roles?.includes("Administrador");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">🏟️ Canchas</h2>
          <p className="text-gray-600">Gestiona el catálogo de canchas</p>
        </div>

        {puedeGestionar && (
          <button
            onClick={abrirModalNueva}
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
            Nueva Cancha
          </button>
        )}
      </div>

      {/* Lista de canchas */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando canchas...</p>
        </div>
      ) : canchas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🏟️</div>
          <p className="text-xl font-bold text-gray-900 mb-2">
            No hay canchas registradas
          </p>
          <p className="text-gray-600 mb-4">
            Agrega la primera cancha del catálogo
          </p>
          {puedeGestionar && (
            <button
              onClick={abrirModalNueva}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Agregar Cancha
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canchas.map((cancha) => (
            <div
              key={cancha.canchaID}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {cancha.nombreCancha}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Dirección:</strong> {cancha.direccion}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Tipo de superficie:</strong> {cancha.tipoSuperficie}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Capacidad:</strong> {cancha.capacidad} personas
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Ubicación:</strong> {cancha.latitud},{" "}
                  {cancha.longitud}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                    cancha.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {cancha.activo ? "Activa" : "Inactiva"}
                </span>
              </div>

              {puedeGestionar && (
                <button
                  onClick={() => abrirModalEditar(cancha)}
                  className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  {modoEdicion ? "Editar Cancha" : "Registrar Cancha"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nombre de la Cancha *
                  </label>
                  <input
                    type="text"
                    value={nuevaCancha.nombreCancha}
                    onChange={(e) =>
                      setNuevaCancha({
                        ...nuevaCancha,
                        nombreCancha: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tipo de Superficie *
                  </label>
                  <input
                    type="text"
                    value={nuevaCancha.tipoSuperficie}
                    onChange={(e) =>
                      setNuevaCancha({
                        ...nuevaCancha,
                        tipoSuperficie: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={nuevaCancha.direccion}
                  onChange={(e) =>
                    setNuevaCancha({
                      ...nuevaCancha,
                      direccion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={nuevaCancha.latitud}
                    onChange={(e) =>
                      setNuevaCancha({
                        ...nuevaCancha,
                        latitud: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={nuevaCancha.longitud}
                    onChange={(e) =>
                      setNuevaCancha({
                        ...nuevaCancha,
                        longitud: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    value={nuevaCancha.capacidad}
                    onChange={(e) =>
                      setNuevaCancha({
                        ...nuevaCancha,
                        capacidad: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-2 mt-8">
                  <input
                    type="checkbox"
                    checked={nuevaCancha.activo}
                    onChange={(e) =>
                      setNuevaCancha({
                        ...nuevaCancha,
                        activo: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600"
                  />
                  <label className="text-sm font-bold text-gray-900">
                    Activa
                  </label>
                </div>
              </div>

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
                    : "Guardar Cancha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoCanchas;
