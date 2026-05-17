# 🖨️ DomHouse Printer Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/SalvatoreITA/domhouse-printer-card?style=flat-analytics)](https://github.com/SalvatoreITA/domhouse-printer-card)
[![License](https://img.shields.io/github/license/SalvatoreITA/domhouse-printer-card)](LICENSE)

Una card Lovelace per Home Assistant minimale, elegante e completamente responsiva per monitorare lo stato della tua stampante e i livelli di inchiostro o toner (nero e colore). Progettata seguendo la filosofia di **DomHouse.it**.

L'editor grafico è totalmente aggiornato e compatibile con le ultime versioni di Home Assistant (utilizza i nuovi `ha-selector` con tasto di svuotamento "X" integrato) ed è progettato per evitare overflow ed errori di layout.

---

## 📸 Screenshot

| Tema Chiaro / Default | Tema Scuro Forzato |
|---|---|
| *Aggiungi qui il link allo screenshot chiaro* | *Aggiungi qui il link allo screenshot scuro* |

---

## ✨ Caratteristiche

* **Allineamento Perfetto**: Layout della griglia ottimizzato per un perfetto allineamento ottico tra l'icona della stampante e il nome (stile button card).
* **Stati Dinamici**: Icona e testi cambiano in base allo stato della stampante (*In Attesa*, *In Stampa* con animazione lampeggiante, *Non Disponibile*, ecc.).
* **Barre d'Inchiostro Grafiche**: Barre progressive per il Toner Nero ed un gradiente multicolore per il Toner a Colori (opzionale, ideale anche per stampanti monocromatiche).
* **Riquadro Uptime**: Visualizzazione pulita e formattata della data e ora di attività della stampante, con gestione intelligente delle icone senza sovrapposizioni.
* **Editor Visivo Completo**: Interfaccia di configurazione intuitiva che supporta la rimozione rapida dei sensori opzionali tramite tasto "X" (Svuota).
* **Tema Scuro Statico**: Possibilità di forzare lo sfondo scuro sfumato indipendentemente dal tema globale di Home Assistant.

---

## 🚀 Installazione

### Metodo 1: Tramite HACS (Consigliato)
1. Apri **HACS** nella tua istanza di Home Assistant.
2. Clicca sui tre puntini in alto a destra e seleziona **Repository personalizzati** (Custom Repositories).
3. Incolla l'URL della repository di questo progetto: `https://github.com/TUO-USERNAME/domhouse-printer-card`
4. Seleziona **Lovelace** come categoria e clicca su **Aggiungi**.
5. Cerca `DomHouse Printer Card` all'interno di HACS e clicca su **Scarica**.
6. Svuota la cache del browser.

### Metodo 2: Installazione Manuale
1. Scarica il file `domhouse-printer-card.js`.
2. Caricalo all'interno della cartella `config/www/` della tua istanza di Home Assistant.
3. Vai su **Impostazioni** -> **Plance** -> **Tre puntini in alto a destra** -> **Risorse**.
4. Clicca su **Aggiungi risorsa**, inserisci `/local/domhouse-printer-card.js` e seleziona **Modulo JavaScript**.

---

## ⚙️ Configurazione Lovelace (YAML)

Puoi configurare la card interamente tramite l'interfaccia grafica (Visual Editor), oppure puoi usare la modalità YAML. Ecco un esempio completo di configurazione:
