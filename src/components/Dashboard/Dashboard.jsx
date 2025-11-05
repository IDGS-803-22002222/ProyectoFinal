import { useState } from "react";

const Dashboard = ({ usuario, onCerrarSesion }) => {
  const [vistaActual, setVistaActual] = useState("inicio");

  // Datos de ejemplo
  const estadisticas = {
    partidosHoy: 5,
    equiposActivos: 24,
    goleadorLider: "Carlos Hernández",
    golesLider: 18,
  };

  const proximosPartidos = [
    {
      id: 1,
      equipoLocal: "Tigres FC",
      equipoVisitante: "Águilas United",
      fecha: "2025-11-04",
      hora: "16:00",
      estadio: "Estadio Municipal",
    },
    {
      id: 2,
      equipoLocal: "Leones SC",
      equipoVisitante: "Pumas FC",
      fecha: "2025-11-04",
      hora: "18:00",
      estadio: "Campo La Gloria",
    },
    {
      id: 3,
      equipoLocal: "Diablos Rojos",
      equipoVisitante: "Santos FC",
      fecha: "2025-11-05",
      hora: "15:00",
      estadio: "Estadio Central",
    },
  ];

  const tablaPosiciones = [
    {
      pos: 1,
      equipo: "Tigres FC",
      pj: 12,
      pg: 9,
      pe: 2,
      pp: 1,
      gf: 28,
      gc: 10,
      dif: 18,
      pts: 29,
    },
    {
      pos: 2,
      equipo: "Leones SC",
      pj: 12,
      pg: 8,
      pe: 3,
      pp: 1,
      gf: 25,
      gc: 12,
      dif: 13,
      pts: 27,
    },
    {
      pos: 3,
      equipo: "Águilas United",
      pj: 12,
      pg: 7,
      pe: 4,
      pp: 1,
      gf: 22,
      gc: 11,
      dif: 11,
      pts: 25,
    },
    {
      pos: 4,
      equipo: "Pumas FC",
      pj: 12,
      pg: 6,
      pe: 3,
      pp: 3,
      gf: 19,
      gc: 15,
      dif: 4,
      pts: 21,
    },
    {
      pos: 5,
      equipo: "Santos FC",
      pj: 12,
      pg: 5,
      pe: 4,
      pp: 3,
      gf: 18,
      gc: 16,
      dif: 2,
      pts: 19,
    },
  ];

  const goleadores = [
    { pos: 1, jugador: "Carlos Hernández", equipo: "Tigres FC", goles: 18 },
    { pos: 2, jugador: "Miguel Ángel Pérez", equipo: "Leones SC", goles: 15 },
    { pos: 3, jugador: "Roberto García", equipo: "Águilas United", goles: 13 },
    { pos: 4, jugador: "Luis Torres", equipo: "Pumas FC", goles: 12 },
    { pos: 5, jugador: "Diego Martínez", equipo: "Santos FC", goles: 11 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  Panel de Administración
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {usuario?.nombre?.charAt(0) || "A"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">
                    {usuario?.nombre || "Admin"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {usuario?.roles?.[0] || "Administrador"}
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
          <div className="flex gap-1">
            {[
              { id: "inicio", label: "INICIO", icon: "🏠" },
              { id: "partidos", label: "PARTIDOS", icon: "⚽" },
              { id: "equipos", label: "EQUIPOS", icon: "👕" },
              { id: "torneos", label: "TORNEOS", icon: "🏆" },
              { id: "estadisticas", label: "ESTADÍSTICAS", icon: "📊" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setVistaActual(item.id)}
                className={`px-6 py-4 font-bold text-sm transition-all ${
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
                    <p className="text-4xl font-black">
                      {estadisticas.partidosHoy}
                    </p>
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
                      {estadisticas.equiposActivos}
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
                    <p className="text-lg font-black">
                      {estadisticas.goleadorLider}
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
                      Goles del Líder
                    </p>
                    <p className="text-4xl font-black">
                      {estadisticas.golesLider}
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
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                    Ver Todos
                  </button>
                </div>

                <div className="space-y-4">
                  {proximosPartidos.map((partido) => (
                    <div
                      key={partido.id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {partido.fecha} - {partido.hora}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">
                          {partido.estadio}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <p className="font-bold text-gray-900">
                            {partido.equipoLocal}
                          </p>
                        </div>
                        <div className="mx-6 bg-gray-900 text-white px-4 py-2 rounded-lg font-black">
                          VS
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-gray-900">
                            {partido.equipoVisitante}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabla de Goleadores */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">
                    👑 Tabla de Goleadores
                  </h2>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition">
                    Ver Completa
                  </button>
                </div>

                <div className="space-y-3">
                  {goleadores.map((goleador) => (
                    <div
                      key={goleador.pos}
                      className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                          goleador.pos === 1
                            ? "bg-yellow-500"
                            : goleador.pos === 2
                            ? "bg-gray-400"
                            : goleador.pos === 3
                            ? "bg-orange-600"
                            : "bg-gray-600"
                        }`}
                      >
                        {goleador.pos}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {goleador.jugador}
                        </p>
                        <p className="text-sm text-gray-600">
                          {goleador.equipo}
                        </p>
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black">
                        {goleador.goles}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabla de Posiciones */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  🏆 Tabla de Posiciones
                </h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition">
                  Descargar PDF
                </button>
              </div>

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
                    {tablaPosiciones.map((equipo, index) => (
                      <tr
                        key={equipo.pos}
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
                            {equipo.pos}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          {equipo.equipo}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                          {equipo.pj}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                          {equipo.pg}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                          {equipo.pe}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                          {equipo.pp}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                          {equipo.gf}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                          {equipo.gc}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-bold ${
                              equipo.dif > 0
                                ? "text-green-600"
                                : equipo.dif < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {equipo.dif > 0 ? "+" : ""}
                            {equipo.dif}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black">
                            {equipo.pts}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {vistaActual === "partidos" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              ⚽ Gestión de Partidos
            </h2>
            <p className="text-gray-600 mb-6">
              Administra todos los partidos del torneo.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              + Nuevo Partido
            </button>
          </div>
        )}

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

        {vistaActual === "torneos" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              🏆 Gestión de Torneos
            </h2>
            <p className="text-gray-600 mb-6">
              Crea y administra torneos y temporadas.
            </p>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition">
              + Nuevo Torneo
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
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition">
              Generar Reporte
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
