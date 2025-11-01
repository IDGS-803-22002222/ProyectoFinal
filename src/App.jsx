import { useState } from "react";
import "./App.css";
import { PantallaInicial } from "./components/PantallaInicial";
import Login from "./components/login/Login";
import "./output.css";

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [usuario, setUsuario] = useState(null);

  if (usuario) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Bienvenido {usuario.nombre}</h1>
        </div>
      </div>
    );
  }

  if (mostrarLogin) {
    return (
      <Login onLogin={setUsuario} onVolver={() => setMostrarLogin(false)} />
    );
  }

  return <PantallaInicial onContinuar={() => setMostrarLogin(true)} />;
}

export default App;
