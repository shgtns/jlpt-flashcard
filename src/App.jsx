import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [parole, setParole] = useState([]);
  const [selezionate, setSelezionate] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Carica CSV
  useEffect(() => {
    fetch("./parole.csv")
      .then(res => res.text())
      .then(text => {
        const righe = text.trim().split("\n").slice(1);
        const data = righe.map(r => {
          const [livello, parola, lettura, significato, frase, codice] = r.split(",");
          return { livello, parola, lettura, significato, frase, codice };
        });
        setParole(data);
        generaCasuali(data);
      });
  }, []);

  // Genera 5 parole casuali (una per livello)
  const generaCasuali = (lista = parole) => {
    const livelli = ["N5","N4","N3","N2","N1"];
    const random = livelli.map(lvl => {
      const subset = lista.filter(p => p.livello === lvl);
      return subset[Math.floor(Math.random() * subset.length)];
    }).filter(Boolean);
    setSelezionate(random);
    setIndex(0);
    setFlipped(false);
  };

  const prossimaCarta = () => {
    setFlipped(false);
    setIndex(prev => prev + 1);
  };

  if(selezionate.length === 0) return <p>Caricamento...</p>;

  // Controllo se abbiamo finito le 5 carte
  const finito = index >= selezionate.length;

  return (
    <div className="App">
      <h1>Flashcard JLPT</h1>

      {!finito ? (
        <div className="card-container">
          <div 
            className={`card ${flipped ? "flipped" : ""}`} 
            onClick={() => setFlipped(!flipped)}
          >
            <div className="front">
              <div className="flip-icon">🔄</div>
              <h2>{selezionate[index].livello} - {selezionate[index].parola}</h2>
            </div>
            <div className="back">
              <div className="flip-icon">🔄</div>
              <p><strong>Lettura:</strong> {selezionate[index].lettura}</p>
              <p><strong>Significato:</strong> {selezionate[index].significato}</p>
              <p><em>{selezionate[index].frase}</em></p>
            </div>
          </div>
          <button onClick={prossimaCarta}>Avanti</button>
        </div>
      ) : (
        <div className="riepilogo">
          <h2>Riepilogo</h2>
          <ul>
            {selezionate.map((p, i) => (
              <li key={i}>{p.livello} - {p.parola}</li>
            ))}
          </ul>
          <button onClick={() => generaCasuali()}>Altre 5</button>
        </div>
      )}
    </div>
  );
}

export default App;
