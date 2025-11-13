import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

function App() {
  const [parole, setParole] = useState([]);
  const [selezionate, setSelezionate] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [risposteCorrette, setRisposteCorrette] = useState(0);

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
    setRisposteCorrette(0);
  };

  const prossimaCarta = (saputo) => {
    if (saputo) setRisposteCorrette(prev => prev + 1);
    setFlipped(false);
    setIndex(prev => prev + 1);
  };

  if(selezionate.length === 0) return <p>Caricamento...</p>;

  const finito = index >= selezionate.length;

  return (
    <div className="App">
      <h1>Flashcard JLPT</h1>

      {!finito ? (
        <div className="card-container">
          <div 
            key={index} // forza il refresh per animazione
            className={`card ${flipped ? "flipped" : ""}`} 
            onClick={() => setFlipped(!flipped)}
          >
            <div className="front">
              <div className="flip-icon"><i className="fas fa-sync-alt"></i></div>
              <h2 className="nihongo">{selezionate[index].parola}</h2>
            </div>
            <div className="back">
              <div className="flip-icon"><i className="fas fa-sync-alt"></i></div>
              <p><strong>{selezionate[index].livello}</strong> - <span className="nihongo">{selezionate[index].parola}</span></p>
              <p><strong>Lettura:</strong> <span className="nihongo">{selezionate[index].lettura}</span></p>
              <p><strong>Significato:</strong> {selezionate[index].significato}</p>
              <p><em><span className="nihongo">{selezionate[index].frase}</span></em></p>
              <p><a href={`https://jisho.org/search/${encodeURIComponent(selezionate[index].parola)}%20%23sentences`} target="_blank" rel="noreferrer">
                       Cerca frasi su Jisho
                     </a></p>
            </div>
          </div>
          <div className="bottoni-risposta">
              <button className="non-saputo" onClick={() => prossimaCarta(false)}>
                <i className="fas fa-thumbs-down"></i> だめだ〜
              </button>
              <button className="saputo" onClick={() => prossimaCarta(true)}>
                <i className="fas fa-thumbs-up"></i> いいね！
              </button>
          </div>
        </div>
      ) : (
        <div className="card-container">
          <div className="riepilogo">
            <h2>Riepilogo</h2>
            <p>Hai saputo {risposteCorrette} su {selezionate.length} parole!</p>
            <ul>
              {selezionate.map((p, i) => (
                <li key={i}>{p.livello} - {p.parola} - {p.lettura}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => generaCasuali()}>Altre 5</button>
        </div>
      )}
    </div>
  );
}

export default App;
