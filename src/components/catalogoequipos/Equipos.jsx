import { useState, useEffect } from "react";

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [vistaModal, setVistaModal] = useState(null); // null, 'ver', 'editar', 'crear'

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7260/api/Equipos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar equipos");

      const data = await response.json();
      setEquipos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarJugadores = async (equipoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7260/api/Equipos/${equipoId}/jugadores`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar jugadores");

      const data = await response.json();
      setJugadores(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const verDetalles = async (equipo) => {
    setEquipoSeleccionado(equipo);
    await cargarJugadores(equipo.equipoID);
    setVistaModal("ver");
  };

  const actualizarEquipo = async (equipoId, datosActualizados) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7260/api/Equipos/${equipoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar equipo");

      await cargarEquipos();
      setVistaModal(null);
      setEquipoSeleccionado(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const cerrarModal = () => {
    setVistaModal(null);
    setEquipoSeleccionado(null);
    setJugadores([]);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">👕 Equipos</h2>
            <p className="text-gray-600 mt-1">
              Gestiona todos los equipos registrados
            </p>
          </div>
          <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-600 transition-all shadow-lg flex items-center gap-2">
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
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {/* Grid de Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipos.map((equipo) => (
          <div
            key={equipo.equipoID}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-100 hover:border-blue-500 cursor-pointer transform hover:-translate-y-1"
            onClick={() => verDetalles(equipo)}
          >
            {/* Header del equipo con colores */}
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

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="font-semibold">Jugadores</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{
                      backgroundColor:
                        equipo.colorUniformePrimario || "#374151",
                    }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{
                      backgroundColor:
                        equipo.colorUniformeSecundario || "#1f2937",
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">
                  Registro:{" "}
                  {new Date(equipo.fechaRegistro).toLocaleDateString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    equipo.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {equipo.activo ? "ACTIVO" : "INACTIVO"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalles */}
      {vistaModal === "ver" && equipoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div
              className="p-8 relative"
              style={{
                background: `linear-gradient(135deg, ${
                  equipoSeleccionado.colorUniformePrimario || "#374151"
                } 0%, ${
                  equipoSeleccionado.colorUniformeSecundario || "#1f2937"
                } 100%)`,
              }}
            >
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
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

              <div className="flex items-center gap-6 text-white">
                {equipoSeleccionado.logoURL ? (
                  <img
                    src={equipoSeleccionado.logoURL}
                    alt={equipoSeleccionado.nombreEquipo}
                    className="w-24 h-24 bg-white rounded-full p-3 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-5xl">⚽</span>
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-4xl font-black mb-2">
                    {equipoSeleccionado.nombreEquipo}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-white/20 px-4 py-1 rounded-lg font-semibold text-sm">
                      Equipo ID: {equipoSeleccionado.equipoID}
                    </span>
                    <span className="bg-white/20 px-4 py-1 rounded-lg font-semibold text-sm">
                      {equipoSeleccionado.activo ? "✓ ACTIVO" : "✗ INACTIVO"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  📋 Información del Equipo
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Color Primario
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{
                          backgroundColor:
                            equipoSeleccionado.colorUniformePrimario ||
                            "#374151",
                        }}
                      ></div>
                      <span className="font-bold text-gray-900">
                        {equipoSeleccionado.colorUniformePrimario || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Color Secundario
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{
                          backgroundColor:
                            equipoSeleccionado.colorUniformeSecundario ||
                            "#1f2937",
                        }}
                      ></div>
                      <span className="font-bold text-gray-900">
                        {equipoSeleccionado.colorUniformeSecundario || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Jugadores */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-gray-900">
                    👥 Jugadores ({jugadores.length})
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                    + Agregar Jugador
                  </button>
                </div>

                {jugadores.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 font-semibold">
                      No hay jugadores registrados
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jugadores.map((jugador) => (
                      <div
                        key={jugador.jugadorID}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition flex items-center gap-4"
                      >
                        {jugador.fotoURL ? (
                          <img
                            src={jugador.fotoURL}
                            alt={jugador.nombre}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                            {jugador.nombre?.charAt(0) || "?"}
                          </div>
                        )}

                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {jugador.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            #{jugador.numeroJugador || "S/N"} •{" "}
                            {jugador.posicion || "Sin posición"}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            jugador.estatus === "Activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {jugador.estatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                   Editar Equipo
                </button>
                <button
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
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

export default Equipos;
