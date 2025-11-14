import { useEffect, useState } from "react";
import Furigana from "./Furigana";
import FraseFurigana from "./FraseFurigana";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

function App() {
  const [parole, setParole] = useState([]);
  const [selezionate, setSelezionate] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [risposteCorrette, setRisposteCorrette] = useState(0);


    // Carica JSON
  useEffect(() => {
    fetch("./wordlist.json")
      .then(res => res.json())
      .then(data => {
        setParole(data);
        generaCasuali(data);
      });
  }, []);

  // Genera 5 parole casuali (una per livello)
  const generaCasuali = (lista = parole) => {
    const livelli = ["N5","N4","N3","N2","N1"];
    const random = livelli.map(lvl => {
      const subset = lista.filter(p => p.level === lvl);
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
              <div className="livello"><p><strong>{selezionate[index].level}</strong></p></div>
              <h2 className="nihongo">{selezionate[index].word}</h2>
            </div>
            <div className="back">
              <div className="flip-icon"><i className="fas fa-sync-alt"></i></div>
              <div className="livello"><p><strong>{selezionate[index].level}</strong></p></div>
              <p className="word nihongo"><Furigana word={selezionate[index]?.word || ""} furigana={selezionate[index]?.furigana || ""} /></p>
              <p className="significato">{selezionate[index].meaning}</p>
              <p className="pos">{selezionate[index]["Vocab-pos"]}</p>
{/*              <p className="example"><em>
                  <FraseFurigana html={selezionate[index]?.frase_furigana || selezionate[index]?.frase || ""} />
                </em></p>*/}
              <p className="jisho"><a href={`https://jisho.org/search/${encodeURIComponent(selezionate[index].word)}%20%23sentences`} target="_blank" rel="noreferrer">
                       Cerca frasi su Jisho
                     </a></p>
              <p className="jisho"><a href={`https://jisho.org/search/${encodeURIComponent(selezionate[index].word)}`} target="_blank" rel="noreferrer">
                       Cerca parola su Jisho
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
            <p>{risposteCorrette} su {selezionate.length} parole!</p>
            <ul>
              {selezionate.map((p, i) => (
                <li key={i}>{p.level} - {p.word} - {p.furigana}</li>
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
