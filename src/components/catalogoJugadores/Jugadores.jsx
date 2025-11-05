import { useState, useEffect } from "react";

const Jugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [sanciones, setSanciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("todos");
  const [vistaModal, setVistaModal] = useState(null); // null, 'ver', 'editar', 'crear'

  useEffect(() => {
    cargarEquipos();
  }, []);

  useEffect(() => {
    if (equipos.length > 0) {
      cargarTodosJugadores();
    }
  }, [equipos]);

  const cargarEquipos = async () => {
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
    }
  };

  const cargarTodosJugadores = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const todosJugadores = [];

      for (const equipo of equipos) {
        const response = await fetch(
          `https://localhost:7260/api/Equipos/${equipo.equipoID}/jugadores`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const jugadoresEquipo = await response.json();
          todosJugadores.push(
            ...jugadoresEquipo.map((j) => ({
              ...j,
              nombreEquipo: equipo.nombreEquipo,
              equipoID: equipo.equipoID,
            }))
          );
        }
      }

      setJugadores(todosJugadores);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarDetallesJugador = async (jugadorId) => {
    try {
      const token = localStorage.getItem("token");

      // Cargar documentos
      const docsResponse = await fetch(
        `https://localhost:7260/api/Jugadores/${jugadorId}/documentos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setDocumentos(docsData);
      }

      // Cargar sanciones
      const sancionesResponse = await fetch(
        `https://localhost:7260/api/Jugadores/${jugadorId}/sanciones`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (sancionesResponse.ok) {
        const sancionesData = await sancionesResponse.json();
        setSanciones(sancionesData);
      }
    } catch (err) {
      console.error("Error al cargar detalles:", err);
    }
  };

  const verDetalles = async (jugador) => {
    setJugadorSeleccionado(jugador);
    await cargarDetallesJugador(jugador.jugadorID);
    setVistaModal("ver");
  };

  const actualizarJugador = async (jugadorId, datosActualizados) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7260/api/Jugadores/${jugadorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar jugador");

      await cargarTodosJugadores();
      setVistaModal(null);
      setJugadorSeleccionado(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarJugador = async (jugadorId) => {
    if (!confirm("¿Estás seguro de eliminar este jugador?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7260/api/Jugadores/${jugadorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar jugador");

      await cargarTodosJugadores();
      setVistaModal(null);
      setJugadorSeleccionado(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const cerrarModal = () => {
    setVistaModal(null);
    setJugadorSeleccionado(null);
    setDocumentos([]);
    setSanciones([]);
  };

  const jugadoresFiltrados =
    filtroEquipo === "todos"
      ? jugadores
      : jugadores.filter((j) => j.equipoID === parseInt(filtroEquipo));

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900">👤 Jugadores</h2>
            <p className="text-gray-600 mt-1">
              Gestiona todos los jugadores registrados
            </p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2">
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
            Nuevo Jugador
          </button>
        </div>

        {/* Filtro por Equipo */}
        <div className="flex items-center gap-4">
          <label className="font-bold text-gray-700">Filtrar por equipo:</label>
          <select
            value={filtroEquipo}
            onChange={(e) => setFiltroEquipo(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-blue-500 focus:outline-none"
          >
            <option value="todos">Todos los equipos</option>
            {equipos.map((equipo) => (
              <option key={equipo.equipoID} value={equipo.equipoID}>
                {equipo.nombreEquipo}
              </option>
            ))}
          </select>
          <span className="ml-auto text-sm text-gray-600 font-semibold">
            Total: {jugadoresFiltrados.length} jugadores
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {/* Tabla de Jugadores */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-black text-sm">FOTO</th>
                <th className="px-6 py-4 text-left font-black text-sm">
                  NOMBRE
                </th>
                <th className="px-6 py-4 text-left font-black text-sm">
                  EQUIPO
                </th>
                <th className="px-6 py-4 text-center font-black text-sm">
                  NÚMERO
                </th>
                <th className="px-6 py-4 text-left font-black text-sm">
                  POSICIÓN
                </th>
                <th className="px-6 py-4 text-center font-black text-sm">
                  ESTATUS
                </th>
                <th className="px-6 py-4 text-center font-black text-sm">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {jugadoresFiltrados.map((jugador, index) => (
                <tr
                  key={jugador.jugadorID}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    {jugador.fotoURL ? (
                      <img
                        src={jugador.fotoURL}
                        alt={jugador.nombre}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">
                        {jugador.nombre?.charAt(0) || "?"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{jugador.nombre}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {jugador.nombreEquipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-black text-gray-900 text-lg">
                      #{jugador.numeroJugador || "S/N"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-700">
                      {jugador.posicion || "Sin posición"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        jugador.estatus === "Activo"
                          ? "bg-green-100 text-green-800"
                          : jugador.estatus === "Suspendido"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {jugador.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => verDetalles(jugador)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {jugadoresFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-semibold text-lg">
              No hay jugadores registrados
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {vistaModal === "ver" && jugadorSeleccionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 relative">
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
                {jugadorSeleccionado.fotoURL ? (
                  <img
                    src={jugadorSeleccionado.fotoURL}
                    alt={jugadorSeleccionado.nombre}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 font-black text-5xl shadow-xl">
                    {jugadorSeleccionado.nombre?.charAt(0) || "?"}
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-4xl font-black mb-2">
                    {jugadorSeleccionado.nombre}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-white/20 px-4 py-1 rounded-lg font-semibold">
                      #{jugadorSeleccionado.numeroJugador || "S/N"}
                    </span>
                    <span className="bg-white/20 px-4 py-1 rounded-lg font-semibold">
                      {jugadorSeleccionado.posicion || "Sin posición"}
                    </span>
                    <span className="bg-white/20 px-4 py-1 rounded-lg font-semibold">
                      {jugadorSeleccionado.nombreEquipo}
                    </span>
                    <span
                      className={`px-4 py-1 rounded-lg font-bold ${
                        jugadorSeleccionado.estatus === "Activo"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {jugadorSeleccionado.estatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8 space-y-8">
              {/* Información Personal */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  📋 Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      ID Jugador
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {jugadorSeleccionado.jugadorID}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Fecha de Nacimiento
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {jugadorSeleccionado.fechaNacimiento
                        ? new Date(
                            jugadorSeleccionado.fechaNacimiento
                          ).toLocaleDateString()
                        : "No especificada"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  📄 Documentos ({documentos.length})
                </h3>
                {documentos.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 font-semibold">
                      No hay documentos cargados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documentos.map((doc) => (
                      <div
                        key={doc.documentoID}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            📄
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {doc.tipoDocumento}
                            </p>
                            <p className="text-sm text-gray-600">
                              {doc.nombreArchivo}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            doc.estatusValidacion === "Aprobado"
                              ? "bg-green-100 text-green-800"
                              : doc.estatusValidacion === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {doc.estatusValidacion}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sanciones */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  ⚠️ Sanciones Activas ({sanciones.length})
                </h3>
                {sanciones.length === 0 ? (
                  <div className="bg-green-50 rounded-lg p-8 text-center">
                    <p className="text-green-700 font-semibold">
                      ✓ Sin sanciones activas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sanciones.map((sancion) => (
                      <div
                        key={sancion.sancionID}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-red-900 mb-1">
                              {sancion.tipoSancion}
                            </p>
                            <p className="text-sm text-red-700 mb-2">
                              {sancion.motivo}
                            </p>
                            <p className="text-xs text-red-600">
                              Suspensión: {sancion.partidosCumplidos} /{" "}
                              {sancion.partidosSuspension} partidos
                            </p>
                          </div>
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ACTIVA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                  ✏️ Editar Jugador
                </button>
                <button
                  onClick={() => eliminarJugador(jugadorSeleccionado.jugadorID)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  🗑️ Eliminar Jugador
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

export default Jugadores;
