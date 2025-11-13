/**
 * Script: addFuriganaToJson.js
 * 
 * Legge un file JSON con parole/frasi, aggiunge il markup furigana alle "frase" e salva tutto in un nuovo file.
 * Richiede la cartella `dict` di kuromoji disponibile localmente!
 * 
 * Usage: node addFuriganaToJson.js parole.json output.json
 */

const fs = require("fs");
const kuromoji = require("kuromoji");

// Funzione per convertire katakana in hiragana
function kataToHira(str) {
  return str.replace(/[\u30A1-\u30F6]/g, s =>
    String.fromCharCode(s.charCodeAt(0) - 0x60)
  );
}

// Prendi i path dai parametri (default: parole.json, output.json)
const inputPath = process.argv[2] || "./parole.json";
const outputPath = process.argv[3] || "./parole_furigana.json";

// Path alla cartella dict
const dictPath = "./src/utils/dict/"; // metti la cartella dict qui accanto!

kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
  if (err) throw err;

  // Leggi l'input JSON
  const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  // Elabora tutte le frasi
  const arricchito = data.map(item => {
    if (item.frase && item.frase.trim() !== "") {
      const tokens = tokenizer.tokenize(item.frase);
      // Per ogni token, se ci sono kanji, aggiungi furigana
      const fraseHtml = tokens.map(token => {
        if (token.surface_form && token.reading && token.surface_form !== token.reading) {
          // Mostra solo furigana se ci sono kanji
          return `<ruby>${token.surface_form}<rt>${kataToHira(token.reading)}</rt></ruby>`;
        }
        // Se non ci sono kanji, restituisci la parola come è
        return token.surface_form;
      }).join("");
      return { ...item, frase_furigana: fraseHtml };
    } else {
      return { ...item, frase_furigana: "" };
    }
  });

  // Scrivi il nuovo JSON con la frase arricchita
  fs.writeFileSync(outputPath, JSON.stringify(arricchito, null, 2), "utf8");

  console.log(`Processato! Le frasi con furigana sono in ${outputPath}`);
});