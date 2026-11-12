const TEAM_PRINT_OPTIONS = Object.freeze({
  "AC Milan": [["Kaká", "22"], ["Christian Pulisic", "11"], ["Rafael Leão", "10"]],
  Barcelona: [["Lamine Yamal", "10"], ["Raphinha", "11"], ["Pedri", "8"]],
  "Real Madrid": [["Kylian Mbappé", "10"], ["Jude Bellingham", "5"], ["Vinícius Jr.", "7"]],
  "París Saint-Germain": [["Ousmane Dembélé", "10"], ["Khvicha Kvaratskhelia", "7"], ["Achraf Hakimi", "2"]],
  "Al-Nassr": [["Cristiano Ronaldo", "7"], ["Sadio Mané", "10"], ["Marcelo Brozović", "77"]],
  Argentina: [["Lionel Messi", "10"], ["Julián Álvarez", "9"], ["Lautaro Martínez", "22"], ["Emiliano Martínez", "23"], ["Diego Maradona", "10"]],
  "Bayern Múnich": [["Harry Kane", "9"], ["Michael Olise", "17"], ["Luis Díaz", "14"]],
  Chelsea: [["Cole Palmer", "10"], ["Morgan Rogers", "27"], ["Moisés Caicedo", "25"]],
  "Inter de Milán": [["Lautaro Martínez", "10"], ["Marcus Thuram", "9"], ["Nicolò Barella", "23"]],
  Juventus: [["Kenan Yıldız", "10"], ["Dušan Vlahović", "9"], ["Manuel Locatelli", "5"]],
  "Manchester United": [["Bruno Fernandes", "8"], ["Mason Mount", "7"], ["Matheus Cunha", "10"]],
  "Manchester City": [["Erling Haaland", "9"], ["Enzo Fernández", "17"], ["Phil Foden", "47"]],
  Napoli: [["Khvicha Kvaratskhelia", "77"], ["Matteo Politano", "21"], ["Scott McTominay", "8"]],
  Noruega: [["Erling Haaland", "9"], ["Martin Ødegaard", "10"], ["Alexander Sørloth", "7"]],
  "Inter Miami": [["Lionel Messi", "10"], ["Luis Suárez", "9"], ["Sergio Busquets", "5"]],
});

const RETRO_PRINT_NUMBERS = Object.freeze({
  "milan-2007": "22",
  "milan-larga": "22",
  "milan-kaka-retro": "22",
  "argentina-batistuta": "9",
  "argentina-maradona-10": "10",
  "manutd-final-2008": "7",
  "napoli-maradona-retro": "10",
});

