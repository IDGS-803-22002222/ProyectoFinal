import React from "react";

const NavBar = () => {
  return (
    <>
      <nav className="flex items-center justify-center gap-1 py-2">
        {[
          "INICIO",
          "PARTIDOS",
          "CLASIFICACIÓN",
          "EQUIPOS",
          "ESTADÍSTICAS",
          "NOTICIAS",
        ].map((item) => (
          <button
            key={item}
            className="text-gray-300 px-6 py-3 font-bold text-sm hover:text-white hover:bg-gray-700 transition-all rounded-lg"
          >
            {item}
          </button>
        ))}
      </nav>
    </>
  );
};

export default NavBar;
