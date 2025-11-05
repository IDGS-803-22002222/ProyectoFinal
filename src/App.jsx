import { useState } from "react";
import "./App.css";
import { PantallaInicial } from "./components/PantallaInicial";
import Login from "./components/login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import "./output.css";

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    setMostrarLogin(false);
  };

  if (usuario) {
    return <Dashboard usuario={usuario} onCerrarSesion={handleCerrarSesion} />;
  }

  if (mostrarLogin) {
    return (
      <Login onLogin={setUsuario} onVolver={() => setMostrarLogin(false)} />
    );
  }

  return <PantallaInicial onContinuar={() => setMostrarLogin(true)} />;
}

export default App;
