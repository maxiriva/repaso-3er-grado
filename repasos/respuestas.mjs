// Respuestas del cuadernillo, separadas por materia. Salen de la hoja de respuestas original (24/10).
// pages = páginas del cuadernillo fuente (1 = primera) que corresponden a cada materia.
export const intro = "Los números coinciden con los del repaso. Donde dice “libre”, valorá que la respuesta tenga sentido, mayúscula y punto.";

export const subjects = [
  {
    id: "comunicacion", name: "Comunicación", color: "#C04A24", pages: [2, 5], lang: "es",
    levels: [
      ["Nivel 1", [
        "Mateo y su abuelo.",
        "En la Costanera de Asunción.",
        "Un sábado de mucho viento.",
        "Rojo.",
        "F · V · F (volvieron cansados y felices).",
        "el, una, los, unas.",
        "P · C · P · C.",
        "barrilete–sustantivo · rojo–adjetivo · corrió–verbo · el–artículo.",
        "jirafa, gato, viaje, guitarra · huevo, helado, zanahoria, hormiga · lluvia, playa, gallina, ayer.",
      ]],
      ["Nivel 2", [
        "3 · 1 · 4 · 2.",
        "b) comparación.",
        "“subió, subió y subió”.",
        "“El viento cantaba entre los árboles”.",
        "Tres de estos: rojo, largo, gigante, triste, cansados, felices.",
        "correr · subir · volver · atar.",
        "Él · Ellos.",
        "pasado · presente · futuro.",
      ]],
      ["Nivel 3", [
        "En el patio de la escuela.",
        "Riega las lechugas.",
        "El sol abraza las plantas–personificación · despacio, despacio, despacio–repetición · verdes como el pasto–comparación.",
        "presente · pasado · futuro.",
        "voló · vuela · volará (también vale “va a volar”).",
        "El hilo se enredó en una rama; el abuelo lo soltó con paciencia.",
        "Libre. Ejemplo: “La lluvia golpea la ventana para que la dejen entrar”.",
        "Libre.",
      ]],
    ],
    dictation: {
      title: "Dictados (leer en voz alta, despacio, dos veces cada palabra)",
      lists: [
        ["Dictado 1 · g y j", "gato, guitarra, girasol, gigante, imagen, jirafa, jugo, viaje, tijera, reloj"],
        ["Dictado 2 · h", "huevo, hielo, hoja, hormiga, helado, hermano, hospital, ahora, zanahoria, búho"],
        ["Dictado 3 · ll y y", "lluvia, llave, gallina, estrella, caballo, ayer, playa, payaso, desayuno, hoy"],
        ["Dictado final · mezcla", "colegio, página, conejo, paisaje, hermano, calle, ardilla, amarillo, rey, yema"],
      ],
      sentences: "1) Ayer llovió y la gallina se escondió debajo de la silla. 2) Mi hermano come un huevo con jugo en el desayuno. 3) La jirafa gigante mira el paisaje amarillo.",
      tips: "Con ga, go, gu va g; para “gue, gui” se agrega u. Terminadas en -aje van con j; en -gen, con g. Hue- y hie- llevan h. La y al final suena “i” (rey, hoy). Terminadas en -illo / -illa van con ll.",
    },
  },
  {
    id: "guarani", name: "Guaraní", color: "#23864F", pages: [6, 9], lang: "es",
    levels: [
      ["Nivel 1", [
        "Juli ha ijagua Toto.",
        "Juli.",
        "Toto.",
        "kuarahy–sol · guyra–pájaro · yvyra–árbol · pyhare–noche.",
        "che–yo · nde–tú/vos · ha'e–él/ella · ñande–nosotros (con el que escucha) · ore–nosotros (sin el que escucha) · peẽ–ustedes · ha'ekuéra–ellos/ellas.",
        "Persona: mitã, sy · Animal: jagua, mbarakaja · Cosa/naturaleza: óga, yvyra · Nombre propio: Paraguái, Pedro.",
      ]],
      ["Nivel 2", [
        "Óga michĩme, ñu ykére (en una casa pequeña, al lado del campo).",
        "Morotĩ (blanco).",
        "J · A · A · J.",
        "3 · 1 · 4 · 2.",
        "Che · Nde · Ñande · Peẽ · Ore.",
        "Ko · Amo.",
        "jagua tuicha · óga morotĩ · mbarakaja hũ · kuarahy sa'yju.",
      ]],
      ["Nivel 3", [
        "Isy (su mamá).",
        "Ama ryapu: tak, tak, tak (el ruido de la lluvia).",
        "olfato · oído · vista.",
        "“Ama ojeroky óga ári” (la lluvia baila sobre la casa).",
        "b) Un día de Juli con su perro Toto.",
        "“Toto oñani pya'e yvytúicha”.",
        "karu: akaru, rekaru, okaru, jakaru, rokaru, pekaru, okaru · hai: ahai, rehai, ohai, jahai, rohai, pehai, ohai.",
        "Libre. Revisar que el adjetivo vaya después del sustantivo y que el prefijo coincida con el pronombre.",
      ]],
    ],
    note: "La grafía y el vocabulario pueden variar un poco según el libro de la escuela. Si la maestra usa otra palabra, vale la del libro.",
  },
  {
    id: "matematica", name: "Matemática", color: "#2B64C8", pages: [10, 12], lang: "es",
    levels: [
      ["Nivel 1", [
        "15.000 Gs.",
        "42.000 Gs.",
        "100 · 200 · 500.",
        "60 · 30 · 120.",
        "m · cm · m · cm.",
        "V · F (es 4) · V.",
      ]],
      ["Nivel 2", [
        "32.000 + 6.000 = 38.000; 50.000 − 38.000 = 12.000 Gs.",
        "3 × 4.000 = 12.000; 20.000 − 12.000 = 8.000 Gs.",
        "4 × 6 = 24; 24 − 3 = 21 bancos.",
        "28 ÷ 4 = 7; 7 − 2 = 5 caramelos.",
        "3 m = 300 cm; 300 − 80 = 220 cm.",
        "4:30.",
        "a) 20.000 + 10.000 + 5.000.",
      ]],
      ["Nivel 3", [
        "Todo: 90.000. Partes: pelota 35.000 y remera ?. 90.000 − 35.000 = 55.000 Gs.",
        "Sofía 45.000; Tomás = 45.000 − 18.000 = 27.000 Gs. Juntos: 45.000 + 27.000 = 72.000 Gs.",
        "Bici = 3 × 25.000 = 75.000 Gs. Juntas: 75.000 + 25.000 = 100.000 Gs.",
        "30 minutos. Saliendo 10 minutos más tarde llega a las 7:55.",
        "10 ÷ 2 = 5 banderas. 3 × 2 = 6; 10 − 6 = 4 m.",
        "Libre: revisar que tenga dos pasos (suma y resta) y respuesta con oración.",
      ]],
    ],
    note: "Billetes y monedas según la lista oficial del Banco Central del Paraguay. El BCP está renovando el diseño de algunos billetes; los valores no cambian.",
  },
  {
    id: "vida-social", name: "Vida Social y Trabajo", color: "#986207", pages: [13, 14], lang: "es",
    levels: [
      ["Nivel 1", [
        "ganadería · agricultura · minera · forestal.",
        "1537–Fundación de Asunción · 1811–Independencia · Guaraníes–Primeros pobladores de la Región Oriental.",
        "El 15 de mayo (la revolución fue la noche del 14 al 15 de mayo de 1811).",
      ]],
      ["Nivel 2", [
        "F · V · V · F (empezó en 1537) · V.",
        "b) Juan de Salazar de Espinosa.",
        "a) cuero.",
        "Dos de estos: Pedro Juan Caballero, Fulgencio Yegros, José Gaspar Rodríguez de Francia, Vicente Ignacio Iturbe.",
      ]],
      ["Nivel 3", [
        "3 · 1 · 2.",
        "Porque los árboles dan sombra, aire limpio y hogar a los animales; si se cortan y no se plantan nuevos, se pierde el bosque.",
        "Porque nacen bebés y porque llegan personas de otros lugares (migración).",
        "Una persona que nace de la mezcla de dos pueblos, como españoles y guaraníes.",
      ]],
    ],
  },
  {
    id: "language-arts", name: "Language Arts", color: "#704DC0", pages: [15, 16], lang: "en",
    levels: [
      ["Level 1", [
        "On a farm.",
        "In the city.",
        "T · F (he walks to the store and takes the bus) · T.",
        "big–large · happy–glad · fast–quick · start–begin.",
        "cold · down · close (or shut) · night.",
        "P · C · C · P · C · P.",
      ]],
      ["Level 2", [
        "Only Carla: lives on a farm, feeds horses and pigs, sees many stars, rides a horse. Both: go to school, love sports. Only Jorge: lives in the city, walks to the store, plays soccer in a park, takes the bus.",
        "but.",
        "ar: farm, yard, dark, stars, park · or: horses, morning, sports · ore: store.",
        "dark · fork · store.",
      ]],
      ["Level 3", [
        "“Jorge is going to visit Carla's farm.” / “He will learn to ride a horse!”",
        "will · going to · going to.",
        "Example: “Both dogs and cats have four legs.”",
        "Example: “A dog barks, but a cat meows.”",
      ]],
    ],
  },
  {
    id: "science", name: "Science and Health", color: "#10808C", pages: [17, 18], lang: "en",
    levels: [
      ["Level 1", [
        "thermometer–temperature · rain gauge–amount of rain · anemometer–wind speed · wind vane–wind direction.",
        "meteorologist · forecast · drought · habitat.",
        "F (it measures temperature) · T · T.",
      ]],
      ["Level 2", [
        "b) rain gauge.",
        "b) Water gets into homes.",
        "N · P · N · P.",
        "Two of: stay inside, stay away from windows and tall trees, listen to warnings, have a flashlight and an emergency kit.",
      ]],
      ["Level 3", [
        "Example: some birds move to another forest, some adapt and nest in other places, others may die if they cannot find food or shelter.",
        "That a storm or bad weather is coming.",
        "Without rain, plants and crops do not grow and animals have less water.",
        "Endangered: very few are left and they could disappear. Extinct: none are left anywhere.",
      ]],
    ],
  },
  {
    id: "social-studies", name: "Social Studies", color: "#B83C70", pages: [19, 20], lang: "en",
    levels: [
      ["Level 1", [
        "N · W · N · W · N · W.",
        "S · G · S · G.",
        "producer–a person who makes goods or gives services · consumer–a person who buys or uses things · income–money you earn.",
      ]],
      ["Level 2", [
        "natural · capital · human · natural · capital.",
        "b) saving.",
        "c) scarcity.",
        "T · F (clothes are a need) · T.",
      ]],
      ["Level 3", [
        "Example: natural–corn flour, milk or water · human–the baker · capital–the oven (tatakua) or the bowl.",
        "Free answer. Check that spending + saving = 20.000 Gs.",
        "To get things they need or want that they do not have.",
        "Free answer. Makes things = goods; helps people = service.",
      ]],
    ],
  },
];
