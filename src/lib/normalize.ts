// Priprema teksta za pretragu neosetljivu na velika/mala slova i dijakritike.
// Kombinovani znaci (š→s, č→c, ć→c, ž→z) se uklanjaju preko NFD dekompozicije;
// „đ"/„Đ" nisu kompozitni pa ih menjamo ručno u „d".
// Primeri: "Niš" → "nis", "Đorđe" → "dorde".
export function foldDiacritics(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d"); // đ (posle toLowerCase i Đ postaje đ)
}
