// Word pool for memorization practice
const WORD_POOL: string[] = [
  "apple",
  "bridge",
  "castle",
  "dolphin",
  "eagle",
  "forest",
  "garden",
  "horizon",
  "island",
  "jungle",
  "kite",
  "lantern",
  "mountain",
  "nebula",
  "ocean",
  "pyramid",
  "quartz",
  "rainbow",
  "sunset",
  "thunder",
  "umbrella",
  "volcano",
  "whisper",
  "xylophone",
  "yacht",
  "zenith",
  "anchor",
  "balloon",
  "compass",
  "diamond",
  "eclipse",
  "falcon",
  "glacier",
  "harbor",
  "igloo",
  "jasmine",
  "kingdom",
  "lighthouse",
  "meteor",
  "notebook",
  "orchid",
  "phoenix",
  "quicksand",
  "river",
  "starlight",
  "twilight",
  "universe",
  "velvet",
  "waterfall",
  "zephyr",
  "amber",
  "brisk",
  "carve",
  "mint",
  "slope",
  "crimp",
  "eager",
  "faint",
  "slick",
  "brim",
  "torch",
  "clasp",
  "prune",
  "vivid",
  "charm",
  "creek",
  "blunt",
  "patch",
  "dwell",
  "hush",
  "ash",
  "glide",
  "snarl",
  "sprout",
  "keen",
  "craft",
  "dune",
  "crisp",
  "roam",
  "trace",
  "shift",
  "ember",
  "hollow",
  "gale",
  "steep",
  "murky",
  "sober",
  "flint",
  "cedar",
  "bloom",
  "grain",
  "twist",
  "plume",
  "plush",
  "cloak",
  "stark",
  "gorge",
  "brink",
  "swell",
  "rogue",
  "twine",
  "froth",
  "glare",
  "mossy",
  "lucid",
  "churn",
  "fetch",
  "grime",
  "ripple",
  "maple",
  "spire",
  "spur",
  "whisp",
  "knoll",
  "tether",
  "sprig",
  "flake",
  "spool",
  "quiet",
  "bellow",
  "clutch",
  "glint",
  "hefty",
  "drape",
  "smirk",
  "quaint",
  "brood",
  "swift",
  "noble",
  "droop",
  "veer",
  "spout",
  "linen",
  "moss",
  "waver",
  "gleam",
  "flurry",
  "frost",
  "blush",
  "grin",
  "spade",
  "envy",
  "syrup",
  "brittle",
];

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets a 2D array of random words based on rows and columns
 * @param rows - number of rows
 * @param cols - number of columns
 * @returns 2D array of words [row][col]
 */
export function getWords(rows: number, cols: number): string[][] {
  const totalWords = rows * cols;
  
  // If we need more words than available, repeat the pool
  const words: string[] = [];
  while (words.length < totalWords) {
    words.push(...shuffleArray(WORD_POOL));
  }
  
  // Create 2D array
  const result: string[][] = [];
  for (let i = 0; i < rows; i++) {
    result.push(words.slice(i * cols, (i + 1) * cols));
  }
  
  return result;
}

