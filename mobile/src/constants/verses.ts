export interface BibleVerse {
  text: string;
  reference: string;
}

export const BIBLE_VERSES: BibleVerse[] = [
  {
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fara.",
    reference: "Salmos 37:5",
  },
  {
    text: "O Senhor e o meu pastor; nada me faltara.",
    reference: "Salmos 23:1",
  },
  {
    text: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
  },
  {
    text: "Alegrai-vos na esperanca, sede pacientes na tribulacao, perseverai na oracao.",
    reference: "Romanos 12:12",
  },
  {
    text: "Porque para Deus nada e impossivel.",
    reference: "Lucas 1:37",
  },
  {
    text: "O Senhor e a minha luz e a minha salvacao; a quem temerei?",
    reference: "Salmos 27:1",
  },
  {
    text: "Confia no Senhor de todo o teu coracao e nao te estribes no teu proprio entendimento.",
    reference: "Proverbios 3:5",
  },
  {
    text: "Este e o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.",
    reference: "Salmos 118:24",
  },
  {
    text: "Lancando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vos.",
    reference: "1 Pedro 5:7",
  },
  {
    text: "Se Deus e por nos, quem sera contra nos?",
    reference: "Romanos 8:31",
  },
  {
    text: "O choro pode durar uma noite, mas a alegria vem pela manha.",
    reference: "Salmos 30:5",
  },
  {
    text: "Esforca-te e tem bom animo; nao temas, nem te espantes.",
    reference: "Josue 1:9",
  },
];

export function getRandomVerse() {
  return BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
}
