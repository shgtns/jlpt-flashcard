const fs = require("fs");
const kuromoji = require("kuromoji");

// Converti katakana -> hiragana
function kataToHira(str) {
  return String(str || "").replace(/[\u30A1-\u30F6]/g, s =>
    String.fromCharCode(s.charCodeAt(0) - 0x60)
  );
}

// Testa se una stringa contiene almeno un kanji.
function containsKanji(text) {
  if (!text) return false;
  try {
    return /\p{Script=Han}/u.test(text);
  } catch (e) {
    return /[一-龯]/.test(text);
  }
}

const inputPath = process.argv[2] || "./parole.json";
const outputPath = process.argv[3] || "./parole_furigana.json";
const dictPath = process.argv[4] || "./src/Utils/dict"; // passare percorso dict se diverso

kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
  if (err) throw err;

  const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  const arricchito = data.map(item => {
    if (item.frase && item.frase.trim() !== "") {
      const tokens = tokenizer.tokenize(item.frase);
      const fraseHtml = tokens.map(token => {
        const surf = token.surface_form || "";
        const reading = token.reading || "";

        // Aggiungiamo <ruby> SOLO se il token contiene kanji
        if (containsKanji(surf) && reading) {
          return `<ruby>${surf}<rt>${kataToHira(reading)}</rt></ruby>`;
        }
        // Altrimenti restituiamo la surface così com'è (kana, punteggiatura, ecc.)
        return surf;
      }).join("");
      return { ...item, frase_furigana: fraseHtml };
    } else {
      return { ...item, frase_furigana: "" };
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(arricchito, null, 2), "utf8");
  console.log(`Processato! Le frasi con furigana sono in ${outputPath}`);
});