// Forgiving product search. Customers often don't know a product's exact name,
// so a word counts as found when it is:
//   - part of a word in the product's text ("vit" finds "vitamin"),
//   - spelled with small mistakes ("vitamn", "omga", "zink"),
//   - written with or without spaces/dashes ("omega3" finds "Omega-3").
// Products are ranked so the closest matches come first. If nothing matches
// every word, products matching some of the words are returned instead, marked
// as similar rather than exact.

/** Lowercase, no accents, punctuation turned into spaces. */
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Little words that would match almost everything (English and Swahili).
const STOP_WORDS = new Set(["a", "an", "and", "for", "of", "the", "with", "na", "ya", "za", "wa", "kwa", "la", "cha", "vya", "katika"]);

/** Edit distance between a and b (with swapped neighbours counted as one edit), or max+1 once it exceeds max. */
function distance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prevPrev: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prevPrev[j - 2] + 1);
      row.push(d);
      best = Math.min(best, d);
    }
    if (best > max) return max + 1;
    prevPrev = prev;
    prev = row;
  }
  return prev[b.length];
}

/** How many typos a typed word may contain and still count. */
function allowedTypos(word: string) {
  if (word.length <= 3) return 0;
  if (word.length <= 6) return 1;
  return 2;
}

type Field = { words: string[]; text: string; compact: string };

function field(text: string): Field {
  const norm = normalize(text);
  return { words: norm.split(" ").filter(Boolean), text: norm, compact: norm.replace(/ /g, "") };
}

/** English plurals count as the singular: "vitamins" -> "vitamin", "batteries" -> "battery". */
function singular(word: string) {
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return null;
}

/** 0 = not found; higher = better. */
function wordScore(word: string, f: Field) {
  const one = singular(word);
  return Math.max(rawWordScore(word, f), one ? rawWordScore(one, f) : 0);
}

function rawWordScore(word: string, f: Field) {
  if (f.words.includes(word)) return 4; // whole word
  // A single letter (the "c" in "vitamin c") only counts as a whole word.
  if (word.length === 1) return 0;
  if (f.words.some((w) => w.startsWith(word))) return 3; // start of a word: "vit" -> "vitamin"
  if (word.length >= 3 && f.words.some((w) => w.includes(word))) return 2; // inside a word: "vitamin" -> "multivitamin"
  // Written without a space or dash: "omega3" -> "Omega-3", "toothpaste" -> "Tooth Paste".
  // Only for longer or numbered words, so short ones don't match across word gaps.
  if ((word.length >= 5 || /\d/.test(word)) && f.compact.includes(word)) return 2;
  const max = allowedTypos(word);
  if (max === 0) return 0;
  // Typos: compare with each word, its start (half-typed "vitamn") and, for longer
  // words, any stretch inside it ("vitamn" -> "multivitamin").
  for (const w of f.words) {
    if (distance(word, w, max) <= max) return 1;
    if (w.length <= word.length) continue;
    for (let start = 0; start + word.length <= w.length; start++) {
      if (start > 0 && word.length < 5) break;
      if (distance(word, w.slice(start, start + word.length), max) <= max) return 1;
    }
  }
  return 0;
}

export type SearchFields = { name: string; other: string };

/**
 * Ranks items against a search query.
 * `fields(item)` gives the item's name (counts double) and its other searchable text.
 * Returns the matches, best first, and whether they match every word (exact) or only some (similar).
 */
export function search<T>(items: T[], query: string, fields: (item: T) => SearchFields) {
  const all = normalize(query).split(" ").filter(Boolean);
  const meaningful = all.filter((w) => !STOP_WORDS.has(w));
  const words = meaningful.length ? meaningful : all;
  if (!words.length) return { results: items, exact: true };

  // Score of every word against every item. A raw score of 1 means "only with typos".
  const perItem = items.map((item) => {
    const { name, other } = fields(item);
    const n = field(name);
    const o = field(`${name} ${other}`);
    return words.map((w) => {
      const inName = wordScore(w, n);
      const anywhere = wordScore(w, o);
      return { score: Math.max(inName * 2, anywhere), typoOnly: Math.max(inName, anywhere) === 1 };
    });
  });

  // When a word is spelled correctly somewhere, don't also count near-misses for it
  // ("zinc" shouldn't bring in everything one letter away from "zinc").
  const hasRealMatch = words.map((_, i) => perItem.some((scores) => scores[i].score > 0 && !scores[i].typoOnly));

  const scored = items.map((item, index) => {
    let score = 0;
    let found = 0;
    perItem[index].forEach(({ score: s, typoOnly }, i) => {
      if (s === 0 || (typoOnly && hasRealMatch[i])) return;
      found++;
      score += s;
    });
    return { item, index, score, found };
  });

  const rank = (a: (typeof scored)[number], b: (typeof scored)[number]) =>
    b.found - a.found || b.score - a.score || a.index - b.index;

  const exact = scored.filter((s) => s.found === words.length).sort(rank);
  if (exact.length) return { results: exact.map((s) => s.item), exact: true };

  const similar = scored.filter((s) => s.found > 0).sort(rank);
  return { results: similar.map((s) => s.item), exact: false };
}
