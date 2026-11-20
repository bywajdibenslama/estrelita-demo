/* =====================================================================
   SERVICE WORKER DI ESTRELITA
   Fa funzionare l'app anche senza connessione.
   Quando si cambia un file dell'app, aumentare VERSIONE: al prossimo
   avvio il telefono scarica i file nuovi e butta la cache vecchia.
   ===================================================================== */

// Le frasi stanno in content.js: il service worker le legge da lì
importScripts("./content.js");

const VERSIONE = "estrelita-v5";
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

// Installazione: si mettono in cache tutti i file dell'app
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(VERSIONE).then((cache) => cache.addAll(FILE_APP)).then(() => self.skipWaiting())
  );
});

// Attivazione: si cancellano le cache delle versioni precedenti
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(
        nomi.filter((n) => n !== VERSIONE && n !== CACHE_FONT).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Richieste: prima la cache (risposta immediata, anche offline),
// intanto si aggiorna la copia dalla rete per la volta successiva.
self.addEventListener("fetch", (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== "GET") return;
  const url = new URL(richiesta.url);

  // Caratteri di Google Fonts: in una cache a parte, così restano anche offline
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    evento.respondWith(cacheERete(richiesta, CACHE_FONT));
    return;
  }

  // Solo i file della nostra app
  if (url.origin !== self.location.origin) return;

  // Apertura di una pagina: se non c'è in cache, si mostra la home
  if (richiesta.mode === "navigate") {
    evento.respondWith(
      cacheERete(richiesta, VERSIONE).catch(() => caches.match("./index.html"))
    );
    return;
  }

  evento.respondWith(cacheERete(richiesta, VERSIONE));
});

// Strategia "stale-while-revalidate": risponde con la cache e aggiorna in background
async function cacheERete(richiesta, nomeCache) {
  const cache = await caches.open(nomeCache);
  const inCache = await cache.match(richiesta, { ignoreSearch: true });
  const daRete = fetch(richiesta)
    .then((risposta) => {
      if (risposta && (risposta.ok || risposta.type === "opaque")) {
        cache.put(richiesta, risposta.clone());
      }
      return risposta;
    });
  if (inCache) {
    daRete.catch(() => {}); // offline: va bene così, la copia in cache basta
    return inCache;
  }
  return daRete; // non c'è in cache: serve la rete (se manca, decide chi chiama)
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
