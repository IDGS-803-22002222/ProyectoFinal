import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { PantallaInicial } from "./components/PantallaInicial";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PantallaInicial />
    </>
  );
}

export default App;
