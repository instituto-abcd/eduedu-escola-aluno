/*
 * Agrupa os segmentos do texto de completar (Model11 / Model11Prova) em blocos
 * que não podem ser separados por quebra de linha. É apenas visual: os tokens
 * (e o índice de cada lacuna) são os mesmos gerados pelo transformString do template.
 *
 * Não separa:
 * - pontuação (texto ou lacuna de pontuação) da palavra anterior: "sábado _" (.)
 * - travessão/aspas/parênteses de abertura da palavra seguinte: "— Onde"
 * - lacuna dentro de palavra, quando o texto usa 3 espaços entre palavras:
 *   "procura _ do   sua" -> "procura_do"
 * - palavra única ou soletrada: "te _ oura", "V A _ O U R A"
 */

type Segment = string | number;

const PUNCTUATION = /^[.,!?;:…)\]»”]+$/;
const OPENING = /^[—–([«“"]+$/;
const WORDISH = /^[\p{L}\p{N}]/u;

export function groupGapSegments(
  input: string,
  segments: Segment[],
  optionDescriptions: string[]
): Segment[][] {
  if (segments.length === 0) return [];

  // separador cru (espaços) antes de cada segmento
  const separators: string[] = [];
  let cursor = 0;
  for (const seg of segments) {
    let start = cursor;
    let end = cursor;
    if (typeof seg === "number") {
      const match = /_+/.exec(input.slice(cursor));
      if (match) {
        start = cursor + match.index;
        end = start + match[0].length;
      }
    } else if (seg !== "") {
      const found = input.indexOf(seg, cursor);
      if (found !== -1) {
        start = found;
        end = found + seg.length;
      }
    }
    separators.push(input.slice(cursor, start));
    cursor = end;
  }

  const texts = segments.filter(
    (s): s is string => typeof s === "string" && s !== ""
  );
  const isPunctuationSlot =
    optionDescriptions.length > 0 &&
    optionDescriptions.every((d) => PUNCTUATION.test((d ?? "").trim()));
  const usesWordSpacing = /\S {3,}\S/.test(input);
  const isSingleWord =
    !usesWordSpacing &&
    !isPunctuationSlot &&
    segments.some((s) => typeof s === "number") &&
    (texts.length <= 2 || texts.every((t) => t.length === 1));

  function mustJoin(prev: Segment, next: Segment, separator: string): boolean {
    if (isSingleWord) return true;
    if (typeof next === "number" && isPunctuationSlot) return true;
    if (typeof next === "string" && PUNCTUATION.test(next)) return true;
    if (typeof prev === "string" && OPENING.test(prev)) return true;

    const hasSlot = typeof prev === "number" || typeof next === "number";
    const bothWordish = [prev, next].every(
      (s) => typeof s === "number" || WORDISH.test(s)
    );
    return usesWordSpacing && hasSlot && bothWordish && separator.length <= 1;
  }

  const groups: Segment[][] = [[segments[0]]];
  for (let i = 1; i < segments.length; i++) {
    if (mustJoin(segments[i - 1], segments[i], separators[i])) {
      groups[groups.length - 1].push(segments[i]);
    } else {
      groups.push([segments[i]]);
    }
  }
  return groups;
}
