import { useState, useEffect } from "react";
import partidosService from "../../services/partidosService";
import equiposService from "../../services/equiposService";
import torneosService from "../../services/torneosService";

const GestionPartidos = ({ usuario }) => {
  const [partidos, setPartidos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [filtroTorneo, setFiltroTorneo] = useState("");
  const [nuevoPartido, setNuevoPartido] = useState({
    torneoID: "",
    equipoLocalID: "",
    equipoVisitanteID: "",
    canchaID: 1,
    fechaHora: "",
    jornada: 1,
  });

  useEffect(() => {
    cargarDatos();
  }, [filtroTorneo]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [partidosData, torneosData, equiposData] = await Promise.all([
        partidosService.getPartidos(filtroTorneo || null),
        torneosService.getTorneos(),
        equiposService.getEquipos(),
      ]);
      setPartidos(partidosData);
      setTorneos(torneosData);
      setEquipos(equiposData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setCargando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevoPartido.equipoLocalID === nuevoPartido.equipoVisitanteID) {
      alert("Los equipos deben ser diferentes");
      return;
    }
    setCargando(true);
    try {
      await partidosService.createPartido(nuevoPartido);
      await cargarDatos();
      setMostrarModal(false);
      setNuevoPartido({
        torneoID: "",
        equipoLocalID: "",
        equipoVisitanteID: "",
        canchaID: 1,
        fechaHora: "",
        jornada: 1,
      });
    } catch (error) {
      console.error("Error al crear partido:", error);
    }
    setCargando(false);
  };

  const getEquipoNombre = (id) => {
    const equipo = equipos.find((e) => e.equipoID === id);
    return equipo ? equipo.nombreEquipo : "Desconocido";
  };

  const getEstadoColor = (estatus) => {
    switch (estatus) {
      case "Programado":
        return "bg-blue-100 text-blue-800";
      case "EnJuego":
        return "bg-green-100 text-green-800";
      case "Finalizado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">⚽ Partidos</h2>
          <p className="text-gray-600">Gestiona el calendario de partidos</p>
        </div>
        {usuario?.roles?.includes("Administrador") && (
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
            Nuevo Partido
          </button>
        )}
      </div>

      {/* Filtro por torneo */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Filtrar por Torneo
        </label>
        <select
          value={filtroTorneo}
          onChange={(e) => setFiltroTorneo(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          <option value="">Todos los torneos</option>
          {torneos.map((torneo) => (
            <option key={torneo.torneoID} value={torneo.torneoID}>
              {torneo.nombreTorneo}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de partidos */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando partidos...</p>
        </div>
      ) : partidos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">⚽</div>
          <p className="text-xl font-bold text-gray-900 mb-2">
            No hay partidos programados
          </p>
          <p className="text-gray-600">Crea el primer partido del torneo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {partidos.map((partido) => (
            <div
              key={partido.partidoID}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Jornada {partido.jornada}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${getEstadoColor(
                      partido.estatus
                    )}`}
                  >
                    {partido.estatus}
                  </span>
                </div>
                <span className="text-sm text-gray-600 font-semibold">
                  {new Date(partido.fechaHora).toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-6">
                {/* Equipo Local */}
                <div className="flex-1 text-right">
                  <p className="text-xl font-black text-gray-900">
                    {getEquipoNombre(partido.equipoLocalID)}
                  </p>
                  {partido.estatus !== "Programado" && (
                    <p className="text-3xl font-black text-blue-600 mt-2">
                      {partido.golesLocal}
                    </p>
                  )}
                </div>

                {/* VS */}
                <div className="bg-gray-900 text-white px-6 py-3 rounded-lg font-black text-xl">
                  VS
                </div>

                {/* Equipo Visitante */}
                <div className="flex-1 text-left">
                  <p className="text-xl font-black text-gray-900">
                    {getEquipoNombre(partido.equipoVisitanteID)}
                  </p>
                  {partido.estatus !== "Programado" && (
                    <p className="text-3xl font-black text-blue-600 mt-2">
                      {partido.golesVisitante}
                    </p>
                  )}
                </div>
              </div>

              {usuario?.roles?.includes("Arbitro") &&
                partido.estatus === "EnJuego" && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition">
                      ⚽ Registrar Gol
                    </button>
                    <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition">
                      🟨 Tarjeta
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition">
                      ⏹️ Finalizar
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Modal crear partido */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  Programar Partido
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
                  Torneo *
                </label>
                <select
                  value={nuevoPartido.torneoID}
                  onChange={(e) =>
                    setNuevoPartido({
                      ...nuevoPartido,
                      torneoID: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">Selecciona un torneo</option>
                  {torneos.map((torneo) => (
                    <option key={torneo.torneoID} value={torneo.torneoID}>
                      {torneo.nombreTorneo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Equipo Local *
                  </label>
                  <select
                    value={nuevoPartido.equipoLocalID}
                    onChange={(e) =>
                      setNuevoPartido({
                        ...nuevoPartido,
                        equipoLocalID: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Selecciona equipo</option>
                    {equipos.map((equipo) => (
                      <option key={equipo.equipoID} value={equipo.equipoID}>
                        {equipo.nombreEquipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Equipo Visitante *
                  </label>
                  <select
                    value={nuevoPartido.equipoVisitanteID}
                    onChange={(e) =>
                      setNuevoPartido({
                        ...nuevoPartido,
                        equipoVisitanteID: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Selecciona equipo</option>
                    {equipos.map((equipo) => (
                      <option key={equipo.equipoID} value={equipo.equipoID}>
                        {equipo.nombreEquipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha y Hora *
                  </label>
                  <input
                    type="datetime-local"
                    value={nuevoPartido.fechaHora}
                    onChange={(e) =>
                      setNuevoPartido({
                        ...nuevoPartido,
                        fechaHora: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                    min={new Date().toISOString().slice(0, 16)} // No permitir fechas pasadas
                  />
                  {!nuevoPartido.fechaHora && (
                    <p className="text-xs text-red-600 mt-1">
                      Por favor, llena este campo.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Jornada *
                  </label>
                  <input
                    type="number"
                    value={nuevoPartido.jornada}
                    onChange={(e) =>
                      setNuevoPartido({
                        ...nuevoPartido,
                        jornada: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    min="1"
                    required
                  />
                </div>
              </div>

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
                  {cargando ? "Creando..." : "Crear Partido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPartidos;
