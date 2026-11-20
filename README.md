# Estrelita · demo dell'app

Demo di web app installabile (PWA) per Estrelita, coach spirituale: riflessione del giorno, quattro esercizi, un diario e la presentazione.

Statica: HTML, un CSS, un JS. Niente framework, niente build, niente server. Il diario resta nel telefono di chi lo usa (localStorage).

## Cambiare i testi

Tutti i testi stanno in [`public/content.js`](public/content.js): le 14 frasi del giorno, le affermazioni, gli esercizi, la presentazione, il link WhatsApp. Dopo una modifica, alzare `VERSIONE` in [`public/service-worker.js`](public/service-worker.js) (es. `estrelita-v2`), altrimenti i telefoni con l'app installata tengono la copia vecchia.

## File

```
public/
├── index.html          le 4 schermate e la barra in basso
├── styles.css          colori, caratteri, animazioni
├── app.js              comportamento
├── content.js          tutti i testi
├── manifest.json       nome, icone, colori dell'app installata
├── service-worker.js   funzionamento offline e notifiche
└── icons/              tulipano: 192, 512, maskable 512, apple-touch 180, svg
.github/workflows/pages.yml   pubblica public/ a ogni push su main
```

## Provarla in locale

```sh
cd public && python3 -m http.server 8080
```

poi aprire http://localhost:8080 (il service worker funziona solo su localhost o https).

## Pubblicazione

Ogni push su `main` pubblica `public/` su GitHub Pages con le action ufficiali `upload-pages-artifact` e `deploy-pages`. Tutti i percorsi sono relativi (`./`), quindi l'app funziona dal sottopercorso `/estrelita-demo/`.
