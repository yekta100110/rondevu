/**
 * GSM 7-bit ASCII Transliteration Helper
 * Converts Turkish characters and typographical Unicode characters to standard GSM 7-bit ASCII
 * to prevent UCS-2 encoding escalation (dropping segment capacity from 160 to 70 characters).
 */

const TURKISH_ASCII_MAP: Record<string, string> = {
  // Turkish special characters
  "ç": "c",
  "Ç": "C",
  "ğ": "g",
  "Ğ": "G",
  "ı": "i",
  "İ": "I",
  "ö": "o",
  "Ö": "O",
  "ş": "s",
  "Ş": "S",
  "ü": "u",
  "Ü": "U",
  // Circumflex letters
  "â": "a",
  "Â": "A",
  "î": "i",
  "Î": "I",
  "û": "u",
  "Û": "U",
  // Typographical punctuation & dashes
  "’": "'",
  "‘": "'",
  "“": '"',
  "”": '"',
  "–": "-",
  "—": "-",
  "…": "...",
  "\u00A0": " ", // non-breaking space
};

/**
 * Sanitizes and transliterates an SMS message string into standard GSM 7-bit ASCII.
 */
export function sanitizeSmsText(text: string): string {
  if (!text) return "";

  let result = text;
  for (const [char, replacement] of Object.entries(TURKISH_ASCII_MAP)) {
    result = result.replaceAll(char, replacement);
  }

  // Strip remaining combining diacritical marks if any
  result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Collapse multiple whitespaces/tabs (preserve single space) and trim
  return result.replace(/[ \t]+/g, " ").trim();
}
