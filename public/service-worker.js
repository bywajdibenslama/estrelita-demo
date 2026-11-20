/* =====================================================================
   SERVICE WORKER DI ESTRELITA
   Fa funzionare l'app anche senza connessione.
   Quando si cambia un file dell'app, aumentare VERSIONE: al prossimo
   avvio il telefono scarica i file nuovi e butta la cache vecchia.
   ===================================================================== */

// Le frasi stanno in content.js: il service worker le legge da lì
importScripts("./content.js");

const VERSIONE = "estrelita-v8";
const CACHE_FONT = "estrelita-font-v1";

// File dell'app, con percorsi relativi alla posizione di questo file
// (così funziona anche da https://utente.github.io/estrelita-demo/)
const FILE_APP = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./content.js",
  "./manifest.json",
  "./icons/tulipano.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

// Installazione: si scarica la versione intera, direttamente dal server.
// cache: "reload" salta la cache HTTP del browser: senza, GitHub Pages
// (che fa tenere i file 10 minuti) può dare un app.js vecchio dentro una
// versione nuova, e l'app si rompe (successo il 2026-11-20 su Chrome per Mac).
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(VERSIONE)
      .then((cache) => cache.addAll(FILE_APP.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

// Attivazione: si cancellano le cache delle versioni precedenti.
// Se c'era una versione vecchia, si ricaricano le pagine aperte: così passano
// tutte insieme ai file nuovi, anche una pagina rotta che da sola non saprebbe farlo.
self.addEventListener("activate", (evento) => {
  evento.waitUntil((async () => {
    const vecchie = (await caches.keys()).filter((n) => n !== VERSIONE && n !== CACHE_FONT);
    await Promise.all(vecchie.map((n) => caches.delete(n)));
    await self.clients.claim();
    if (!vecchie.length) return; // prima installazione: niente da ricaricare
    const finestre = await self.clients.matchAll({ type: "window" });
    // La ricarica NON si aspetta: la pagina ricaricata chiede i file a questo
    // service worker, che non risponde finché l'attivazione non è finita.
    // Aspettarla qui bloccherebbe tutto (successo nella prova del 2026-11-20).
    finestre.forEach((f) => f.navigate(f.url).catch(() => {}));
  })());
});

// Richieste: i file dell'app escono SOLO dalla cache della versione attiva,
// tutti insieme. Mai un file nuovo accanto a uno vecchio: le novità arrivano
// con la versione successiva (VERSIONE), che l'app carica ricaricandosi una volta.
self.addEventListener("fetch", (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== "GET") return;
  const url = new URL(richiesta.url);

  // Caratteri di Google Fonts: in una cache a parte, così restano anche offline
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    evento.respondWith(caratteri(richiesta));
    return;
  }

  // Solo i file della nostra app
  if (url.origin !== self.location.origin) return;

  evento.respondWith(
    caches.open(VERSIONE).then(async (cache) => {
      const inCache = await cache.match(richiesta, { ignoreSearch: true });
      if (inCache) return inCache;
      // Apertura di una pagina che non è in cache (es. ./?qualcosa): si mostra la home
      if (richiesta.mode === "navigate") {
        const home = await cache.match("./");
        if (home) return home;
      }
      return fetch(richiesta);
    })
  );
});

// Caratteri: dalla cache se ci sono, altrimenti dalla rete e si conservano
async function caratteri(richiesta) {
  const cache = await caches.open(CACHE_FONT);
  const inCache = await cache.match(richiesta);
  if (inCache) return inCache;
  const risposta = await fetch(richiesta);
  if (risposta && (risposta.ok || risposta.type === "opaque")) cache.put(richiesta, risposta.clone());
  return risposta;
}

// Tocco sulla notifica: si apre (o si porta in primo piano) l'app
self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((finestre) => {
      for (const finestra of finestre) {
        if ("focus" in finestra) return finestra.focus();
      }
      return self.clients.openWindow("./");
    })
  );
});

// Invio giornaliero in background (solo Chrome con l'app installata):
// il telefono sveglia il service worker circa una volta al giorno.
self.addEventListener("periodicsync", (evento) => {
  if (evento.tag !== "riflessione-del-giorno") return;
  evento.waitUntil(mostraRiflessione());
});

// Stessa regola dell'app: stessa frase per tutto il giorno
function fraseDelGiorno() {
  const oggi = new Date();
  const giorni = Math.floor(Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()) / 86400000);
  return CONTENUTI.frasi[giorni % CONTENUTI.frasi.length];
}

async function mostraRiflessione() {
  if (Notification.permission !== "granted") return;
  await self.registration.showNotification(CONTENUTI.notifiche.titolo, {
    body: fraseDelGiorno().testo,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: "riflessione-del-giorno",
    lang: "it"
  });
}