window.RINCON_PRODUCTS = Object.freeze([
  { id: "milan-2007", name: "AC Milan · Manga larga", team: "AC Milan", category: "AC Milan", image: "assets/milan-2007.png", tag: "RETRO · MANGA LARGA", player: "Kaká", type: "retro" },
  { id: "milan-larga", name: "AC Milan · Clásica", team: "AC Milan", category: "AC Milan", image: "assets/milan-long-sleeve.png", tag: "RETRO · CLÁSICA", player: "Kaká", type: "retro" },
  { id: "barca-dark", name: "Barcelona · Visitante", team: "Barcelona", category: "Barcelona", image: "assets/barcelona-dark.png", tag: "VISITANTE", player: "Lamine Yamal" },
  { id: "madrid-green", name: "Real Madrid · Visitante verde", team: "Real Madrid", category: "Real Madrid", image: "assets/madrid-green.png", tag: "VISITANTE", player: "Kylian Mbappé" },
  { id: "madrid-white", name: "Real Madrid · Local clásica", team: "Real Madrid", category: "Real Madrid", image: "assets/madrid-white.png", tag: "CLÁSICA", player: "Jude Bellingham" },
  { id: "barca-home", name: "Barcelona · Azulgrana local", team: "Barcelona", category: "Barcelona", image: "assets/barcelona-home.png", tag: "LOCAL", player: "Lamine Yamal" },
  { id: "psg-home", name: "París Saint-Germain · Local", team: "París Saint-Germain", category: "Otros", image: "assets/psg-home.png", tag: "LOCAL", player: "Khvicha Kvaratskhelia" },
  { id: "argentina-teal-23", name: "Argentina · Edición especial #23", team: "Argentina", category: "Otros", image: "assets/argentina-teal-front.jpeg", gallery: ["assets/argentina-teal-back.jpeg"], tag: "EDICIÓN ESPECIAL", player: "Emiliano Martínez" },
  { id: "real-madrid-training-top", name: "Real Madrid · Suéter de entrenamiento", team: "Real Madrid", category: "Real Madrid", image: "assets/real-madrid-training-top.jpeg", tag: "ENTRENAMIENTO · SIN DORSAL", player: "", type: "training" },
  { id: "argentina-maradona-10", name: "Argentina · Retro Maradona #10", team: "Argentina", category: "Otros", image: "assets/argentina-maradona-back.jpeg", tag: "RETRO · #10", player: "Diego Maradona", type: "retro" },
  { id: "napoli-maradona-retro", name: "Napoli · Retro Buitoni", team: "Napoli", category: "Otros", image: "assets/napoli-retro-front.jpeg", tag: "RETRO", player: "Diego Maradona", type: "retro" },
  { id: "norway-haaland", name: "Noruega · Local Haaland", team: "Noruega", category: "Otros", image: "assets/norway-front.jpeg", gallery: ["assets/norway-haaland-back.jpeg"], tag: "LOCAL", player: "Erling Haaland" },
  { id: "inter-miami-messi", name: "Inter Miami · Visitante Messi", team: "Inter Miami", category: "Otros", image: "assets/inter-miami-front.jpeg", gallery: ["assets/inter-miami-messi-back.jpeg"], tag: "VISITANTE", player: "Lionel Messi" },
  { id: "milan-kaka-retro", name: "AC Milan · Retro Kaká #22", team: "AC Milan", category: "AC Milan", image: "assets/milan-kaka-front.jpeg", gallery: ["assets/milan-kaka-back.jpeg"], tag: "RETRO", player: "Kaká", type: "retro" },
  { id: "madrid-pink", name: "Real Madrid · Visitante rosa", team: "Real Madrid", category: "Real Madrid", image: "assets/madrid-pink.png", tag: "VISITANTE", player: "Jude Bellingham" },
  { id: "al-nassr-yellow", name: "Al-Nassr · Local amarilla", team: "Al-Nassr", category: "Otros", image: "assets/al-nassr-yellow.png", tag: "LOCAL", player: "Cristiano Ronaldo" },
  { id: "argentina-batistuta", name: "Argentina · Retro Batistuta", team: "Argentina", category: "Otros", image: "assets/argentina-batistuta.png", tag: "RETRO", player: "Gabriel Batistuta", type: "retro" },
  { id: "argentina-floral", name: "Argentina · Edición floral", team: "Argentina", category: "Otros", image: "assets/argentina-floral.png", tag: "SIN DORSAL", player: "", noPrint: true },
  { id: "argentina-messi-cream", name: "Argentina · Messi en crema", team: "Argentina", category: "Otros", image: "assets/argentina-messi-cream.png", tag: "EDICIÓN ESPECIAL", player: "Lionel Messi" },
  { id: "argentina-messi-navy", name: "Argentina · Messi azul oscuro", team: "Argentina", category: "Otros", image: "assets/argentina-messi-navy.png", tag: "EDICIÓN ESPECIAL", player: "Lionel Messi" },
  { id: "argentina-messi-sky", name: "Argentina · Celeste clásica", team: "Argentina", category: "Otros", image: "assets/argentina-messi-sky.png", tag: "CLÁSICA", player: "Lionel Messi" },
  { id: "bayern-purple", name: "Bayern Múnich · Edición morada", team: "Bayern Múnich", category: "Otros", image: "assets/bayern-purple.png", tag: "EDICIÓN ESPECIAL", player: "Harry Kane" },
  { id: "bayern-white-kane", name: "Bayern Múnich · Visitante", team: "Bayern Múnich", category: "Otros", image: "assets/bayern-kane.png", tag: "VISITANTE", player: "Harry Kane" },
  { id: "barcelona-foundation-cream", name: "Barcelona · Fundación clara", team: "Barcelona", category: "Barcelona", image: "assets/barcelona-white-cross.png", tag: "EDICIÓN ESPECIAL", player: "Lamine Yamal" },
  { id: "barcelona-floral", name: "Barcelona · Edición floral", team: "Barcelona", category: "Barcelona", image: "assets/barcelona-floral.png", tag: "SIN DORSAL", player: "", noPrint: true },
  { id: "barcelona-mint", name: "Barcelona · Visitante turquesa", team: "Barcelona", category: "Barcelona", image: "assets/barcelona-mint.png", tag: "VISITANTE", player: "Lamine Yamal" },
  { id: "chelsea-black-yellow", name: "Chelsea · Edición negra", team: "Chelsea", category: "Otros", image: "assets/chelsea-black-yellow.png", tag: "EDICIÓN ESPECIAL", player: "Cole Palmer" },
  { id: "inter-lautaro", name: "Inter de Milán · Local", team: "Inter de Milán", category: "Otros", image: "assets/inter-lautaro.png", tag: "LOCAL", player: "Lautaro Martínez" },
  { id: "juventus-yildiz", name: "Juventus · Local", team: "Juventus", category: "Otros", image: "assets/juventus-yildiz.png", tag: "LOCAL", player: "Kenan Yıldız" },
  { id: "manutd-blue", name: "Manchester United · Visitante azul", team: "Manchester United", category: "Otros", image: "assets/manutd-blue.png", tag: "VISITANTE", player: "Bruno Fernandes" },
  { id: "manutd-final-2008", name: "Manchester United · Final Moscú 2008", team: "Manchester United", category: "Otros", image: "assets/manutd-final-2008.png", tag: "RETRO · FINAL 2008", player: "Cristiano Ronaldo", type: "retro" },
  { id: "manutd-red-snapdragon", name: "Manchester United · Local Snapdragon", team: "Manchester United", category: "Otros", image: "assets/manutd-red-snapdragon.png", tag: "LOCAL", player: "Mason Mount" },
  { id: "manutd-white-cunha", name: "Manchester United · Visitante blanca", team: "Manchester United", category: "Otros", image: "assets/manutd-white-cunha.png", tag: "VISITANTE", player: "Matheus Cunha" },
  { id: "mancity-blue-home", name: "Manchester City · Local celeste", team: "Manchester City", category: "Otros", image: "assets/mancity-haaland-blue.png", tag: "LOCAL", player: "Erling Haaland" },
  { id: "mancity-black-away", name: "Manchester City · Visitante negra", team: "Manchester City", category: "Otros", image: "assets/mancity-haaland-black.png", tag: "VISITANTE", player: "Erling Haaland" },
  { id: "napoli-home", name: "Napoli · Local azul", team: "Napoli", category: "Otros", image: "assets/napoli-home.png", tag: "LOCAL", player: "Khvicha Kvaratskhelia" },
  { id: "psg-floral", name: "París Saint-Germain · Edición floral", team: "París Saint-Germain", category: "Otros", image: "assets/psg-floral.png", tag: "SIN DORSAL", player: "", noPrint: true },
  { id: "psg-white", name: "París Saint-Germain · Visitante blanca", team: "París Saint-Germain", category: "Otros", image: "assets/psg-white.png", gallery: ["assets/barcelona-foundation-special.png"], tag: "VISITANTE", player: "Ousmane Dembélé" },
].map((product) => {
  const printOptions = product.type === "training" || product.noPrint
    ? []
    : product.type === "retro"
    ? [{ name: product.player, number: RETRO_PRINT_NUMBERS[product.id] }]
    : TEAM_PRINT_OPTIONS[product.team].map(([name, number]) => ({ name, number }));
  return Object.freeze({
    ...product,
    printOptions: Object.freeze(printOptions.map((option) => Object.freeze({ ...option }))),
  });
}));
