document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const gameContainer = document.querySelector(".game-container");
  const languageSelect = document.getElementById("language-select");
  const startScreen = document.getElementById("startScreen");
  const startGameBtn = document.getElementById("startGameBtn");
  const missionScreen = document.getElementById("missionScreen");
  const missionNumberSpan = document.getElementById("missionNumber");
  const riddleTextElem = document.getElementById("riddleText");
  const showHintBtn = document.getElementById("showHintBtn");
  const hintTextElem = document.getElementById("hintText");
  const checkInAnswerInput = document.getElementById("checkInAnswer");
  const checkInBtn = document.getElementById("checkInBtn");
  const checkInMessageElem = document.getElementById("checkInMessage");
  const insightArea = document.querySelector(".local-insight-area");
  const insightTextElem = document.getElementById("insightText");
  const nextMissionBtn = document.getElementById("nextMissionBtn");
  const endGameBtn = document.getElementById("endGameBtn");
  const summaryScreen = document.getElementById("summaryScreen");
  const completedMissionsCount = document.getElementById(
    "completedMissionsCount"
  );
  const totalPointsCount = document.getElementById("totalPointsCount");
  const badgesList = document.getElementById("badgesList");
  const recommendationsList = document.getElementById("recommendationsList");
  const restartGameBtn = document.getElementById("restartGameBtn");

  // --- Game State Variables ---
  let currentLanguage = "en"; // Default language
  let currentMissionIndex = 0;
  let completedMissions = [];
  let totalPoints = 0;
  let userBadges = new Set(); // Use a Set to store unique badges

  // --- Mock User Profile (from Questionnaire) ---
  // In a real app, this would be loaded from your backend after questionnaire submission.
  // This profile dictates mission selection and recommendations.
  const userProfile = {
    travelerType: ["culturalSeeker", "urbanExplorer"], // e.g., from Q1
    travelCompanion: "couple", // e.g., from Q2
    travelPace: "moderate", // e.g., from Q3
    dailyBudget: "comfortable", // e.g., from Q4
    rankedInterests: [
      // e.g., from Q5
      { key_name: "historyArchitecture", rank: 1 },
      { key_name: "photography", rank: 2 },
      { key_name: "culinaryDelights", rank: 3 }
    ],
    veniceQuests: ["findCicchetti", "getLost"], // e.g., from Q6
    navigationPreference: "mixed", // e.g., from Q7
    accessibilityNeeds: ["none"] // e.g., from Q8
    // arrivalDate: '2025-06-10', // Not directly used in game logic simulation, but good for context
    // departureDate: '2025-06-15',
  };

  // --- Mock Game Data (Missions, Insights, POIs) ---
  // This simulates your backend database content.
  const allMissions = [
    {
      id: "mission1_history",
      interests: ["historyArchitecture", "urbanExplorer"],
      riddle: {
        en: "I stand ancient, yet crossed by many, guarding a hidden path. My stones have seen a thousand years of whispers, though no famous sighs. Find the bridge named for the fists of old.",
        it: "Sono antico, eppure attraversato da molti, a guardia di un sentiero nascosto. Le mie pietre hanno visto mille anni di sussurri, anche se nessun sospiro famoso. Trova il ponte che prende il nome dai pugni di un tempo.",
        fr: "Je suis ancien, pourtant traversé par beaucoup, gardant un chemin caché. Mes pierres ont vu mille ans de chuchotements, mais pas de soupirs célèbres. Trouvez le pont nommé d'après les poings d'antan.",
        de: "Ich stehe uralt, doch von vielen überquert, einen verborgenen Pfad bewachend. Meine Steine haben tausend Jahre des Flüsterns gesehen, wenn auch keine berühmten Seufzer. Finde die Brücke, die nach den Fäusten der Alten benannt ist.",
        es: "Soy antiguo, pero cruzado por muchos, guardando un camino oculto. Mis piedras han visto mil años de susurros, aunque no suspiros famosos. Encuentra el puente que lleva el nombre de los puños de antaño."
      },
      hint: {
        en: "Look near the San Barnaba church, in Dorsoduro. It's famous for a traditional Venetian fight.",
        it: "Cerca vicino alla chiesa di San Barnaba, a Dorsoduro. È famoso per una tradizionale lotta veneziana.",
        fr: "Cherchez près de l'église de San Barnaba, à Dorsoduro. Il est célèbre pour une lutte vénitienne traditionnelle.",
        de: "Suchen Sie in der Nähe der Kirche San Barnaba in Dorsoduro. Sie ist berühmt für einen traditionellen venezianischen Kampf.",
        es: "Busca cerca de la iglesia de San Barnaba, en Dorsoduro. Es famoso por una lucha tradicional veneciana."
      },
      answer: "Ponte dei Pugni", // Simple text answer for simulation
      insight: {
        en: "The 'Bridge of Fists' was once the site of bare-knuckle brawls between rival Venetian factions. Imagine the shouts echoing through these narrow streets!",
        it: "Il 'Ponte dei Pugni' era un tempo il luogo di risse a mani nude tra fazioni veneziane rivali. Immagina le grida che echeggiano per queste strette vie!",
        fr: "Le 'Pont des Poings' était autrefois le théâtre de bagarres à mains nues entre factions vénitiennes rivales. Imaginez les cris résonnant dans ces rues étroites !",
        de: "Die 'Faustbrücke' war einst Schauplatz von Faustkämpfen zwischen rivalisierenden venezianischen Fraktionen. Stellen Sie sich vor, wie die Schreie durch diese engen Gassen hallten!",
        es: "El 'Puente de los Puños' fue una vez el lugar de peleas a puñetazos entre facciones venecianas rivales. ¡Imagina los gritos resonando por estas estrechas calles!"
      },
      points: 100,
      badge: "History Buff",
      recommendations: [
        { type: "poi", key: "caRezzonicoMuseum" },
        { type: "restaurant", key: "osteriadaNonoGiacomo" }
      ]
    },
    {
      id: "mission2_culinary",
      interests: ["culinaryDelights", "urbanExplorer", "findCicchetti"],
      riddle: {
        en: "Where gondoliers rest and locals share a bite, my door is often small, but my flavors are bright. Seek me near a market, where the fish are fresh and the wine flows free. What is my name?",
        it: "Dove i gondolieri riposano e la gente del posto condivide un boccone, la mia porta è spesso piccola, ma i miei sapori sono brillanti. Cercami vicino a un mercato, dove il pesce è fresco e il vino scorre liberamente. Qual è il mio nome?",
        fr: "Où les gondoliers se reposent et les habitants partagent une bouchée, ma porte est souvent petite, mais mes saveurs sont vives. Cherchez-moi près d'un marché, où le poisson est frais et le vin coule à flot. Quel est mon nom ?",
        de: "Wo Gondoliere sich ausruhen und Einheimische einen Bissen teilen, ist meine Tür oft klein, aber meine Aromen sind hell. Suchen Sie mich in der Nähe eines Marktes, wo der Fisch frisch ist und der Wein frei fließt. Wie ist mein Name?",
        es: "Donde los gondoleros descansan y los lugareños comparten un bocado, mi puerta suele ser pequeña, pero mis sabores son brillantes. Búscame cerca de un mercado, donde el pescado es fresco y el vino fluye libremente. ¿Cuál es mi nombre?"
      },
      hint: {
        en: "It's a famous *bacaro* (traditional Venetian bar) very close to the Rialto Fish Market.",
        it: "È un famoso *bacaro* (bar tradizionale veneziano) molto vicino al Mercato del Pesce di Rialto.",
        fr: "C'est un célèbre *bacaro* (bar vénitien traditionnel) très proche du marché aux poissons du Rialto.",
        de: "Es ist eine berühmte *Bacaro* (traditionelle venezianische Bar) ganz in der Nähe des Rialto-Fischmarktes.",
        es: "Es un famoso *bacaro* (bar tradicional veneciano) muy cerca del Mercado de Pescado de Rialto."
      },
      answer: "Cantina Do Spade", // Example famous bacaro
      insight: {
        en: "Venice's *bacari* are essential for experiencing local life. They offer *cicchetti* (small snacks) and wine, perfect for a quick, authentic bite.",
        it: "I *bacari* di Venezia sono essenziali per vivere la vita locale. Offrono *cicchetti* (piccoli spuntini) e vino, perfetti per un morso veloce e autentico.",
        fr: "Les *bacari* de Venise sont essentiels pour découvrir la vie locale. Ils proposent des *cicchetti* (petites collations) et du vin, parfaits pour une bouchée rapide et authentique.",
        de: "Venedigs *Bacari* sind unerlässlich, um das lokale Leben zu erleben. Sie bieten *Cicchetti* (kleine Snacks) und Wein, perfekt für einen schnellen, authentischen Happen.",
        es: "Los *bacari* de Venecia son esenciales para experimentar la vida local. Ofrecen *cicchetti* (pequeños bocadillos) y vino, perfectos para un bocado rápido y auténtico."
      },
      points: 120,
      badge: "Cicchetti Connoisseur",
      recommendations: [
        { type: "restaurant", key: "trattoriaAllaMadonna" },
        { type: "poi", key: "rialtoMarket" }
      ]
    },
    {
      id: "mission3_art",
      interests: ["artCulture", "photography"],
      riddle: {
        en: "Beyond the Grand Canal's grandest views, a modern art haven quietly brews. Find the customs house transformed, where masterpieces are born anew.",
        it: "Oltre le viste più grandiose del Canal Grande, un rifugio d'arte moderna si prepara in silenzio. Trova la dogana trasformata, dove i capolavori rinascono.",
        fr: "Au-delà des plus belles vues du Grand Canal, un havre d'art moderne se prépare en toute tranquillité. Trouvez la douane transformée, où les chefs-d'œuvre renaissent.",
        de: "Jenseits der grandiosesten Ausblicke des Canal Grande braut sich ein moderner Kunsthafen leise zusammen. Finde das umgewandelte Zollhaus, wo Meisterwerke neu geboren werden.",
        es: "Más allá de las vistas más grandiosas del Gran Canal, un paraíso de arte moderno se gesta en silencio. Encuentra la aduana transformada, donde las obras maestras renacen."
      },
      hint: {
        en: "It's at the tip of Dorsoduro, where the Grand Canal meets the Giudecca Canal.",
        it: "Si trova sulla punta di Dorsoduro, dove il Canal Grande incontra il Canale della Giudecca.",
        fr: "C'est à la pointe de Dorsoduro, où le Grand Canal rencontre le canal de la Giudecca.",
        de: "Es liegt an der Spitze von Dorsoduro, wo der Canal Grande auf den Giudecca-Kanal trifft.",
        es: "Está en la punta de Dorsoduro, donde el Gran Canal se encuentra con el Canal de la Giudecca."
      },
      answer: "Punta della Dogana",
      insight: {
        en: "Punta della Dogana, a former customs house, now hosts contemporary art exhibitions, offering a stark contrast to Venice's ancient beauty and incredible photo opportunities.",
        it: "Punta della Dogana, un'ex dogana, ospita ora mostre d'arte contemporanea, offrendo un netto contrasto con l'antica bellezza di Venezia e incredibili opportunità fotografiche.",
        fr: "Punta della Dogana, une ancienne douane, accueille désormais des expositions d'art contemporain, offrant un contraste saisissant avec la beauté ancienne de Venise et d'incroyables opportunités de photos.",
        de: "Punta della Dogana, ein ehemaliges Zollhaus, beherbergt heute Ausstellungen zeitgenössischer Kunst und bietet einen starken Kontrast zur alten Schönheit Venedigs und unglaubliche Fotomöglichkeiten.",
        es: "Punta della Dogana, una antigua aduana, ahora alberga exposiciones de arte contemporáneo, ofreciendo un marcado contraste con la antigua belleza de Venecia e increíbles oportunidades para fotos."
      },
      points: 150,
      badge: "Art Aficionado",
      recommendations: [
        { type: "poi", key: "guggenheimCollection" },
        { type: "poi", key: "accademiaGallery" }
      ]
    },
    {
      id: "mission4_nature",
      interests: ["natureLover", "relaxedWanderer"],
      riddle: {
        en: "Beyond the bustling squares, a green lung softly breathes. Where statues stand among the trees, and the lagoon breeze weaves. Find the public gardens, a peaceful urban escape.",
        it: "Oltre le piazze affollate, un polmone verde respira dolcemente. Dove le statue si ergono tra gli alberi e la brezza lagunare si intreccia. Trova i giardini pubblici, una tranquilla fuga urbana.",
        fr: "Au-delà des places animées, un poumon vert respire doucement. Où les statues se dressent parmi les arbres, et la brise de la lagune tisse. Trouvez les jardins publics, une paisible évasion urbaine.",
        de: "Jenseits der belebten Plätze atmet eine grüne Lunge sanft. Wo Statuen zwischen Bäumen stehen und die Lagunenbrise weht. Finden Sie die öffentlichen Gärten, eine friedliche urbane Flucht.",
        es: "Más allá de las bulliciosas plazas, un pulmón verde respira suavemente. Donde las estatuas se alzan entre los árboles, y la brisa de la laguna teje. Encuentra los jardines públicos, un escape urbano tranquilo."
      },
      hint: {
        en: "They are located at the eastern end of Castello, near the Biennale exhibition grounds.",
        it: "Si trovano all'estremità orientale di Castello, vicino ai Giardini della Biennale.",
        fr: "Ils sont situés à l'extrémité est de Castello, près des terrains d'exposition de la Biennale.",
        de: "Sie befinden sich am östlichen Ende von Castello, in der Nähe des Biennale-Ausstellungsgeländes.",
        es: "Se encuentran en el extremo oriental de Castello, cerca de los terrenos de exposición de la Bienal."
      },
      answer: "Giardini della Biennale",
      insight: {
        en: "These serene public gardens offer a refreshing break from the city's crowds. They also host pavilions for the Venice Biennale art and architecture exhibitions.",
        it: "Questi sereni giardini pubblici offrono una pausa rinfrescante dalla folla della città. Ospitano anche padiglioni per le mostre d'arte e architettura della Biennale di Venezia.",
        fr: "Ces jardins publics sereins offrent une pause rafraîchissante loin de la foule de la ville. Ils abritent également des pavillons pour les expositions d'art et d'architecture de la Biennale de Venise.",
        de: "Diese ruhigen öffentlichen Gärten bieten eine erfrischende Pause von den Menschenmassen der Stadt. Sie beherbergen auch Pavillons für die Kunst- und Architekturausstellungen der Biennale von Venedig.",
        es: "Estos serenos jardines públicos ofrecen un respiro refrescante de las multitudes de la ciudad. También albergan pabellones para las exposiciones de arte y arquitectura de la Bienal de Venecia."
      },
      points: 90,
      badge: "Green Thumb Explorer",
      recommendations: [
        { type: "poi", key: "santElenaIsland" },
        { type: "poi", key: "lidoBeach" }
      ]
    },
    {
      id: "mission5_shopping",
      interests: ["shopperExtraordinaire", "vintageMarkets"],
      riddle: {
        en: "I am a place where old stories are bought and sold, not in grand shops, but where tales unfold. Seek me where the past whispers, in goods unique and bold. What is my name?",
        it: "Sono un luogo dove le vecchie storie si comprano e si vendono, non in grandi negozi, ma dove le storie si svelano. Cercami dove il passato sussurra, in merci uniche e audaci. Qual è il mio nome?",
        fr: "Je suis un lieu où les vieilles histoires sont achetées et vendues, non pas dans de grands magasins, mais où les contes se déroulent. Cherchez-moi là où le passé murmure, dans des biens uniques et audacieux. Quel est mon nom ?",
        de: "Ich bin ein Ort, an dem alte Geschichten gekauft und verkauft werden, nicht in großen Geschäften, sondern wo sich Geschichten entfalten. Suchen Sie mich, wo die Vergangenheit flüstert, in einzigartigen und kühnen Waren. Wie ist mein Name?",
        es: "Soy un lugar donde las viejas historias se compran y se venden, no en grandes tiendas, sino donde se desarrollan los cuentos. Búscame donde el pasado susurra, en bienes únicos y audaces. ¿Cuál es mi nombre?"
      },
      hint: {
        en: "It's a small, charming antique and vintage market, often found near Campo San Maurizio.",
        it: "È un piccolo e affascinante mercato dell'antiquariato e del vintage, spesso si trova vicino a Campo San Maurizio.",
        fr: "C'est un petit marché d'antiquités et de vintage charmant, souvent trouvé près de Campo San Maurizio.",
        de: "Es ist ein kleiner, charmanter Antiquitäten- und Vintage-Markt, der oft in der Nähe des Campo San Maurizio zu finden ist.",
        es: "Es un pequeño y encantador mercado de antigüedades y vintage, a menudo se encuentra cerca de Campo San Maurizio."
      },
      answer: "Mercatino dell'Antiquariato", // Example vintage market
      insight: {
        en: "Venice offers more than just tourist souvenirs. Explore its hidden vintage markets and artisan shops for truly unique finds and sustainable shopping.",
        it: "Venezia offre più di semplici souvenir turistici. Esplora i suoi mercatini vintage nascosti e le botteghe artigiane per trovare pezzi davvero unici e fare acquisti sostenibili.",
        fr: "Venise offre plus que de simples souvenirs touristiques. Explorez ses marchés vintage cachés et ses boutiques d'artisans pour des trouvailles vraiment uniques et un shopping durable.",
        de: "Venedig bietet mehr als nur Touristensouvenirs. Erkunden Sie seine versteckten Vintage-Märkte und Kunsthandwerksläden für wirklich einzigartige Fundstücke und nachhaltiges Einkaufen.",
        es: "Venecia ofrece más que simples souvenirs turísticos. Explora sus mercados vintage escondidos y tiendas de artesanos para encontrar hallazgos verdaderamente únicos y compras sostenibles."
      },
      points: 110,
      badge: "Vintage Hunter",
      recommendations: [
        { type: "poi", key: "rialtoMarket" },
        { type: "shop", key: "marisaBoutique" } // Mock shop
      ]
    },

    // ... (existing missions) ...

    {
      id: "mission6_nightlife_cocktail",
      interests: ["nightlife", "lateNightDrinks", "romanticDinner", "social"],
      riddle: {
        en: "Where spirits are mixed, not just of old tales, but in glasses that clink, as the night prevails. I'm a modern twist on an ancient art, hidden near Rialto, a place for a fresh start.",
        it: "Dove gli spiriti si mescolano, non solo di vecchie storie, ma in bicchieri che tintinnano, mentre la notte prevale. Sono una svolta moderna su un'arte antica, nascosto vicino a Rialto, un luogo per un nuovo inizio.",
        fr: "Où les esprits se mêlent, non seulement des contes anciens, mais dans des verres qui tintent, tandis que la nuit règne. Je suis une touche moderne à un art ancien, caché près du Rialto, un lieu pour un nouveau départ.",
        de: "Wo Geister gemischt werden, nicht nur alte Geschichten, sondern in klirrenden Gläsern, während die Nacht herrscht. Ich bin eine moderne Interpretation einer alten Kunst, versteckt in der Nähe von Rialto, ein Ort für einen Neuanfang.",
        es: "Donde los espíritus se mezclan, no solo de viejas historias, sino en copas que tintinean, mientras la noche prevalece. Soy un toque moderno a un arte antiguo, escondido cerca de Rialto, un lugar para un nuevo comienzo."
      },
      hint: {
        en: "Look for a highly-rated cocktail bar close to the Rialto Bridge, known for its creative drinks.",
        it: "Cerca un cocktail bar molto apprezzato vicino al Ponte di Rialto, noto per i suoi drink creativi.",
        fr: "Cherchez un bar à cocktails très bien noté près du pont du Rialto, réputé pour ses boissons créatives.",
        de: "Suchen Sie eine hoch bewertete Cocktailbar in der Nähe der Rialtobrücke, bekannt für ihre kreativen Drinks.",
        es: "Busca un bar de cócteles muy valorado cerca del Puente de Rialto, conocido por sus bebidas creativas."
      },
      answer: "Il Mercante", // Example
      insight: {
        en: "Venice's nightlife can be surprisingly vibrant, with hidden bars offering exquisite cocktails and a lively atmosphere away from the main tourist hubs.",
        it: "La vita notturna di Venezia può essere sorprendentemente vivace, con bar nascosti che offrono cocktail squisiti e un'atmosfera allegra lontano dai principali centri turistici.",
        fr: "La vie nocturne de Venise peut être étonnamment vibrante, avec des bars cachés offrant des cocktails exquis et une atmosphère animée loin des principaux centres touristiques.",
        de: "Venedigs Nachtleben kann überraschend lebhaft sein, mit versteckten Bars, die exquisite Cocktails und eine lebhafte Atmosphäre abseits der touristischen Hauptzentren bieten.",
        es: "La vida nocturna de Venecia puede ser sorprendentemente vibrante, con bares escondidos que ofrecen cócteles exquisitos y un ambiente animado lejos de los principales centros turísticos."
      },
      points: 130,
      badge: "Night Owl Explorer",
      recommendations: [
        { type: "bar", key: "ombraRossa" }, // Another lively bar
        { type: "area", key: "campoSantaMargherita" } // Popular evening spot
      ]
    },
    {
      id: "mission7_street_photography",
      interests: [
        "photography",
        "streetPhotography",
        "photoWalks",
        "uniqueSouvenirs"
      ],
      riddle: {
        en: "My books spill outside, defying the flood, a quirky display where cats often brood. I'm a literary marvel, unique in my kind, a perfect snapshot of Venice to find.",
        it: "I miei libri straripano fuori, sfidando l'alluvione, un'esposizione eccentrica dove i gatti spesso meditano. Sono una meraviglia letteraria, unica nel suo genere, uno scatto perfetto di Venezia da trovare.",
        fr: "Mes livres débordent à l'extérieur, défiant la crue, une exposition originale où les chats couvent souvent. Je suis une merveille littéraire, unique en son genre, une parfaite photographie de Venise à trouver.",
        de: "Meine Bücher quellen nach draußen, trotzen der Flut, eine skurrile Ausstellung, wo Katzen oft brüten. Ich bin ein literarisches Wunder, einzigartig in meiner Art, ein perfekter Schnappschuss von Venedig zum Finden.",
        es: "Mis libros se desbordan, desafiando la inundación, una exposición peculiar donde los gatos a menudo reflexionan. Soy una maravilla literaria, única en su clase, una instantánea perfecta de Venecia para encontrar."
      },
      hint: {
        en: "It's a famous, picturesque bookstore known for its unique way of storing books, especially old ones in bathtubs and gondolas.",
        it: "È una famosa e pittoresca libreria nota per il suo modo unico di conservare i libri, soprattutto quelli vecchi in vasche da bagno e gondole.",
        fr: "C'est une célèbre librairie pittoresque connue pour sa façon unique de stocker les livres, en particulier les anciens dans des baignoires et des gondoles.",
        de: "Es ist eine berühmte, malerische Buchhandlung, bekannt für ihre einzigartige Art, Bücher aufzubewahren, besonders alte in Badewannen und Gondeln.",
        es: "Es una famosa y pintoresca librería conocida por su forma única de almacenar libros, especialmente los antiguos en bañeras y góndolas."
      },
      answer: "Libreria Acqua Alta", // Example
      insight: {
        en: "Libreria Acqua Alta is a photographer's dream, a quirky independent bookstore that embraces Venice's watery nature with creative storage solutions. It’s perfect for capturing the city's unique charm.",
        it: "La Libreria Acqua Alta è il sogno di un fotografo, una bizzarra libreria indipendente che abbraccia la natura acquatica di Venezia con soluzioni di archiviazione creative. È perfetta per catturare il fascino unico della città.",
        fr: "La Libreria Acqua Alta est le rêve d'un photographe, une librairie indépendante excentrique qui embrasse la nature aquatique de Venise avec des solutions de stockage créatives. Elle est parfaite pour capturer le charme unique de la ville.",
        de: "Die Libreria Acqua Alta ist der Traum eines jeden Fotografen, eine skurrile unabhängige Buchhandlung, die Venedigs wasserreiche Natur mit kreativen Aufbewahrungslösungen aufgreift. Sie ist perfekt, um den einzigartigen Charme der Stadt einzufangen.",
        es: "La Libreria Acqua Alta es el sueño de un fotógrafo, una peculiar librería independiente que abraza la naturaleza acuática de Venecia con soluciones de almacenamiento creativas. Es perfecta para capturar el encanto único de la ciudad."
      },
      points: 140,
      badge: "Photo Maestro",
      recommendations: [
        { type: "poi", key: "ponteChiodo" }, // Another unique photo spot
        { type: "activity", key: "gondolaRide" } // Classic Venice photo
      ]
    },
    {
      id: "mission8_urban_exploring",
      interests: [
        "urbanExploring",
        "selfExploration",
        "peacefulQuiet",
        "localAnecdotes"
      ],
      riddle: {
        en: "A bridge without railings, a path so tight, I lead to a courtyard, avoiding the light. Only two like me remain, a hidden way through, find me in Cannaregio, for explorers true.",
        it: "Un ponte senza parapetti, un sentiero così stretto, conduco a un cortile, evitando la luce. Solo due come me rimangono, una via nascosta, trovami a Cannaregio, per veri esploratori.",
        fr: "Un pont sans rambarde, un chemin si étroit, je mène à une cour, évitant la lumière. Seuls deux comme moi subsistent, un passage caché, trouvez-moi à Cannaregio, pour les vrais explorateurs.",
        de: "Eine Brücke ohne Geländer, ein so enger Pfad, ich führe zu einem Hof, das Licht meidend. Nur zwei wie ich bleiben, ein versteckter Weg, finde mich in Cannaregio, für wahre Entdecker.",
        es: "Un puente sin barandales, un camino tan estrecho, conduzco a un patio, evitando la luz. Solo dos como yo quedan, un camino oculto, encuéntrame en Cannaregio, para verdaderos exploradores."
      },
      hint: {
        en: "It's one of Venice's few remaining bridges without side railings, offering a glimpse into the city's past construction. It's often quiet.",
        it: "È uno dei pochi ponti rimasti a Venezia senza parapetti laterali, offrendo uno sguardo sulla costruzione passata della città. È spesso tranquillo.",
        fr: "C'est l'un des rares ponts de Venise sans garde-corps latéraux, offrant un aperçu de l'ancienne construction de la ville. Il est souvent calme.",
        de: "Es ist eine der wenigen verbliebenen Brücken Venedigs ohne Seiten Geländer und bietet einen Einblick in die frühere Bauweise der Stadt. Es ist oft ruhig.",
        es: "Es uno de los pocos puentes restantes de Venecia sin barandillas laterales, que ofrece un vistazo a la construcción pasada de la ciudad. A menudo es tranquilo."
      },
      answer: "Ponte Chiodo",
      insight: {
        en: "Ponte Chiodo, a 'nail bridge,' represents Venice's medieval urban fabric before safety standards introduced railings. Exploring these hidden corners reveals the city's authentic, untamed history.",
        it: "Il Ponte Chiodo, un 'ponte a chiodo', rappresenta il tessuto urbano medievale di Venezia prima che gli standard di sicurezza introducessero i parapetti. Esplorare questi angoli nascosti rivela la storia autentica e selvaggia della città.",
        fr: "Le Ponte Chiodo, un 'pont à clou', représente le tissu urbain médiéval de Venise avant que les normes de sécurité n'introduisent les garde-corps. Explorer ces coins cachés révèle l'histoire authentique et indomptée de la ville.",
        de: "Die Ponte Chiodo, eine 'Nagelbrücke', repräsentiert Venedigs mittelalterliches Stadtgefüge, bevor Sicherheitsstandards Geländer einführten. Die Erkundung dieser versteckten Ecken enthüllt die authentische, ungezähmte Geschichte der Stadt.",
        es: "El Ponte Chiodo, un 'puente de clavos', representa el tejido urbano medieval de Venecia antes de que los estándares de seguridad introdujeran las barandillas. Explorar estos rincones ocultos revela la historia auténtica e indómita de la ciudad."
      },
      points: 120,
      badge: "Urban Pathfinder",
      recommendations: [
        { type: "area", key: "sestiereCannaregio" }, // Good for more exploring
        { type: "activity", key: "gondolaSquero" } // Unique Venetian craft
      ]
    },
    {
      id: "mission9_craft_beer",
      interests: ["craftBeer", "beverageChoice", "liveMusicBar", "localTips"],
      riddle: {
        en: "Amidst wine and Spritz, a different foam flows, from taps of unique brews, where a new spirit grows. Find the 'brewery's court', a haven for hoppy delights, away from the typical Venetian lights.",
        it: "Tra vino e Spritz, una schiuma diversa scorre, dai rubinetti di birre uniche, dove un nuovo spirito cresce. Trova la 'corte della birreria', un rifugio per delizie luppolate, lontano dalle tipiche luci veneziane.",
        fr: "Au milieu du vin et du Spritz, une mousse différente coule, des robinets de brassins uniques, où un nouvel esprit grandit. Trouvez la 'cour de la brasserie', un havre de délices houblonnés, loin des lumières vénitiennes typiques.",
        de: "Inmitten von Wein und Spritz fließt ein anderer Schaum, aus Zapfhähnen einzigartiger Biere, wo ein neuer Geist wächst. Finden Sie den 'Brauereihof', einen Zufluchtsort für hopfige Köstlichkeiten, abseits der typischen venezianischen Lichter.",
        es: "Entre el vino y el Spritz, una espuma diferente fluye, de grifos de cervezas únicas, donde un nuevo espíritu crece. Encuentra la 'corte de la cervecería', un refugio para delicias lupuladas, lejos de las luces típicas venecianas."
      },
      hint: {
        en: "It's a popular spot in Castello, known for its wide selection of Italian and international craft beers, often with food pairings.",
        it: "È un luogo popolare a Castello, noto per la sua vasta selezione di birre artigianali italiane e internazionali, spesso con abbinamenti gastronomici.",
        fr: "C'est un endroit populaire à Castello, connu pour sa large sélection de bières artisanales italiennes et internationales, souvent avec des accords mets.",
        de: "Es ist ein beliebter Ort in Castello, bekannt für seine große Auswahl an italienischen und internationalen Craft-Bieren, oft mit passenden Speisen.",
        es: "Es un lugar popular en Castello, conocido por su amplia selección de cervezas artesanales italianas e internacionales, a menudo con maridajes de comida."
      },
      answer: "Birraria La Corte",
      insight: {
        en: "While Venice is famed for wine and Spritz, a burgeoning craft beer scene offers diverse local and international brews. This spot lets you experience a different side of Venetian beverages.",
        it: "Mentre Venezia è famosa per il vino e lo Spritz, una fiorente scena di birre artigianali offre diverse birre locali e internazionali. Questo posto ti permette di sperimentare un lato diverso delle bevande veneziane.",
        fr: "Bien que Venise soit réputée pour le vin et le Spritz, une scène de bière artisanale en plein essor offre diverses bières locales et internationales. Cet endroit vous permet de découvrir une autre facette des boissons vénitiennes.",
        de: "Während Venedig für Wein und Spritz bekannt ist, bietet eine aufstrebende Craft-Beer-Szene vielfältige lokale und internationale Biere. Dieser Ort lässt Sie eine andere Seite der venezianischen Getränke erleben.",
        es: "Si bien Venecia es famosa por el vino y el Spritz, una floreciente escena de cerveza artesanal ofrece diversas cervezas locales e internacionales. Este lugar te permite experimentar un lado diferente de las bebidas venecianas."
      },
      points: 115,
      badge: "Craft Brew Connoisseur",
      recommendations: [
        { type: "bar", key: "birreriaZanon" }, // Another craft beer spot (mock)
        { type: "area", key: "cannaregioJewishGhetto" } // Historic, less crowded area
      ]
    },
    {
      id: "mission10_local_legends",
      interests: [
        "localAnecdotes",
        "storyDriven",
        "historyArchitecture",
        "culturalImmersion"
      ],
      riddle: {
        en: "I'm a statue on a bridge, with a dark tale to tell, of a baker's false justice, and a ghostly bell. Find me where the whispers of a legend reside, near a palace where secrets often hide.",
        it: "Sono una statua su un ponte, con una storia oscura da raccontare, di una falsa giustizia di un fornaio e di una campana spettrale. Trovami dove risuonano i sussurri di una leggenda, vicino a un palazzo dove i segreti spesso si nascondono.",
        fr: "Je suis une statue sur un pont, avec une sombre histoire à raconter, d'une fausse justice d'un boulanger et d'une cloche fantomatique. Trouvez-moi où les murmures d'une légende résident, près d'un palais où les secrets se cachent souvent.",
        de: "Ich bin eine Statue auf einer Brücke, mit einer dunklen Geschichte zu erzählen, von der falschen Gerechtigkeit eines Bäckers und einer gespenstischen Glocke. Finde mich, wo die Flüster der Legende wohnen, nahe eines Palastes, wo sich oft Geheimnisse verbergen.",
        es: "Soy una estatua en un puente, con una oscura historia que contar, de la falsa justicia de un panadero y una campana fantasmal. Búscame donde residen los susurros de una leyenda, cerca de un palacio donde a menudo se esconden secretos."
      },
      hint: {
        en: "You'll find me near the Rialto Bridge, in front of a famous market. Legend says I'm connected to a ghost story involving an unjustly executed baker.",
        it: "Mi troverai vicino al Ponte di Rialto, di fronte a un famoso mercato. La leggenda dice che sono legato a una storia di fantasmi che coinvolge un fornaio ingiustamente giustiziato.",
        fr: "Vous me trouverez près du pont du Rialto, devant un marché célèbre. La légende dit que je suis lié à une histoire de fantômes impliquant un boulanger injustement exécuté.",
        de: "Sie finden mich in der Nähe der Rialtobrücke, vor einem berühmten Markt. Die Legende besagt, dass ich mit einer Geistergeschichte verbunden bin, die einen ungerecht hingerichteten Bäcker betrifft.",
        es: "Me encontrarás cerca del Puente de Rialto, frente a un famoso mercado. La leyenda dice que estoy relacionado con una historia de fantasmas que involucra a un panadero ejecutado injustamente."
      },
      answer: "Gobbo di Rialto", // The Hunchback of Rialto
      insight: {
        en: "The Gobbo di Rialto is a fascinating example of Venetian folklore. This 'hunchback' statue was once a speaker's platform for public decrees and punishments, giving rise to chilling local legends.",
        it: "Il Gobbo di Rialto è un affascinante esempio del folklore veneziano. Questa statua del 'gobbo' era un tempo la piattaforma per i proclami pubblici e le punizioni, dando origine a leggende locali agghiaccianti.",
        fr: "Le Gobbo di Rialto est un exemple fascinant du folklore vénitien. Cette statue de 'bossu' était autrefois une tribune pour les décrets publics et les punitions, donnant naissance à des légendes locales glaçantes.",
        de: "Der Gobbo di Rialto ist ein faszinierendes Beispiel venezianischer Folklore. Diese 'Buckelige'-Statue war einst eine Sprecherplattform für öffentliche Dekrete und Strafen, was zu gruseligen lokalen Legenden führte.",
        es: "El Gobbo di Rialto es un fascinante ejemplo del folclore veneciano. Esta estatua del 'jorobado' fue una vez una plataforma para decretos y castigos públicos, dando lugar a escalofriantes leyendas locales."
      },
      points: 105,
      badge: "Folklore Fanatic",
      recommendations: [
        { type: "activity", key: "ghostWalkingTour" }, // Mock ghost tour
        { type: "poi", key: "dogePalace" } // Rich in history and secrets
      ]
    },
    {
      id: "mission11_colorful_photography",
      interests: [
        "photography",
        "streetPhotography",
        "colorfulArchitecture",
        "selfExploration"
      ],
      riddle: {
        en: "Where colourful houses lean, and laundry hangs high, a fisherman's island, beneath a bright sky. I'm not just a backdrop, but life in full view, find the isle of colors, for photographers true.",
        it: "Dove le case colorate si inclinano e il bucato è appeso in alto, un'isola di pescatori, sotto un cielo luminoso. Non sono solo uno sfondo, ma la vita in piena vista, trova l'isola dei colori, per i veri fotografi.",
        fr: "Où les maisons colorées penchent et le linge pend haut, une île de pêcheurs, sous un ciel lumineux. Je ne suis pas seulement un décor, mais la vie en pleine vue, trouvez l'île des couleurs, pour les vrais photographes.",
        de: "Wo farbenfrohe Häuser schief stehen und Wäsche hoch hängt, eine Fischerinsel, unter einem strahlenden Himmel. Ich bin nicht nur eine Kulisse, sondern das Leben in voller Pracht, finde die Insel der Farben, für wahre Fotografen.",
        es: "Donde las casas coloridas se inclinan, y la ropa cuelga alta, una isla de pescadores, bajo un cielo brillante. No soy solo un telón de fondo, sino la vida a la vista, encuentra la isla de los colores, para fotógrafos de verdad."
      },
      hint: {
        en: "You'll need a Vaporetto to reach this vibrant island, famous for its brightly painted houses and lacemaking tradition.",
        it: "Avrai bisogno di un Vaporetto per raggiungere quest'isola vibrante, famosa per le sue case dai colori vivaci e la tradizione del merletto.",
        fr: "Vous aurez besoin d'un Vaporetto pour atteindre cette île vibrante, célèbre pour ses maisons aux couleurs vives et sa tradition de la dentelle.",
        de: "Sie benötigen ein Vaporetto, um diese lebendige Insel zu erreichen, die für ihre leuchtend bemalten Häuser und ihre Spitzenmachertradition bekannt ist.",
        es: "Necesitarás un Vaporetto para llegar a esta vibrante isla, famosa por sus casas pintadas de colores brillantes y su tradición de encaje."
      },
      answer: "Burano",
      insight: {
        en: "Burano is a postcard-perfect island, a kaleidoscope of colours where every corner offers a unique photographic opportunity. Its vibrant hues were originally used to help fishermen find their homes in the fog.",
        it: "Burano è un'isola da cartolina, un caleidoscopio di colori dove ogni angolo offre un'opportunità fotografica unica. Le sue tonalità vivaci erano originariamente utilizzate per aiutare i pescatori a trovare le loro case nella nebbia.",
        fr: "Burano est une île parfaite comme une carte postale, un kaléidoscope de couleurs où chaque coin offre une opportunité photographique unique. Ses teintes vibrantes étaient à l'origine utilisées pour aider les pêcheurs à retrouver leurs maisons dans le brouillard.",
        de: "Burano ist eine postkartenreife Insel, ein Kaleidoskop der Farben, wo jede Ecke eine einzigartige fotografische Gelegenheit bietet. Ihre lebhaften Farbtöne wurden ursprünglich verwendet, um Fischern zu helfen, ihre Häuser im Nebel zu finden.",
        es: "Burano es una isla perfecta de postal, un caleidoscopio de colores donde cada esquina ofrece una oportunidad fotográfica única. Sus vibrantes tonos se usaban originalmente para ayudar a los pescadores a encontrar sus casas en la niebla."
      },
      points: 160,
      badge: "Color Hunter",
      recommendations: [
        { type: "poi", key: "muranoGlassMuseum" }, // Another island with specific craft
        { type: "activity", key: "vaporettoScenicRoute" } // Enjoy the lagoon views
      ]
    }
    // ... (rest of your game.js) ...

    // Add more missions covering other interests (nightlife, street photography, urban exploring, craft beer etc.)
  ];

  // Mock Points of Interest (for recommendations)
  const allPois = {
    caRezzonicoMuseum: {
      name: {
        en: "Ca' Rezzonico (Museum of 18th-Century Venice)",
        it: "Ca' Rezzonico (Museo del Settecento Veneziano)",
        fr: "Ca' Rezzonico (Musée du XVIIIe siècle vénitien)",
        de: "Ca' Rezzonico (Museum des 18. Jahrhunderts Venedig)",
        es: "Ca' Rezzonico (Museo del siglo XVIII veneciano)"
      },
      interests: ["historyArchitecture", "artCulture"],
      type: "museum"
    },
    osteriadaNonoGiacomo: {
      name: {
        en: "Osteria da Nono Giacomo",
        it: "Osteria da Nono Giacomo",
        fr: "Osteria da Nono Giacomo",
        de: "Osteria da Nono Giacomo",
        es: "Osteria da Nono Giacomo"
      },
      interests: ["culinaryDelights"],
      type: "restaurant"
    },
    trattoriaAllaMadonna: {
      name: {
        en: "Trattoria Alla Madonna",
        it: "Trattoria Alla Madonna",
        fr: "Trattoria Alla Madonna",
        de: "Trattoria Alla Madonna",
        es: "Trattoria Alla Madonna"
      },
      interests: ["culinaryDelights"],
      type: "restaurant"
    },
    rialtoMarket: {
      name: {
        en: "Rialto Market",
        it: "Mercato di Rialto",
        fr: "Marché du Rialto",
        de: "Rialto-Markt",
        es: "Mercado de Rialto"
      },
      interests: ["culinaryDelights", "shoppingMarkets", "photography"],
      type: "market"
    },
    guggenheimCollection: {
      name: {
        en: "Peggy Guggenheim Collection",
        it: "Collezione Peggy Guggenheim",
        fr: "Collection Peggy Guggenheim",
        de: "Peggy Guggenheim Sammlung",
        es: "Colección Peggy Guggenheim"
      },
      interests: ["artCulture"],
      type: "museum"
    },
    accademiaGallery: {
      name: {
        en: "Gallerie dell'Accademia",
        it: "Gallerie dell'Accademia",
        fr: "Galeries de l'Académie",
        de: "Gallerie dell'Accademia",
        es: "Galerías de la Academia"
      },
      interests: ["artCulture", "historyArchitecture"],
      type: "museum"
    },
    santElenaIsland: {
      name: {
        en: "Sant'Elena Island",
        it: "Isola di Sant'Elena",
        fr: "Île de Sant'Elena",
        de: "Insel Sant'Elena",
        es: "Isla de Sant'Elena"
      },
      interests: ["natureLover", "relaxedWanderer"],
      type: "island"
    },
    lidoBeach: {
      name: {
        en: "Lido Beach",
        it: "Spiaggia del Lido",
        fr: "Plage du Lido",
        de: "Lido Strand",
        es: "Playa del Lido"
      },
      interests: ["natureLover", "relaxedWanderer"],
      type: "beach"
    },
    marisaBoutique: {
      name: {
        en: "Marisa Boutique (Mock Shop)",
        it: "Marisa Boutique (Negozio Mock)",
        fr: "Marisa Boutique (Boutique fictive)",
        de: "Marisa Boutique (Mock Shop)",
        es: "Marisa Boutique (Tienda de prueba)"
      },
      interests: ["shopperExtraordinaire"],
      type: "shop"
    },
    // Add more POIs
    // ... (existing allPois) ...
    ilMercanteCocktailBar: {
      name: {
        en: "Il Mercante Cocktail Bar",
        it: "Il Mercante Cocktail Bar",
        fr: "Il Mercante Bar à Cocktails",
        de: "Il Mercante Cocktailbar",
        es: "Il Mercante Bar de Cócteles"
      },
      interests: ["nightlife", "lateNightDrinks", "romanticDinner"],
      type: "bar"
    },
    ombraRossa: {
      name: {
        en: "Ombra Rossa (Bar)",
        it: "Ombra Rossa (Bar)",
        fr: "Ombra Rossa (Bar)",
        de: "Ombra Rossa (Bar)",
        es: "Ombra Rossa (Bar)"
      },
      interests: ["nightlife", "liveMusicBar", "social"],
      type: "bar"
    },
    campoSantaMargherita: {
      name: {
        en: "Campo Santa Margherita",
        it: "Campo Santa Margherita",
        fr: "Campo Santa Margherita",
        de: "Campo Santa Margherita",
        es: "Campo Santa Margherita"
      },
      interests: ["nightlife", "social", "culinaryDelights", "streetFood"],
      type: "area"
    },
    ponteChiodo: {
      name: {
        en: "Ponte Chiodo (Cannaregio)",
        it: "Ponte Chiodo (Cannaregio)",
        fr: "Pont Chiodo (Cannaregio)",
        de: "Ponte Chiodo (Cannaregio)",
        es: "Ponte Chiodo (Cannaregio)"
      },
      interests: ["urbanExploring", "photography"],
      type: "bridge"
    },
    sestiereCannaregio: {
      name: {
        en: "Cannaregio District",
        it: "Sestiere Cannaregio",
        fr: "Sestier Cannaregio",
        de: "Stadtteil Cannaregio",
        es: "Distrito de Cannaregio"
      },
      interests: ["urbanExploring", "culinaryDelights", "peacefulQuiet"],
      type: "area"
    },
    gondolaSquero: {
      name: {
        en: "Squero di San Trovaso (Gondola Workshop)",
        it: "Squero di San Trovaso (Cantiere delle Gondole)",
        fr: "Squero di San Trovaso (Atelier de Gondoles)",
        de: "Squero di San Trovaso (Gondelwerft)",
        es: "Squero di San Trovaso (Taller de Góndolas)"
      },
      interests: ["localArtisans", "culturalImmersion", "behindTheScenes"],
      type: "activity"
    },
    birrariaLaCorte: {
      name: {
        en: "Birraria La Corte",
        it: "Birraria La Corte",
        fr: "Birraria La Corte",
        de: "Birraria La Corte",
        es: "Birraria La Corte"
      },
      interests: ["craftBeer", "beverageChoice", "foodDelicacies"],
      type: "bar"
    },
    birreriaZanon: {
      // Mock Beer Spot
      name: {
        en: "Birreria Zanon (Mock)",
        it: "Birreria Zanon (Mock)",
        fr: "Birreria Zanon (Fictif)",
        de: "Birreria Zanon (Mock)",
        es: "Birreria Zanon (Mock)"
      },
      interests: ["craftBeer", "beverageChoice"],
      type: "bar"
    },
    cannaregioJewishGhetto: {
      name: {
        en: "Jewish Ghetto (Cannaregio)",
        it: "Ghetto Ebraico (Cannaregio)",
        fr: "Ghetto Juif (Cannaregio)",
        de: "Jüdisches Ghetto (Cannaregio)",
        es: "Gueto Judío (Cannaregio)"
      },
      interests: ["historyArchitecture", "culturalImmersion", "peacefulQuiet"],
      type: "area"
    },
    ghostWalkingTour: {
      name: {
        en: "Venetian Ghost Walking Tour",
        it: "Tour a Piedi dei Fantasmi Veneziani",
        fr: "Visite Guidée des Fantômes Vénitiens",
        de: "Venezianische Geisterwanderung",
        es: "Tour a Pie de Fantasmas Venecianos"
      },
      interests: [
        "localAnecdotes",
        "storyDriven",
        "seekAdventure",
        "nightlife"
      ],
      type: "activity"
    },
    dogePalace: {
      name: {
        en: "Doge's Palace",
        it: "Palazzo Ducale",
        fr: "Palais des Doges",
        de: "Dogenpalast",
        es: "Palacio Ducal"
      },
      interests: ["historyArchitecture", "artCulture", "storyDriven"],
      type: "museum"
    },
    muranoGlassMuseum: {
      name: {
        en: "Murano Glass Museum",
        it: "Museo del Vetro di Murano",
        fr: "Musée du Verre de Murano",
        de: "Murano Glasmuseum",
        es: "Museo del Vidrio de Murano"
      },
      interests: ["glassArt", "culturalImmersion", "artisanCrafts"],
      type: "museum"
    },
    vaporettoScenicRoute: {
      name: {
        en: "Vaporetto Scenic Route (Grand Canal)",
        it: "Percorso Panoramico in Vaporetto (Canal Grande)",
        fr: "Route Panoramique en Vaporetto (Grand Canal)",
        de: "Vaporetto Panoramische Route (Canal Grande)",
        es: "Ruta Panorámica en Vaporetto (Gran Canal)"
      },
      interests: ["relaxUnwind", "photography", "observational"],
      type: "activity"
    }

    // ... (rest of your allPois object) ...
  };

  // --- Multilingual Translations ---
  const translations = {
    en: {
      gameTitle: "The Venetian Riddle Weaver",
      gameHeader: "The Venetian Riddle Weaver",
      selectLanguage: "Select Language:",
      startScreenTitle: "Your Venice Adventure🧭 Awaits!",
      startScreenIntro:
        "Solve riddles🧩, discover🔎 hidden gems💎, and unlock🔓 local insights!",
      startGameButton: "Start Your Venetian Journey",
      missionTitle: "Mission",
      showHintButton: "Show Hint",
      checkInLabel: "Your Answer / Check-in:",
      checkInButton: "Check-in",
      insightTitle: "Local Lens Insight:",
      nextMissionButton: "Next Mission",
      endGameButton: "End Game",
      summaryTitle: "Your Venetian Explorer Report",
      missionsCompleted: "Missions Completed:",
      totalPoints: "Total Points:",
      badgesEarned: "Badges Earned:",
      finalRecommendations: "Final Recommendations:",
      restartGameButton: "Play Again?",
      incorrectAnswer: "Incorrect answer. Try again!",
      missionCompleteMessage: "Mission Complete!",
      noMoreMissions: "You've completed all available missions!",
      noRecommendations: "No further recommendations at this time.",
      badgeEarned: "Badge Earned: "
    },
    it: {
      gameTitle: "Il Trama Enigmi Veneziano",
      gameHeader: "Il Trama Enigmi Veneziano",
      selectLanguage: "Seleziona Lingua:",
      startScreenTitle: "La Tua Avventura Veneziana Personalizzata Ti Aspetta!",
      startScreenIntro:
        "In base ai tuoi interessi, abbiamo intessuto un percorso unico a Venezia solo per te. Risolvi enigmi, scopri gemme nascoste e sblocca intuizioni locali!",
      startGameButton: "Inizia il Tuo Viaggio Veneziano",
      missionTitle: "Missione",
      showHintButton: "Mostra Suggerimento",
      checkInLabel: "La Tua Risposta / Check-in:",
      checkInButton: "Check-in",
      insightTitle: "Approfondimento Locale:",
      nextMissionButton: "Prossima Missione",
      endGameButton: "Termina Gioco",
      summaryTitle: "Il Tuo Resoconto dell'Esploratore Veneziano",
      missionsCompleted: "Missioni Completate:",
      totalPoints: "Punti Totali:",
      badgesEarned: "Badge Guadagnati:",
      finalRecommendations: "Raccomandazioni Finali:",
      restartGameButton: "Gioca Ancora?",
      incorrectAnswer: "Risposta errata. Riprova!",
      missionCompleteMessage: "Missione Completata!",
      noMoreMissions: "Hai completato tutte le missioni disponibili!",
      noRecommendations: "Nessuna ulteriore raccomandazione al momento.",
      badgeEarned: "Badge Guadagnato: "
    },
    fr: {
      gameTitle: "Le Tisseur d'Énigmes Vénitien",
      gameHeader: "Le Tisseur d'Énigmes Vénitien",
      selectLanguage: "Sélectionner la Langue :",
      startScreenTitle: "Votre Aventure Vénitienne Personnalisée Vous Attend !",
      startScreenIntro:
        "En fonction de vos centres d'intérêt, nous avons tissé un chemin unique à travers Venise rien que pour vous. Résolvez des énigmes, découvrez des joyaux cachés et débloquez des aperçus locaux !",
      startGameButton: "Commencez Votre Voyage Vénitien",
      missionTitle: "Mission",
      showHintButton: "Afficher l'indice",
      checkInLabel: "Votre Réponse / Enregistrement :",
      checkInButton: "Enregistrement",
      insightTitle: "Aperçu Local :",
      nextMissionButton: "Mission Suivante",
      endGameButton: "Terminer le Jeu",
      summaryTitle: "Votre Rapport d'Explorateur Vénitien",
      missionsCompleted: "Missions Terminées :",
      totalPoints: "Points Totaux :",
      badgesEarned: "Badges Gagnés :",
      finalRecommendations: "Recommandations Finales :",
      restartGameButton: "Rejouer ?",
      incorrectAnswer: "Mauvaise réponse. Réessayez !",
      missionCompleteMessage: "Mission Terminée !",
      noMoreMissions: "Vous avez terminé toutes les missions disponibles !",
      noRecommendations: "Aucune autre recommandation pour le moment.",
      badgeEarned: "Badge Gagné : "
    },
    de: {
      gameTitle: "Der Venezianische Rätselweber",
      gameHeader: "Der Venezianische Rätselweber",
      selectLanguage: "Sprache auswählen:",
      startScreenTitle: "Ihr personalisiertes Venedig-Abenteuer erwartet Sie!",
      startScreenIntro:
        "Basierend auf Ihren Interessen haben wir einen einzigartigen Weg durch Venedig nur für Sie gewebt. Lösen Sie Rätsel, entdecken Sie versteckte Juwelen und schalten Sie lokale Einblicke frei!",
      startGameButton: "Starten Sie Ihre Venedig-Reise",
      missionTitle: "Mission",
      showHintButton: "Tipp anzeigen",
      checkInLabel: "Ihre Antwort / Check-in:",
      checkInButton: "Check-in",
      insightTitle: "Lokaler Einblick:",
      nextMissionButton: "Nächste Mission",
      endGameButton: "Spiel beenden",
      summaryTitle: "Ihr Venedig-Entdeckerbericht",
      missionsCompleted: "Abgeschlossene Missionen:",
      totalPoints: "Gesamtpunkte:",
      badgesEarned: "Verdiente Abzeichen:",
      finalRecommendations: "Finale Empfehlungen:",
      restartGameButton: "Nochmal spielen?",
      incorrectAnswer: "Falsche Antwort. Versuchen Sie es erneut!",
      missionCompleteMessage: "Mission abgeschlossen!",
      noMoreMissions: "Sie haben alle verfügbaren Missionen abgeschlossen!",
      noRecommendations: "Derzeit keine weiteren Empfehlungen.",
      badgeEarned: "Abzeichen verdient: "
    },
    es: {
      gameTitle: "El Tejedor de Enigmas Veneciano",
      gameHeader: "El Tejedor de Enigmas Veneciano",
      selectLanguage: "Seleccionar Idioma:",
      startScreenTitle: "¡Tu Aventura Personalizada en Venecia te Espera!",
      startScreenIntro:
        "Basándonos en tus intereses, hemos tejido un camino único a través de Venecia solo para ti. ¡Resuelve enigmas, descubre joyas ocultas y desbloquea conocimientos locales!",
      startGameButton: "Comienza Tu Viaje Veneciano",
      missionTitle: "Misión",
      showHintButton: "Mostrar Pista",
      checkInLabel: "Tu Respuesta / Check-in:",
      checkInButton: "Check-in",
      insightTitle: "Perspectiva Local:",
      nextMissionButton: "Siguiente Misión",
      endGameButton: "Terminar Juego",
      summaryTitle: "Tu Informe de Explorador Veneciano",
      missionsCompleted: "Misiones Completadas:",
      totalPoints: "Puntos Totales:",
      badgesEarned: "Insignias Ganadas:",
      finalRecommendations: "Recomendaciones Finales:",
      restartGameButton: "¿Jugar de Nuevo?",
      incorrectAnswer: "Respuesta incorrecta. ¡Inténtalo de nuevo!",
      missionCompleteMessage: "¡Misión Completada!",
      noMoreMissions: "¡Has completado todas las misiones disponibles!",
      noRecommendations: "No hay más recomendaciones en este momento.",
      badgeEarned: "Insignia Ganada: "
    }
  };

  // --- Functions ---

  function applyLanguage(lang) {
    document.querySelectorAll("[data-lang-key]").forEach((element) => {
      const key = element.dataset.langKey;
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    // Update input placeholders
    checkInAnswerInput.placeholder = translations[lang].checkInLabel;
  }

  function showScreen(screenId) {
    document.querySelectorAll(".game-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  }

  function resetGame() {
    currentMissionIndex = 0;
    completedMissions = [];
    totalPoints = 0;
    userBadges = new Set();
    hintTextElem.style.display = "none";
    insightArea.style.display = "none";
    checkInAnswerInput.value = "";
    checkInMessageElem.classList.remove("active");
    checkInMessageElem.textContent = "";
    checkInAnswerInput.disabled = false;
    checkInBtn.disabled = false;
    showHintBtn.disabled = false;
    nextMissionBtn.style.display = "none";
    endGameBtn.style.display = "block"; // Ensure End Game is visible on new game
    showScreen("startScreen");
  }

  function getNextMission() {
    // Simple mission selection logic: prioritize based on user's top ranked interests
    // and avoid already completed missions.
    const availableMissions = allMissions.filter(
      (mission) => !completedMissions.some((m) => m.id === mission.id) // Not already completed
    );

    if (availableMissions.length === 0) {
      return null; // No more missions
    }

    // Sort available missions by how well they match user's ranked interests
    // A higher rank (1 being best) gets more priority.
    availableMissions.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      userProfile.rankedInterests.forEach((userInterest) => {
        if (a.interests.includes(userInterest.key_name)) {
          scoreA += 4 - userInterest.rank; // 1st rank gets 3 points, 2nd gets 2, 3rd gets 1
        }
      });
      userProfile.veniceQuests.forEach((userQuest) => {
        if (a.interests.includes(userQuest)) {
          scoreA += 2; // Bonus for matching a specific quest
        }
      });

      userProfile.rankedInterests.forEach((userInterest) => {
        if (b.interests.includes(userInterest.key_name)) {
          scoreB += 4 - userInterest.rank;
        }
      });
      userProfile.veniceQuests.forEach((userQuest) => {
        if (b.interests.includes(userQuest)) {
          scoreB += 2;
        }
      });

      return scoreB - scoreA; // Sort descending by score (highest score first)
    });

    // For simplicity, just take the top mission or the next one in the sorted list
    return availableMissions[0];
  }

  function displayMission() {
    const mission = getNextMission();

    if (!mission) {
      // All missions completed or no suitable mission found
      alert(translations[currentLanguage].noMoreMissions);
      endGame();
      return;
    }

    currentMissionIndex++;
    missionNumberSpan.textContent = currentMissionIndex;
    riddleTextElem.textContent = mission.riddle[currentLanguage];
    hintTextElem.textContent = mission.hint[currentLanguage];
    hintTextElem.style.display = "none"; // Hide hint initially
    insightArea.style.display = "none"; // Hide insight
    checkInAnswerInput.value = "";
    checkInMessageElem.classList.remove("active");
    checkInMessageElem.textContent = "";
    checkInAnswerInput.disabled = false;
    checkInBtn.disabled = false;
    showHintBtn.disabled = false;
    nextMissionBtn.style.display = "none"; // Hide next button until checked in
    endGameBtn.style.display = "block"; // Keep end game button visible
    showScreen("missionScreen");
  }

  function handleCheckIn() {
    const mission = getNextMission(); // Get the current mission being displayed
    if (!mission) return; // Should not happen if displayMission was called correctly

    const userAnswer = checkInAnswerInput.value.trim();
    const correctAnswer = mission.answer.toLowerCase();

    if (userAnswer.toLowerCase() === correctAnswer) {
      checkInMessageElem.textContent =
        translations[currentLanguage].missionCompleteMessage;
      checkInMessageElem.style.color = "#28a745"; // Green for success
      checkInMessageElem.classList.add("active");

      totalPoints += mission.points;
      completedMissions.push(mission);
      userBadges.add(mission.badge); // Add badge

      // Display insight
      insightTextElem.textContent = mission.insight[currentLanguage];
      insightArea.style.display = "block";

      // Disable input and check-in button
      checkInAnswerInput.disabled = true;
      checkInBtn.disabled = true;
      showHintBtn.disabled = true;

      // Show next mission button
      nextMissionBtn.style.display = "block";
    } else {
      checkInMessageElem.textContent =
        translations[currentLanguage].incorrectAnswer;
      checkInMessageElem.style.color = "#d9534f"; // Red for error
      checkInMessageElem.classList.add("active");
    }
  }

  function endGame() {
    showScreen("summaryScreen");
    completedMissionsCount.textContent = completedMissions.length;
    totalPointsCount.textContent = totalPoints;

    // Display badges
    badgesList.innerHTML = "";
    if (userBadges.size === 0) {
      const li = document.createElement("li");
      li.textContent = translations[currentLanguage].noRecommendations; // Reusing for "no badges"
      badgesList.appendChild(li);
    } else {
      userBadges.forEach((badge) => {
        const li = document.createElement("li");
        li.textContent = `${translations[currentLanguage].badgeEarned} ${badge}`;
        badgesList.appendChild(li);
      });
    }

    // Generate final recommendations
    recommendationsList.innerHTML = "";
    const recommendedPois = new Set(); // To avoid duplicate recommendations

    // Prioritize POIs based on user's top interests that haven't been "covered" by missions
    userProfile.rankedInterests.forEach((userInterest) => {
      Object.values(allPois).forEach((poi) => {
        if (
          poi.interests.includes(userInterest.key_name) &&
          !recommendedPois.has(poi.name.en)
        ) {
          // Simple logic: add if interest matches and not already added
          recommendedPois.add(poi.name.en);
          const li = document.createElement("li");
          li.textContent = poi.name[currentLanguage];
          recommendationsList.appendChild(li);
        }
      });
    });

    // Add some quests as recommendations if not covered by missions
    userProfile.veniceQuests.forEach((userQuest) => {
      // Find a POI or general recommendation related to the quest
      if (
        userQuest === "findCicchetti" &&
        !recommendedPois.has(allPois.osteriadaNonoGiacomo.name.en)
      ) {
        recommendedPois.add(allPois.osteriadaNonoGiacomo.name.en);
        const li = document.createElement("li");
        li.textContent = allPois.osteriadaNonoGiacomo.name[currentLanguage];
        recommendationsList.appendChild(li);
      }
      // Add more quest-specific recommendations
    });

    if (recommendationsList.children.length === 0) {
      const li = document.createElement("li");
      li.textContent = translations[currentLanguage].noRecommendations;
      recommendationsList.appendChild(li);
    }
  }

  // --- Event Listeners ---
  languageSelect.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    applyLanguage(currentLanguage);
    // Re-display current mission if on mission screen to update text
    if (missionScreen.classList.contains("active")) {
      const currentMissionData =
        completedMissions[completedMissions.length - 1] || getNextMission(); // Get the last completed or current pending
      if (currentMissionData) {
        riddleTextElem.textContent = currentMissionData.riddle[currentLanguage];
        hintTextElem.textContent = currentMissionData.hint[currentLanguage];
        insightTextElem.textContent =
          currentMissionData.insight[currentLanguage];
      }
    }
    // Re-generate summary if on summary screen
    if (summaryScreen.classList.contains("active")) {
      endGame(); // Re-run endGame to update summary text
    }
  });

  startGameBtn.addEventListener("click", displayMission);
  showHintBtn.addEventListener("click", () => {
    hintTextElem.style.display = "block";
  });
  checkInBtn.addEventListener("click", handleCheckIn);
  checkInAnswerInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleCheckIn();
    }
  });
  nextMissionBtn.addEventListener("click", displayMission);
  endGameBtn.addEventListener("click", endGame);
  restartGameBtn.addEventListener("click", resetGame);

  // --- Initial Setup ---
  applyLanguage(currentLanguage);
  resetGame(); // Start with the start screen
});
