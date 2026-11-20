/* =====================================================================
   CONTENUTI DELL'APP DI ESTRELITA
   ---------------------------------------------------------------------
   Tutti i testi che si vedono nell'app stanno qui, in un solo posto.
   Per cambiare una frase basta modificare il testo fra le virgolette:
   non serve toccare nessun altro file.

   Regole per non rompere niente:
   - ogni testo sta fra virgolette doppie "..."
   - se dentro al testo serve una virgoletta doppia, usa « » al suo posto
   - fra un elemento e l'altro di un elenco ci vuole la virgola
   ===================================================================== */

const CONTENUTI = {

  /* ---------- Identità ---------- */
  nome: "Estrelita",
  ruolo: "Coach spirituale",
  iniziale: "E",
  whatsapp: "https://wa.me/393348729250",
  bannerDemo: "Demo realizzata da Wajdi Ben Slama",

  /* ---------- Saluti, in base all'ora ---------- */
  saluti: {
    mattina: "Buongiorno",        // dalle 5 alle 13
    pomeriggio: "Buon pomeriggio", // dalle 13 alle 18
    sera: "Buonasera"             // dalle 18 alle 5
  },
  sottotitoloHome: "Prenditi un momento solo per te.",

  /* ---------- Le 14 riflessioni del giorno ----------
     Ne viene mostrata una al giorno, a rotazione in base alla data.
     Ogni riflessione ha: la frase, un breve approfondimento e una domanda. */
  frasi: [
    {
      testo: "Non sei in ritardo sulla tua vita. Stai fiorendo nel tuo tempo.",
      approfondimento: "Il tulipano resta sotto terra per tutto l'inverno, e nessuno gli chiede di sbrigarsi. Anche tu hai stagioni di silenzio e stagioni di fioritura. Confrontarti con i tempi degli altri ti toglie la gioia dei tuoi.",
      domanda: "In quale parte della tua vita ti stai chiedendo di correre, quando avresti bisogno di aspettare?"
    },
    {
      testo: "Anche il seme più piccolo sa, nel buio, che la luce arriverà.",
      approfondimento: "Ci sono momenti in cui non vediamo nessun segno di cambiamento. Eppure, proprio lì sotto, qualcosa sta mettendo radici. Il buio non è sempre una fine: a volte è il luogo in cui si prepara un inizio.",
      domanda: "Quale piccolo seme stai custodendo in questo periodo?"
    },
    {
      testo: "Non devi avere tutte le risposte oggi. Basta il prossimo passo, fatto con gentilezza.",
      approfondimento: "Quando la strada sembra lunga, la mente vuole vedere subito l'arrivo. Ma la vita si percorre un passo alla volta. Un gesto piccolo e gentile vale più di mille piani che ci fanno paura.",
      domanda: "Qual è il passo più piccolo che puoi fare oggi per te stessa?"
    },
    {
      testo: "Accogliere ciò che senti non è arrendersi: è il primo modo di prenderti cura di te.",
      approfondimento: "Spesso combattiamo le nostre emozioni come se fossero nemiche. La tristezza, la paura, la rabbia portano un messaggio. Ascoltarle con pazienza le rende più leggere, e ci restituisce a noi stesse.",
      domanda: "Quale emozione stai cercando di allontanare, e cosa vorrebbe dirti?"
    },
    {
      testo: "La tua forza non si misura da quanto resisti, ma da quanto sai rialzarti con dolcezza.",
      approfondimento: "Non serve essere dure per essere forti. La vera forza è quella che cade, si concede una pausa e poi riprende il cammino. Rialzarsi con dolcezza significa non punirsi per essere cadute.",
      domanda: "Ricordi una volta in cui ti sei rialzata? Cosa ti ha aiutata?"
    },
    {
      testo: "Ogni mattina la vita ti offre una pagina bianca. Non serve scriverla perfetta, serve scriverla tua.",
      approfondimento: "La ricerca della perfezione ci blocca prima ancora di cominciare. Ma una giornata non va superata come un esame: va vissuta. Le righe storte fanno parte della tua storia quanto quelle dritte.",
      domanda: "Cosa vorresti scrivere sulla pagina di oggi?"
    },
    {
      testo: "Quello che oggi pesa, domani potrà diventare radice.",
      approfondimento: "Le prove che attraversiamo non spariscono: si trasformano. Ciò che oggi sembra solo un peso può diventare, col tempo, il terreno solido su cui poggi i piedi. Non devi capire tutto adesso.",
      domanda: "C'è una difficoltà passata che oggi riconosci come una tua radice?"
    },
    {
      testo: "La speranza è una piccola luce accesa dentro di te: non abbaglia, ma basta per vedere il prossimo gradino.",
      approfondimento: "Non serve una grande certezza per andare avanti. Basta una luce piccola, costante, che illumini il prossimo passo. La speranza non promette che sarà facile: ricorda che non sei sola nel buio.",
      domanda: "Cosa tiene accesa la tua piccola luce in questi giorni?"
    },
    {
      testo: "Fidarti di te è ricordare tutte le volte in cui ce l'hai fatta, anche quando non ci credevi.",
      approfondimento: "La mente tende a ricordare le cadute e a dimenticare le risalite. Eppure sei arrivata fin qui, attraversando giorni che sembravano impossibili. La fiducia in te stessa nasce da questa memoria.",
      domanda: "Quale momento difficile hai superato, che oggi ti rende orgogliosa?"
    },
    {
      testo: "Lasciar andare non significa dimenticare: significa fare spazio a ciò che deve arrivare.",
      approfondimento: "Trattenere ciò che è finito ci stanca e ci chiude. Lasciare andare è un atto d'amore: verso ciò che è stato, e verso ciò che ancora non conosci. Le mani aperte possono ricevere.",
      domanda: "Cosa sei pronta a lasciare andare, anche solo un poco?"
    },
    {
      testo: "Il silenzio non è vuoto: è il luogo dove la tua anima torna a parlarti.",
      approfondimento: "Nel rumore delle giornate perdiamo la nostra voce più profonda. Bastano pochi minuti di silenzio per ritrovarla. Non devi cercare risposte: ti basta ascoltare cosa emerge.",
      domanda: "Quando è stata l'ultima volta che ti sei concessa un momento di vero silenzio?"
    },
    {
      testo: "Puoi essere insieme fragile e forte. È così che fiorisce un tulipano.",
      approfondimento: "Il tulipano piega lo stelo verso la luce, ma non si spezza. Ha petali delicati e radici tenaci. Anche tu non devi scegliere fra fragilità e forza: sono due parti della stessa bellezza.",
      domanda: "In che modo la tua fragilità ti ha resa più vera?"
    },
    {
      testo: "Ciò che hai attraversato non ti ha resa più piccola: ti ha resa più profonda.",
      approfondimento: "Il dolore lascia segni, ma non toglie valore. Ogni prova ti ha insegnato qualcosa sull'ascolto, sulla compassione, sulla pazienza. La profondità che porti oggi è un dono anche per chi ti sta vicino.",
      domanda: "Cosa hai imparato di te che prima non sapevi?"
    },
    {
      testo: "Oggi scegli una cosa sola da amare di te. Domani ne troverai un'altra.",
      approfondimento: "L'amore per sé non arriva tutto insieme: si costruisce con piccoli riconoscimenti quotidiani. Un tuo gesto, un tuo pensiero, il modo in cui ti prendi cura degli altri. Ogni giorno, un fiore in più.",
      domanda: "Quale cosa di te scegli di amare oggi?"
    }
  ],

  /* ---------- Notifiche ---------- */
  notifiche: {
    pulsante: "Attiva la riflessione del giorno",
    attivate: "Riflessione del giorno attivata",
    titolo: "La riflessione del giorno 🌷",
    // Messaggio quando le notifiche non ci sono perché l'app non è installata (iPhone)
    installaPrima: "Su iPhone la riflessione del giorno arriva solo all'app installata: aggiungila alla schermata Home e aprila dal tulipano. Ti aspetto lì 🌷",
    nonSupportate: "Questo browser non permette le notifiche. Puoi comunque trovare ogni giorno la tua riflessione qui, nella home.",
    negate: "Le notifiche sono disattivate. Se cambi idea, puoi riattivarle dalle impostazioni del telefono, alla voce di questa app.",
    inviata: "Ecco la tua prima riflessione: l'hai ricevuta come notifica."
  },

  /* ---------- Guida all'installazione ----------
     Per mandarla ai clienti: il link dell'app con #installa in fondo
     (es. https://…/estrelita-demo/#installa) apre subito questa guida.
     Nei passi: **parola** = grassetto; {condividi} {aggiungi} {menu} = icona disegnata. */
  installa: {
    card: {
      titolo: "Porta Estrelita con te",
      testo: "Installa l'app sul telefono: si apre con un tocco, anche senza internet."
    },
    linkChiSono: "Come installare l'app sul telefono",
    mostramiCome: "Mostrami come si fa →",
    titolo: "Installa l'app",
    introduzione: "Bastano pochi tocchi. Poi troverai il tulipano sulla schermata Home, accanto alle tue app, e ti basterà toccarlo per tornare qui.",
    installaOra: "Installa ora",
    iphone: {
      passi: [
        "Apri questa pagina con **Safari**, la bussola blu.",
        "Tocca **Condividi** {condividi}. Se non lo vedi, tocca prima **•••** in basso.",
        "Scorri verso il basso e tocca **Aggiungi alla schermata Home** {aggiungi}.",
        "Tocca **Aggiungi**. Fatto! Ora apri l'app dal tulipano 🌷"
      ],
      nota: "Hai aperto il link da WhatsApp o Instagram? Tocca prima «Apri in Safari», oppure copia il link qui sotto e incollalo in Safari."
    },
    android: {
      passi: [
        "Apri questa pagina con **Chrome**.",
        "Tocca il menu {menu} in alto a destra.",
        "Tocca **Installa app** oppure **Aggiungi a schermata Home**.",
        "Conferma con **Installa**. Fatto! Ora apri l'app dal tulipano 🌷"
      ],
      nota: "Con Samsung Internet: tocca il menu ≡ in basso, poi «Aggiungi pagina a» e «Schermata Home»."
    },
    copiaLink: "Copia il link dell'app",
    linkCopiato: "Link copiato 🌷",
    giaInstallata: "L'app è già installata: la stai usando proprio ora 🌷",
    installata: "Installata! Trovi il tulipano sulla schermata Home 🌷"
  },

  /* ---------- Esercizi ---------- */
  esercizi: {
    titolo: "Esercizi",
    sottotitolo: "Piccole pratiche per tornare a te.",
    elenco: [
      { id: "respiro",     icona: "🌬️", nome: "Respirazione guidata",   descrizione: "Un minuto per calmare il cuore." },
      { id: "gratitudine", icona: "🌼", nome: "Gratitudine",            descrizione: "Tre cose belle di oggi." },
      { id: "affermazione",icona: "✨", nome: "Affermazione positiva",  descrizione: "Una frase da ripetere a te stessa." },
      { id: "lettera",     icona: "💌", nome: "Lettera a te stessa",    descrizione: "Scrivi con tenerezza, senza giudizio." }
    ],

    respiro: {
      introduzione: "Siediti comoda, appoggia le spalle e segui il cerchio con il respiro.",
      inspira: "Inspira",
      trattieni: "Trattieni",
      espira: "Espira",
      fine: "Ben fatto. Porta con te questa calma.",
      inizia: "Inizia",
      ferma: "Ferma",
      ricomincia: "Ricomincia"
    },

    gratitudine: {
      introduzione: "Pensa alla tua giornata. Anche le cose più piccole contano: un sorriso, una tazza calda, un raggio di sole.",
      segnaposto: ["Oggi sono grata per…", "Sono grata anche per…", "E infine, sono grata per…"],
      salva: "Salva nel diario",
      salvato: "Salvato nel tuo diario 🌷"
    },

    affermazione: {
      introduzione: "Leggila lentamente, tre volte. Lascia che le parole arrivino fino al cuore.",
      altra: "Un'altra"
    },

    lettera: {
      introduzione: "Scrivi a te stessa come scriveresti a un'amica che ami. Con pazienza, con dolcezza.",
      segnaposto: "Cara me,\n",
      salva: "Salva nel diario",
      salvato: "La tua lettera è nel diario 💌"
    }
  },

  /* ---------- Affermazioni positive ---------- */
  affermazioni: [
    "Sto fiorendo, un giorno alla volta.",
    "Merito pace, amore e cose belle.",
    "Sono al sicuro dentro di me.",
    "Ogni respiro mi riporta al presente.",
    "Ho dentro di me ciò che serve per affrontare questa giornata.",
    "Mi concedo il permesso di andare piano.",
    "Le mie emozioni sono messaggere, non nemiche.",
    "Scelgo di fidarmi del mio cammino.",
    "Sono degna di amore così come sono.",
    "La luce che cerco è già in me.",
    "Posso ricominciare in ogni momento.",
    "Lascio andare ciò che non posso controllare."
  ],

  /* ---------- Diario ---------- */
  diario: {
    titolo: "Il tuo diario",
    sottotitolo: "Uno spazio solo tuo. Resta su questo telefono.",
    domandaUmore: "Come ti senti oggi?",
    umori: [
      { emoji: "😢", nome: "Giù" },
      { emoji: "😟", nome: "Inquieta" },
      { emoji: "😐", nome: "Così così" },
      { emoji: "🙂", nome: "Serena" },
      { emoji: "😊", nome: "Radiosa" }
    ],
    segnapostoNota: "Se vuoi, scrivi qualcosa su questa giornata…",
    salva: "Salva",
    salvato: "Salvato nel tuo diario 🌷",
    scegliUmore: "Scegli prima come ti senti.",
    vuoto: "Il tuo diario è ancora vuoto. La prima pagina ti aspetta.",
    eliminata: "Voce eliminata",
    annulla: "Annulla",
    etichette: {
      umore: "Umore",
      gratitudine: "Gratitudine",
      lettera: "Lettera a me stessa",
      riflessione: "Riflessione"
    }
  },

  /* ---------- Chi sono ----------
     Testo segnaposto: Estrelita lo sostituirà con le sue parole. */
  chiSono: {
    titolo: "Chi sono",
    presentazione: [
      "Ciao, sono Estrelita.",
      "Anch'io ho attraversato momenti in cui la fiducia sembrava perduta e la speranza troppo lontana. È proprio lì che ho scoperto che dentro ognuna di noi c'è una luce che non si spegne mai del tutto: a volte ha solo bisogno di qualcuno che ci aiuti a ritrovarla.",
      "Oggi accompagno le persone in questo cammino. Con l'ascolto, la spiritualità e piccole pratiche quotidiane, ti aiuto ad accogliere ciò che vivi, a ritrovare la tua forza interiore e a guardare avanti con occhi nuovi.",
      "Questa app è un piccolo giardino che ho pensato per te: torna qui ogni volta che hai bisogno di una parola gentile."
    ],
    firma: "Con amore, Estrelita 🌷",
    pulsanteWhatsapp: "Scrivimi su WhatsApp"
  }
};
