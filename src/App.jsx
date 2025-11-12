import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [parole, setParole] = useState([]);
  const [selezionate, setSelezionate] = useState([]);

  useEffect(() => {
    fetch("/parole.csv")
      .then((res) => res.text())
      .then((text) => {
        const righe = text.trim().split("\n").slice(1);
        const data = righe.map((r) => {
          const [livello, parola, lettura, significato, frase, codice] = r.split(",");
          return { livello, parola, lettura, significato, frase, codice };
        });
        setParole(data);
        genera(data);
      });
  }, []);

  const genera = (lista = parole) => {
    const livelli = ["N5", "N4", "N3", "N2", "N1"];
    const random = livelli
      .map((lvl) => {
        const subset = lista.filter((p) => p.livello === lvl);
        return subset[Math.floor(Math.random() * subset.length)];
      })
      .filter(Boolean);
    setSelezionate(random);
  };

  return (
    <div className="App">
      <h1>Flashcard JLPT</h1>
      {selezionate.map((p, i) => (
        <div key={i} className="card">
          <h2>{p.livello} - {p.parola}</h2>
          <p><strong>Lettura:</strong> {p.lettura}</p>
          <p><strong>Significato:</strong> {p.significato}</p>
          <p><em>{p.frase}</em></p>
        </div>
      ))}
      <button onClick={() => genera()}>Nuove parole</button>
    </div>
  );
}

export default App;

