import { useState, useEffect } from "react";
import GestionTorneos from "./admin/GestionTorneos";
import GestionPartidos from "./admin/GestionPartidos";
import torneosService from "../services/torneosService";
import partidosService from "../services/partidosService";
import equiposService from "../services/equiposService";

const Dashboard = ({ usuario, onCerrarSesion }) => {
  const [vistaActual, setVistaActual] = useState("inicio");
  const [datos, setDatos] = useState({
    tabla: [],
    goleadores: [],
    proximosPartidos: [],
    partidosHoy: 0,
    equiposActivos: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [torneoActual, setTorneoActual] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const torneos = await torneosService.getTorneos();
      const torneo = torneos.find((t) => t.activo) || torneos[0];

      if (torneo) {
        setTorneoActual(torneo);

        const [tabla, goleadores, partidos, equipos] = await Promise.all([
          torneosService.getTablaPosiciones(torneo.torneoID),
          torneosService.getGoleadores(torneo.torneoID),
          partidosService.getPartidos(torneo.torneoID),
          equiposService.getEquipos(),
        ]);

        const hoy = new Date().toDateString();
        const partidosHoy = partidos.filter((p) => {
          const fechaPartido = new Date(p.fechaHora).toDateString();
          return hoy === fechaPartido && p.estatus !== "Finalizado";
        }).length;

        setDatos({
          tabla: Array.isArray(tabla) ? tabla.slice(0, 5) : [],
          goleadores: Array.isArray(goleadores) ? goleadores.slice(0, 5) : [],
          proximosPartidos: partidos
            .filter((p) => p.estatus === "Programado")
            .slice(0, 3),
          partidosHoy,
          equiposActivos: equipos.filter((e) => e.activo).length,
        });
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setCargando(false);
  };

  const obtenerNombreEquipo = (equipoID) => {
    // Esto asume que tienes equipos cargados, puedes mejorar esto
    return "Equipo " + equipoID;
  };

  // Menú de navegación según el rol
  const getMenuItems = () => {
    const esAdmin = usuario?.roles?.includes("Administrador");
    const esCapitan = usuario?.roles?.includes("Capitan");
    const esArbitro = usuario?.roles?.includes("Arbitro");

    const menu = [
      { id: "inicio", label: "INICIO", icon: "🏠", roles: ["all"] },
    ];

    if (esAdmin || esArbitro) {
      menu.push({
        id: "partidos",
        label: "PARTIDOS",
        icon: "⚽",
        roles: ["Administrador", "Arbitro"],
      });
    }

    if (esCapitan) {
      menu.push({
        id: "mis-equipos",
        label: "MIS EQUIPOS",
        icon: "👕",
        roles: ["Capitan"],
      });
    }

    if (esAdmin) {
      menu.push(
        {
          id: "equipos",
          label: "EQUIPOS",
          icon: "👕",
          roles: ["Administrador"],
        },
        {
          id: "torneos",
          label: "TORNEOS",
          icon: "🏆",
          roles: ["Administrador"],
        }
      );
    }

    menu.push({
      id: "estadisticas",
      label: "ESTADÍSTICAS",
      icon: "📊",
      roles: ["all"],
    });

    return menu;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white">LIGA LOCAL</h1>
                <p className="text-xs text-gray-400 font-semibold">
                  Panel de {usuario?.roles?.[0] || "Usuario"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {usuario?.nombre?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">
                    {usuario?.nombre || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {usuario?.roles?.[0] || "Usuario"}
                  </p>
                </div>
              </div>
              <button
                onClick={onCerrarSesion}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="px-6">
          <div className="flex gap-1 overflow-x-auto">
            {getMenuItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setVistaActual(item.id)}
                className={`px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${
                  vistaActual === item.id
                    ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {vistaActual === "inicio" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-semibold mb-1">
                      Partidos Hoy
                    </p>
                    <p className="text-4xl font-black">{datos.partidosHoy}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚽</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-semibold mb-1">
                      Equipos Activos
                    </p>
                    <p className="text-4xl font-black">
                      {datos.equiposActivos}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👕</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-semibold mb-1">
                      Goleador Líder
                    </p>
                    <p className="text-sm font-black truncate">
                      {datos.goleadores[0]?.jugador || "N/A"}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👑</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-semibold mb-1">
                      Goles
                    </p>
                    <p className="text-4xl font-black">
                      {datos.goleadores[0]?.goles || 0}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🥅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximos Partidos */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">
                    🗓️ Próximos Partidos
                  </h2>
                </div>

                {cargando ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : datos.proximosPartidos.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No hay partidos programados
                  </p>
                ) : (
                  <div className="space-y-4">
                    {datos.proximosPartidos.map((partido) => (
                      <div
                        key={partido.partidoID}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(partido.fechaHora).toLocaleDateString()} -{" "}
                            {new Date(partido.fechaHora).toLocaleTimeString(
                              "es-MX",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-right">
                            <p className="font-bold text-gray-900">
                              Equipo {partido.equipoLocalID}
                            </p>
                          </div>
                          <div className="mx-6 bg-gray-900 text-white px-4 py-2 rounded-lg font-black">
                            VS
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-gray-900">
                              Equipo {partido.equipoVisitanteID}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabla de Goleadores */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  👑 Tabla de Goleadores
                </h2>

                {cargando ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
                  </div>
                ) : datos.goleadores.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No hay goleadores registrados
                  </p>
                ) : (
                  <div className="space-y-3">
                    {datos.goleadores.map((goleador, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {goleador.jugador || goleador.nombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            {goleador.nombreEquipo || goleador.equipo}
                          </p>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black">
                          {goleador.goles}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de Posiciones */}
            {datos.tabla.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  🏆 Tabla de Posiciones
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-black text-sm">
                          POS
                        </th>
                        <th className="px-4 py-3 text-left font-black text-sm">
                          EQUIPO
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          PJ
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          PG
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          PE
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          PP
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          GF
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          GC
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm">
                          DIF
                        </th>
                        <th className="px-4 py-3 text-center font-black text-sm bg-blue-700">
                          PTS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.tabla.map((equipo, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-200 hover:bg-gray-50 ${
                            index < 3 ? "bg-green-50" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={`font-black ${
                                index < 3 ? "text-green-600" : "text-gray-700"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900">
                            {equipo.nombreEquipo}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                            {equipo.pj}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                            {equipo.victorias}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                            {equipo.empates}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                            {equipo.derrotas}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                            {equipo.golesFavor}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                            {equipo.golesContra}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`font-bold ${
                                equipo.diferencia > 0
                                  ? "text-green-600"
                                  : equipo.diferencia < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {equipo.diferencia > 0 ? "+" : ""}
                              {equipo.diferencia}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black">
                              {equipo.puntos}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {vistaActual === "partidos" && <GestionPartidos usuario={usuario} />}
        {vistaActual === "torneos" && <GestionTorneos />}

        {vistaActual === "equipos" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              👕 Gestión de Equipos
            </h2>
            <p className="text-gray-600 mb-6">
              Administra equipos, jugadores y cuerpo técnico.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
              + Nuevo Equipo
            </button>
          </div>
        )}

        {vistaActual === "estadisticas" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              📊 Estadísticas Generales
            </h2>
            <p className="text-gray-600 mb-6">
              Visualiza estadísticas detalladas y reportes.
            </p>
          </div>
        )}

        {vistaActual === "mis-equipos" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              👕 Mis Equipos
            </h2>
            <p className="text-gray-600 mb-6">
              Gestiona tus equipos y jugadores.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
