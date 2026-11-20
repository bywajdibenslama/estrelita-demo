/* =====================================================================
   ESTRELITA — logica dell'app
   I testi stanno in content.js (oggetto CONTENUTI); qui c'è solo il
   comportamento. Niente framework, niente server: il diario resta nel
   telefono, in localStorage.
   ===================================================================== */

(() => {
  "use strict";

  const C = CONTENUTI;
  const $ = (sel, dove = document) => dove.querySelector(sel);
  const $$ = (sel, dove = document) => [...dove.querySelectorAll(sel)];

  /* ---------------------------------------------------------------
     Memoria locale: tutto passa da qui, con try/catch perché in
     navigazione privata localStorage può non esserci.
     --------------------------------------------------------------- */
  const CHIAVE_DIARIO = "estrelita.diario.v1";
  const memoria = {
    leggi(chiave, predefinito) {
      try {
        const valore = localStorage.getItem(chiave);
        return valore === null ? predefinito : JSON.parse(valore);
      } catch { return predefinito; }
    },
    scrivi(chiave, valore) {
      try { localStorage.setItem(chiave, JSON.stringify(valore)); return true; }
      catch { return false; }
    }
  };

  /* ---------------------------------------------------------------
     Testi statici: ogni elemento con data-testo="a.b" riceve CONTENUTI.a.b
     --------------------------------------------------------------- */
  function testo(percorso) {
    return percorso.split(".").reduce((o, k) => (o ? o[k] : undefined), C);
  }
  $$("[data-testo]").forEach((el) => { el.textContent = testo(el.dataset.testo) ?? ""; });

  /* ---------------------------------------------------------------
     Apertura animata: una volta per sessione, si salta con un tocco
     --------------------------------------------------------------- */
  const intro = $("#intro");
  function chiudiIntro() { intro.classList.add("via"); }
  let introGiaVista = false;
  try { introGiaVista = sessionStorage.getItem("estrelita.intro") === "1"; } catch {}
  if (introGiaVista) {
    intro.remove();
  } else {
    try { sessionStorage.setItem("estrelita.intro", "1"); } catch {}
    setTimeout(chiudiIntro, 3300);
    intro.addEventListener("click", chiudiIntro);
    intro.addEventListener("transitionend", () => intro.remove(), { once: true });
  }

  /* ---------------------------------------------------------------
     Navigazione fra le 4 schermate
     --------------------------------------------------------------- */
  function vai(id) {
    $$(".schermata").forEach((s) => s.classList.toggle("attiva", s.id === id));
    $$(".barra-voce").forEach((b) => {
      const attiva = b.dataset.vai === id;
      b.classList.toggle("attiva", attiva);
      b.setAttribute("aria-current", attiva ? "page" : "false");
    });
    const schermata = $("#" + id);
    schermata.scrollTop = 0;
    // Le animazioni di comparsa ripartono a ogni visita
    $$(".entra", schermata).forEach((el) => { el.style.animation = "none"; el.offsetHeight; el.style.animation = ""; });
    if (id !== "esercizi") fermaRespiro();
  }
  $$(".barra-voce").forEach((b) => b.addEventListener("click", () => vai(b.dataset.vai)));

  /* ---------------------------------------------------------------
     Avviso breve in basso, con eventuale azione (es. "Annulla")
     --------------------------------------------------------------- */
  const avviso = $("#avviso");
  let timerAvviso;
  function mostraAvviso(messaggio, azione) {
    clearTimeout(timerAvviso);
    avviso.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = messaggio;
    avviso.append(span);
    if (azione) {
      const btn = document.createElement("button");
      btn.textContent = azione.testo;
      btn.addEventListener("click", () => { azione.fai(); avviso.classList.remove("visibile"); });
      avviso.append(btn);
    }
    avviso.classList.add("visibile");
    timerAvviso = setTimeout(() => avviso.classList.remove("visibile"), azione ? 5000 : 2800);
  }

  /* =================================================================
     1. HOME
     ================================================================= */

  // Saluto in base all'ora
  function saluto() {
    const ora = new Date().getHours();
    if (ora >= 5 && ora < 13) return C.saluti.mattina;
    if (ora >= 13 && ora < 18) return C.saluti.pomeriggio;
    return C.saluti.sera;
  }
  $("#saluto").textContent = saluto();
  $("#data-oggi").textContent = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });

  // Frase del giorno: stessa frase per tutto il giorno, cambia a mezzanotte
  function fraseDelGiorno() {
    const oggi = new Date();
    const giorni = Math.floor(Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()) / 86400000);
    return C.frasi[giorni % C.frasi.length];
  }
  const frase = fraseDelGiorno();
  $("#frase-oggi").textContent = frase.testo;

  // Banner della demo, chiudibile (resta chiuso anche alle aperture successive)
  const banner = $("#banner-demo");
  if (memoria.leggi("estrelita.bannerChiuso", false)) banner.remove();
  $("#banner-chiudi").addEventListener("click", () => {
    banner.classList.add("via");
    memoria.scrivi("estrelita.bannerChiuso", true);
    setTimeout(() => banner.remove(), 500);
  });

  // Foglio "Rifletti": approfondimento e domanda
  const foglio = $("#foglio");
  const velo = $("#velo");
  function apriFoglio() {
    $("#foglio-testo").textContent = frase.approfondimento;
    $("#foglio-domanda").textContent = frase.domanda;
    foglio.classList.remove("chiude");
    foglio.hidden = false;
    velo.hidden = false;
    $("#btn-chiudi-foglio").focus({ preventScroll: true });
  }
  function chiudiFoglio() {
    foglio.classList.add("chiude");
    velo.hidden = true;
    setTimeout(() => { foglio.hidden = true; }, 420);
  }
  $("#btn-rifletti").addEventListener("click", apriFoglio);
  $("#btn-chiudi-foglio").addEventListener("click", chiudiFoglio);
  // Il velo e il tasto Esc chiudono il foglio aperto, qualunque sia
  function chiudiFoglioAperto() {
    if (!foglio.hidden) chiudiFoglio();
    if (!$("#foglio-installa").hidden) chiudiGuida();
  }
  velo.addEventListener("click", chiudiFoglioAperto);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") chiudiFoglioAperto(); });

  // "Rispondi nel diario": porta al diario con la domanda come guida
  let domandaInSospeso = null;
  $("#btn-rispondi").addEventListener("click", () => {
    domandaInSospeso = frase.domanda;
    const guida = $("#diario-guida");
    guida.textContent = frase.domanda;
    guida.hidden = false;
    chiudiFoglio();
    setTimeout(() => { vai("diario"); $("#diario-nota").focus({ preventScroll: true }); }, 300);
  });

  /* ---------- Notifiche: interruttore acceso/spento ----------
     Acceso: chiede il permesso e manda subito la frase del giorno.
     Su Android con l'app installata registra anche l'invio giornaliero
     in background (Periodic Background Sync, solo Chrome; vedi service-worker.js).
     Spento: niente più notifiche dall'app. Il permesso del telefono resta
     com'è: un sito non può toglierselo da solo. */
  const interruttore = $("#interruttore-notifiche");
  const msgNotifiche = $("#msg-notifiche");
  const ePhone = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const installata = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const SYNC_TAG = "riflessione-del-giorno";

  // Acceso = scelta salvata E permesso del telefono concesso
  function notificheAccese() {
    return "Notification" in window && Notification.permission === "granted" &&
      memoria.leggi("estrelita.notifiche", false) === true;
  }
  function aggiornaInterruttore() {
    const acceso = notificheAccese();
    interruttore.setAttribute("aria-checked", String(acceso));
    $("#interruttore-stato").textContent = acceso ? C.notifiche.statoAcceso : C.notifiche.statoSpento;
  }
  aggiornaInterruttore();

  // Messaggio sotto l'interruttore; con conGuida compare anche "Mostrami come si fa"
  function messaggioGentile(testoMsg, conGuida = false) {
    $("#msg-notifiche-testo").textContent = testoMsg;
    $("#msg-notifiche-guida").hidden = !conGuida;
    msgNotifiche.hidden = false;
  }
  $("#msg-notifiche-guida").addEventListener("click", () => apriGuida());

  async function inviaNotificaDiProva() {
    const opzioni = {
      body: frase.testo,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      tag: "riflessione-del-giorno",
      lang: "it"
    };
    // Su Android le notifiche si mandano solo dal service worker
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) { await reg.showNotification(C.notifiche.titolo, opzioni); return; }
    }
    new Notification(C.notifiche.titolo, opzioni);
  }

  // Invio giornaliero in background: c'è solo in Chrome con l'app installata.
  // Se non c'è, non succede niente di male: l'interruttore funziona lo stesso.
  async function invioGiornaliero(attivo) {
    try {
      const reg = await navigator.serviceWorker?.ready;
      if (!reg || !("periodicSync" in reg)) return;
      if (attivo) {
        const stato = await navigator.permissions.query({ name: "periodic-background-sync" });
        if (stato.state === "granted") await reg.periodicSync.register(SYNC_TAG, { minInterval: 24 * 60 * 60 * 1000 });
      } else {
        await reg.periodicSync.unregister(SYNC_TAG);
      }
    } catch (errore) {
      console.info("Invio giornaliero non disponibile:", errore.message);
    }
  }

  async function accendiNotifiche() {
    if (!("Notification" in window)) {
      // Su iPhone le notifiche esistono solo se l'app è installata nella schermata Home
      if (ePhone && !installata) messaggioGentile(C.notifiche.installaPrima, true);
      else messaggioGentile(C.notifiche.nonSupportate);
      return;
    }
    const permesso = Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
    if (permesso !== "granted") { messaggioGentile(C.notifiche.negate); return; }
    memoria.scrivi("estrelita.notifiche", true);
    aggiornaInterruttore();
    await inviaNotificaDiProva();
    invioGiornaliero(true);
    mostraAvviso(C.notifiche.inviata);
  }

  function spegniNotifiche() {
    memoria.scrivi("estrelita.notifiche", false);
    aggiornaInterruttore();
    invioGiornaliero(false);
    mostraAvviso(C.notifiche.spente);
  }

  interruttore.addEventListener("click", async () => {
    msgNotifiche.hidden = true;
    try {
      if (notificheAccese()) spegniNotifiche();
      else await accendiNotifiche();
    } catch (errore) {
      console.warn("Notifica non inviata:", errore);
      messaggioGentile(C.notifiche.nonSupportate);
      aggiornaInterruttore();
    }
  });
  // Toccando il testo accanto si usa l'interruttore
  $(".interruttore-testi").addEventListener("click", (e) => { e.preventDefault(); interruttore.click(); });
  // Se il permesso cambia dalle impostazioni del telefono, l'interruttore si adegua al ritorno
  document.addEventListener("visibilitychange", () => { if (!document.hidden) aggiornaInterruttore(); });

  /* =================================================================
     2. ESERCIZI
     ================================================================= */
  const elencoEsercizi = $("#elenco-esercizi");
  C.esercizi.elenco.forEach((es, i) => {
    const voce = document.createElement("button");
    voce.className = "esercizio-voce";
    voce.style.animationDelay = (i * 0.08) + "s";
    voce.innerHTML = `
      <span class="esercizio-icona" aria-hidden="true"></span>
      <span><span class="esercizio-nome"></span><span class="esercizio-descrizione"></span></span>
      <span class="esercizio-freccia" aria-hidden="true">›</span>`;
    $(".esercizio-icona", voce).textContent = es.icona;
    $(".esercizio-nome", voce).textContent = es.nome;
    $(".esercizio-nome", voce).style.display = "block";
    $(".esercizio-descrizione", voce).textContent = es.descrizione;
    $(".esercizio-descrizione", voce).style.display = "block";
    voce.addEventListener("click", () => apriEsercizio(es.id));
    elencoEsercizi.append(voce);
  });

  const vistaElenco = $("#esercizi-elenco");
  const vistaDettaglio = $("#esercizio-dettaglio");
  const contenuto = $("#esercizio-contenuto");

  function apriEsercizio(id) {
    const es = C.esercizi.elenco.find((e) => e.id === id);
    contenuto.innerHTML = "";
    const titolo = document.createElement("h1");
    titolo.className = "titolo";
    titolo.textContent = es.nome;
    const intro = document.createElement("p");
    intro.className = "introduzione";
    intro.textContent = C.esercizi[id].introduzione;
    contenuto.append(titolo, intro);
    ({ respiro: costruisciRespiro, gratitudine: costruisciGratitudine,
       affermazione: costruisciAffermazione, lettera: costruisciLettera })[id](contenuto);
    vistaElenco.hidden = true;
    vistaDettaglio.hidden = false;
    $("#esercizi").scrollTop = 0;
  }
  function chiudiEsercizio() {
    fermaRespiro();
    vistaDettaglio.hidden = true;
    vistaElenco.hidden = false;
  }
  $("#btn-indietro").addEventListener("click", chiudiEsercizio);
  // Tornando su "Esercizi" dalla barra si riparte dall'elenco
  $('[data-vai="esercizi"]').addEventListener("click", chiudiEsercizio);

  function pulsante(testoBtn, classe = "pulsante-primario") {
    const b = document.createElement("button");
    b.className = "pulsante " + classe;
    b.textContent = testoBtn;
    return b;
  }

  /* ---------- Respirazione guidata: 4s inspira, 4s trattieni, 6s espira, per 1 minuto ---------- */
  const FASI = [
    { nome: "inspira", secondi: 4, scala: 1 },
    { nome: "trattieni", secondi: 4, scala: 1 },
    { nome: "espira", secondi: 6, scala: 0.45 }
  ];
  const DURATA_RESPIRO = 60;
  let respiro = null; // stato dell'esercizio in corso

  function costruisciRespiro(dove) {
    const T = C.esercizi.respiro;
    dove.insertAdjacentHTML("beforeend", `
      <div class="respiro-area">
        <div class="respiro-anello"></div>
        <div class="respiro-cerchio" id="respiro-cerchio"></div>
        <p class="respiro-guida" id="respiro-guida">1:00</p>
      </div>
      <p class="respiro-tempo" id="respiro-tempo">&nbsp;</p>`);
    const btn = pulsante(T.inizia);
    btn.id = "btn-respiro";
    btn.addEventListener("click", () => (respiro ? fermaRespiro(true) : avviaRespiro()));
    dove.append(btn);
  }

  function avviaRespiro() {
    const T = C.esercizi.respiro;
    const cerchio = $("#respiro-cerchio");
    const guida = $("#respiro-guida");
    const tempo = $("#respiro-tempo");
    const btn = $("#btn-respiro");
    btn.textContent = T.ferma;
    const inizio = Date.now();
    respiro = { timer: null, conto: null };

    // Una fase alla volta: il cerchio si muove con la durata della fase
    let indice = 0;
    function prossimaFase() {
      const trascorsi = (Date.now() - inizio) / 1000;
      if (trascorsi >= DURATA_RESPIRO - 0.5) return concludi();
      const fase = FASI[indice % FASI.length];
      cerchio.style.transitionDuration = fase.secondi + "s";
      cerchio.style.transform = `scale(${fase.scala})`;
      guida.innerHTML = "";
      guida.append(T[fase.nome]);
      const sec = document.createElement("small");
      sec.textContent = fase.secondi + " secondi";
      guida.append(sec);
      indice++;
      respiro.timer = setTimeout(prossimaFase, fase.secondi * 1000);
    }
    function aggiornaConto() {
      const resto = Math.max(0, DURATA_RESPIRO - Math.floor((Date.now() - inizio) / 1000));
      tempo.textContent = `0:${String(resto).padStart(2, "0")}`.replace("0:60", "1:00");
    }
    function concludi() {
      fermaRespiro();
      guida.textContent = "";
      tempo.textContent = T.fine;
      btn.textContent = T.ricomincia;
      mostraAvviso("🌷 " + T.fine);
    }
    aggiornaConto();
    respiro.conto = setInterval(aggiornaConto, 250);
    prossimaFase();
  }

  function fermaRespiro(daUtente) {
    if (!respiro) return;
    clearTimeout(respiro.timer);
    clearInterval(respiro.conto);
    respiro = null;
    const cerchio = $("#respiro-cerchio");
    if (cerchio) { cerchio.style.transitionDuration = "1.5s"; cerchio.style.transform = "scale(.45)"; }
    if (daUtente) {
      $("#btn-respiro").textContent = C.esercizi.respiro.inizia;
      $("#respiro-guida").textContent = "1:00";
      $("#respiro-tempo").innerHTML = "&nbsp;";
    }
  }

  /* ---------- Gratitudine: 3 cose, si salvano nel diario ---------- */
  function costruisciGratitudine(dove) {
    const T = C.esercizi.gratitudine;
    const card = document.createElement("div");
    card.className = "card";
    const campi = T.segnaposto.map((ph, i) => {
      const riga = document.createElement("label");
      riga.className = "campo-numerato";
      const n = document.createElement("span");
      n.textContent = i + 1;
      const input = document.createElement("input");
      input.className = "campo";
      input.placeholder = ph;
      input.maxLength = 200;
      riga.append(n, input);
      card.append(riga);
      return input;
    });
    const btn = pulsante(T.salva);
    btn.addEventListener("click", () => {
      const cose = campi.map((c) => c.value.trim()).filter(Boolean);
      if (!cose.length) { campi[0].focus(); return; }
      aggiungiVoce({ tipo: "gratitudine", elenco: cose });
      campi.forEach((c) => { c.value = ""; });
      mostraAvviso(T.salvato);
    });
    card.append(btn);
    dove.append(card);
  }

  /* ---------- Affermazione positiva, con "Un'altra" ---------- */
  function costruisciAffermazione(dove) {
    const T = C.esercizi.affermazione;
    const card = document.createElement("div");
    card.className = "card affermazione-card";
    const p = document.createElement("p");
    p.className = "affermazione";
    let ultima = Math.floor(Math.random() * C.affermazioni.length);
    p.textContent = C.affermazioni[ultima];
    card.append(p);
    const btn = pulsante(T.altra, "pulsante-secondario");
    btn.addEventListener("click", () => {
      let nuova;
      do { nuova = Math.floor(Math.random() * C.affermazioni.length); }
      while (nuova === ultima && C.affermazioni.length > 1);
      ultima = nuova;
      p.classList.add("svanisce");
      setTimeout(() => { p.textContent = C.affermazioni[nuova]; p.classList.remove("svanisce"); }, 650);
    });
    dove.append(card, btn);
  }

  /* ---------- Lettera a te stessa: si salva nel diario ---------- */
  function costruisciLettera(dove) {
    const T = C.esercizi.lettera;
    const area = document.createElement("textarea");
    area.className = "campo lettera";
    area.value = T.segnaposto;
    area.setAttribute("aria-label", "Lettera a te stessa");
    const btn = pulsante(T.salva);
    btn.addEventListener("click", () => {
      const testoLettera = area.value.trim();
      if (!testoLettera || testoLettera === T.segnaposto.trim()) { area.focus(); return; }
      aggiungiVoce({ tipo: "lettera", testo: testoLettera });
      area.value = T.segnaposto;
      mostraAvviso(T.salvato);
    });
    dove.append(area, btn);
  }

  /* =================================================================
     3. DIARIO
     ================================================================= */
  const D = C.diario;
  let umoreScelto = null;

  // Selettore dell'umore
  const contUmori = $("#umori");
  D.umori.forEach((u, i) => {
    const b = document.createElement("button");
    b.className = "umore";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", "false");
    b.setAttribute("aria-label", u.nome);
    b.innerHTML = "<span></span><span></span>";
    b.children[0].textContent = u.emoji;
    b.children[1].textContent = u.nome;
    b.addEventListener("click", () => {
      umoreScelto = i;
      $$(".umore", contUmori).forEach((x, j) => x.setAttribute("aria-checked", String(j === i)));
    });
    contUmori.append(b);
  });
  $("#diario-nota").placeholder = D.segnapostoNota;

  // Salvataggio di una voce dell'umore (o della risposta a una riflessione)
  $("#btn-salva-diario").addEventListener("click", () => {
    const nota = $("#diario-nota").value.trim();
    if (umoreScelto === null && !(domandaInSospeso && nota)) {
      mostraAvviso(D.scegliUmore);
      return;
    }
    const voce = { tipo: domandaInSospeso ? "riflessione" : "umore", testo: nota };
    if (umoreScelto !== null) voce.umore = umoreScelto;
    if (domandaInSospeso) voce.domanda = domandaInSospeso;
    aggiungiVoce(voce);
    // Si ripulisce il modulo
    $("#diario-nota").value = "";
    umoreScelto = null;
    domandaInSospeso = null;
    $("#diario-guida").hidden = true;
    $$(".umore", contUmori).forEach((x) => x.setAttribute("aria-checked", "false"));
    mostraAvviso(D.salvato);
  });

  function leggiDiario() { return memoria.leggi(CHIAVE_DIARIO, []); }
  function scriviDiario(voci) { memoria.scrivi(CHIAVE_DIARIO, voci); }

  function aggiungiVoce(voce) {
    const voci = leggiDiario();
    voci.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), data: new Date().toISOString(), ...voce });
    scriviDiario(voci);
    disegnaDiario();
  }

  function eliminaVoce(id, elemento) {
    const voci = leggiDiario();
    const indice = voci.findIndex((v) => v.id === id);
    if (indice < 0) return;
    const [tolta] = voci.splice(indice, 1);
    scriviDiario(voci);
    elemento.classList.add("via");
    setTimeout(disegnaDiario, 450);
    mostraAvviso(D.eliminata, {
      testo: D.annulla,
      fai() {
        const ora = leggiDiario();
        ora.splice(Math.min(indice, ora.length), 0, tolta);
        scriviDiario(ora);
        disegnaDiario();
      }
    });
  }

  const formatoData = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  // Elenco delle voci: si costruisce con textContent, mai innerHTML con il testo dell'utente
  function disegnaDiario() {
    const cont = $("#voci");
    cont.innerHTML = "";
    const voci = leggiDiario();
    if (!voci.length) {
      const vuoto = document.createElement("p");
      vuoto.className = "voci-vuoto";
      vuoto.textContent = D.vuoto;
      cont.append(vuoto);
      return;
    }
    voci.forEach((v, i) => {
      const el = document.createElement("article");
      el.className = "voce";
      el.style.animationDelay = Math.min(i, 6) * 0.05 + "s";

      const testa = document.createElement("div");
      testa.className = "voce-testa";
      if (typeof v.umore === "number" && D.umori[v.umore]) {
        const em = document.createElement("span");
        em.className = "voce-umore";
        em.textContent = D.umori[v.umore].emoji;
        em.title = D.umori[v.umore].nome;
        testa.append(em);
      }
      const tipo = document.createElement("span");
      tipo.className = "voce-tipo tipo-" + v.tipo;
      tipo.textContent = D.etichette[v.tipo] || v.tipo;
      const data = document.createElement("span");
      data.className = "voce-data";
      data.textContent = formatoData.format(new Date(v.data));
      testa.append(tipo, data);
      el.append(testa);

      if (v.domanda) {
        const q = document.createElement("p");
        q.className = "voce-domanda";
        q.textContent = v.domanda;
        el.append(q);
      }
      if (v.elenco) {
        const ul = document.createElement("ul");
        ul.className = "voce-elenco";
        v.elenco.forEach((cosa) => { const li = document.createElement("li"); li.textContent = cosa; ul.append(li); });
        el.append(ul);
      }
      if (v.testo) {
        const p = document.createElement("p");
        p.className = "voce-testo";
        p.textContent = v.testo;
        el.append(p);
      }

      const elimina = document.createElement("button");
      elimina.className = "voce-elimina";
      elimina.setAttribute("aria-label", "Elimina questa voce");
      elimina.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.8h6V7m-8.5 0 .9 12.2A1.5 1.5 0 0 0 8.9 20.5h6.2a1.5 1.5 0 0 0 1.5-1.3L17.5 7M10 11v5.5M14 11v5.5"/></svg>';
      elimina.addEventListener("click", () => eliminaVoce(v.id, el));
      el.append(elimina);

      cont.append(el);
    });
  }
  disegnaDiario();

  /* =================================================================
     4. CHI SONO
     ================================================================= */
  const pres = $("#presentazione");
  C.chiSono.presentazione.forEach((par) => {
    const p = document.createElement("p");
    p.textContent = par;
    pres.append(p);
  });
  const firma = document.createElement("p");
  firma.className = "firma";
  firma.textContent = C.chiSono.firma;
  pres.append(firma);
  $("#btn-whatsapp").href = C.whatsapp;

  /* =================================================================
     GUIDA ALL'INSTALLAZIONE
     - card in home finché l'app non è installata
     - Android/Chrome: pulsante "Installa ora" con la finestra di sistema
     - iPhone: passi illustrati (Safari non ha un pulsante automatico)
     - il link …/#installa apre la guida appena si entra
     ================================================================= */
  const I = C.installa;
  const foglioInstalla = $("#foglio-installa");
  const cardInstalla = $("#card-installa");
  const eAndroid = /android/i.test(navigator.userAgent);
  let richiestaInstallazione = null; // evento beforeinstallprompt, solo Chrome/Android/desktop

  // Piccole icone disegnate, uguali a quelle che si vedono sul telefono
  const ICONE = {
    condividi: '<svg viewBox="0 0 24 24"><path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1"/></svg>',
    aggiungi: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>'
  };
  // Da testo di content.js a HTML: si protegge il testo, poi **grassetto** e {icona}
  function passoInHtml(t) {
    const sicuro = t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    return sicuro
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\{(\w+)\}/g, (_, nome) => (ICONE[nome] ? `<span class="icona-passo" aria-hidden="true">${ICONE[nome]}</span>` : ""));
  }

  function mostraPiattaforma(p) {
    $$(".scheda", foglioInstalla).forEach((s) => s.setAttribute("aria-selected", String(s.dataset.piattaforma === p)));
    const passi = $("#installa-passi");
    passi.innerHTML = "";
    I[p].passi.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = passoInHtml(t);
      passi.append(li);
    });
    $("#installa-nota").textContent = I[p].nota;
    // Il pulsante automatico c'è solo se il browser l'ha offerto (Chrome)
    $("#btn-installa-ora").hidden = !(richiestaInstallazione && p === "android");
  }
  $$(".scheda", foglioInstalla).forEach((s) => s.addEventListener("click", () => mostraPiattaforma(s.dataset.piattaforma)));

  function apriGuida() {
    if (installata) { mostraAvviso(I.giaInstallata); return; }
    if (!foglio.hidden) chiudiFoglio();
    mostraPiattaforma(eAndroid ? "android" : "iphone");
    foglioInstalla.classList.remove("chiude");
    foglioInstalla.hidden = false;
    foglioInstalla.scrollTop = 0;
    velo.hidden = false;
  }
  function chiudiGuida() {
    foglioInstalla.classList.add("chiude");
    velo.hidden = true;
    setTimeout(() => { foglioInstalla.hidden = true; }, 420);
    if (location.hash === "#installa") history.replaceState(null, "", location.pathname + location.search);
  }
  $("#btn-chiudi-installa").addEventListener("click", chiudiGuida);
  cardInstalla.addEventListener("click", apriGuida);
  $("#btn-guida-chi").addEventListener("click", apriGuida);
  if (installata) $("#btn-guida-chi").hidden = true;
  else cardInstalla.hidden = false;

  // Chrome offre l'installazione: la teniamo da parte per il pulsante "Installa ora"
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    richiestaInstallazione = e;
    if (!foglioInstalla.hidden && $('.scheda[aria-selected="true"]').dataset.piattaforma === "android") {
      $("#btn-installa-ora").hidden = false;
    }
  });
  $("#btn-installa-ora").addEventListener("click", async () => {
    if (!richiestaInstallazione) return;
    richiestaInstallazione.prompt();
    const { outcome } = await richiestaInstallazione.userChoice;
    richiestaInstallazione = null;
    $("#btn-installa-ora").hidden = true;
    if (outcome === "accepted") chiudiGuida();
  });
  window.addEventListener("appinstalled", () => {
    cardInstalla.hidden = true;
    mostraAvviso(I.installata);
  });

  // Copia del link dell'app (senza #installa), da incollare in Safari o mandare a un'amica
  $("#btn-copia-link").addEventListener("click", async () => {
    const link = location.origin + location.pathname;
    try { await navigator.clipboard.writeText(link); mostraAvviso(I.linkCopiato); }
    catch { window.prompt(I.copiaLink, link); }
  });

  // Link diretto alla guida: …/#installa
  if (location.hash === "#installa") {
    if (intro.isConnected) chiudiIntro();
    setTimeout(apriGuida, 600);
  }
  // …anche quando il link si apre con l'app già aperta (cambia solo l'ancora)
  window.addEventListener("hashchange", () => { if (location.hash === "#installa") apriGuida(); });

  /* =================================================================
     SERVICE WORKER: registrato con scope "./" (sottopercorso di GitHub Pages)
     ================================================================= */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
        .catch((errore) => console.warn("Service worker non registrato:", errore));
    });
  }
})();
