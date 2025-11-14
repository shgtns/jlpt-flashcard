// merge.js
const fs = require("fs");

// --- CONFIG ---
const SIMPLE_PATH = "./src/utils/dict/baselist.json";
const DICT_PATH = "./src/utils/dict/jmdict-common.json";
const OUTPUT_PATH = "./merged.json";

// ------------------
// Helpers
// ------------------

// Normalizza kana/kanji
function norm(str) {
  return str ? str.trim() : "";
}

// Mappa POS del dict a versione leggibile
const posMap = {
  "n": "Noun",
  "n-adv": "Adverbial noun",
  "n-suf": "Noun/Suffix",
  "n-pref": "Noun/Prefix",
  "n-pr": "Proper noun",
  "n-pri": "Proper noun (irr)",
  "n-t": "Temporal noun",
  "pn": "Pronoun",
  "num": "Numeral",
  "adj-i": "I-adjective",
  "adj-na": "Na-adjective",
  "adj-no": "Noun as adjective",
  "adj-t": "Taru-adjective",
  "adj-pn": "Pre-noun adjectival",
  "adv": "Adverb",
  "adv-to": "Adverb 'to'",
  "int": "Interjection",
  "conj": "Conjunction",
  "prt": "Particle",
  "aux": "Auxiliary",
  "aux-v": "Auxiliary verb",
  "aux-adj": "Auxiliary adjective",
  "vs": "Verb (suru)",
  "vs-i": "Verb (suru irregular)",
  "vs-s": "Verb (suru special)",
  "v1": "Verb (ichidan)",
  "vz": "Ichidan verb -zuru special",
  "vk": "Kuru verb (来る)",
  "v5": "Verb (godan)",
  "v5aru": "Godan verb -aru special",
  "v5b": "Godan verb 'bu'",
  "v5g": "Godan verb 'gu'",
  "v5k": "Godan verb 'ku'",
  "v5k-s": "Godan verb 'ku' (special)",
  "v5m": "Godan verb 'mu'",
  "v5n": "Godan verb 'nu'",
  "v5r": "Godan verb 'ru'",
  "v5r-i": "Godan verb 'ru' (irr)",
  "v5s": "Godan verb 'su'",
  "v5t": "Godan verb 'tsu'",
  "v5u": "Godan verb 'u'",
  "v5u-s": "Godan verb 'u' (special)",
  "v5k-irreg": "Godan verb irr 'iku/yuku'",
  "vn": "Irregular nu verb",
  "vr": "Irregular ru verb",
  "vt": "Transitive verb",
  "vi": "Intransitive verb",
  "exp": "Expression",
  "id": "Idiomatic expression",
  "pref": "Prefix",
  "suf": "Suffix",
  "unc": "Unclassified",
  "u": "Abbreviation"
};

function convertPOS(posArray) {
  if (!Array.isArray(posArray)) return [];
  const out = posArray.map(p => posMap[p] || p);
  return [...new Set(out)];
}

// Conversione level numerico → N-level
function convertLevel(row) {
  const levelMap = { 1: "N1", 2: "N2", 3: "N3", 4: "N4", 5: "N5" };
  if (row.level && levelMap[row.level]) {
    return { ...row, level: levelMap[row.level] };
  }
  return row;
}

// ------------------
// MATCH HELPERS
// ------------------
function findKanjiMatches(dict, word) {
  return dict.filter(entry =>
    entry.kanji?.some(k => k.common === true && norm(k.text) === norm(word))
  );
}

function findKanaMatches(entries, furigana) {
  return entries.filter(entry =>
    entry.kana?.some(k => k.common === true && norm(k.text) === norm(furigana))
  );
}

function findKanaOnlyMatches(dict, word) {
  return dict.filter(entry =>
    entry.kana?.some(k => k.common === true && norm(k.text) === norm(word))
  );
}

function extractSenseData(entry) {
  if (!entry || !entry.sense || !entry.sense.length) {
    return { pos: [], gloss: [] };
  }
  const s0 = entry.sense[0];
  const pos = convertPOS(s0.partOfSpeech || []);
  const gloss = (s0.gloss || []).map(g => g.text);
  return { pos, gloss };
}

// ------------------
// MAIN MERGE LOGIC
// ------------------
function mergeData(simple, dict) {
  const result = [];

  for (const row of simple) {
    const word = norm(row.word);
    const furigana = norm(row.furigana);
    let selected = null;

    let kanjiMatches = findKanjiMatches(dict, word);
    if (kanjiMatches.length > 0) {
      let kanaMatches = findKanaMatches(kanjiMatches, furigana);
      if (kanaMatches.length >= 1) {
        selected = kanaMatches[0];
      } else {
        selected = kanjiMatches[0];
      }
    } else {
      let kanaOnly = findKanaOnlyMatches(dict, word);
      if (kanaOnly.length >= 1) {
        selected = kanaOnly[0];
      }
    }

    let dict_id = null;
    let pos = [];
    let extra_meanings = [];

    if (selected) {
      dict_id = selected.id;
      const sense = extractSenseData(selected);
      pos = sense.pos;
      const mainMeaning = norm(row.meaning || "");
      extra_meanings = sense.gloss.filter(
        g => norm(g).toLowerCase() !== mainMeaning.toLowerCase()
      );
    }

    // Conversione level + aggiunta campo example
    const rowWithLevel = convertLevel(row);

    result.push({
      ...rowWithLevel,
      dict_id,
      pos,
      extra_meanings,
      example: ""   // <-- nuovo campo aggiunto
    });
  }

  return result;
}

// ------------------
// RUN
// ------------------
function run() {
  const simple = JSON.parse(fs.readFileSync(SIMPLE_PATH, "utf8"));
  const rawDict = JSON.parse(fs.readFileSync(DICT_PATH, "utf8"));
  const dict = rawDict.words;

  const merged = mergeData(simple, dict);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2), "utf8");
  console.log(`Merge completato! Salvato in ${OUTPUT_PATH}`);
}

run();
