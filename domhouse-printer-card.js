console.info("%c 🖨️ DOMHOUSE PRINTER CARD v1.4.0 (TOP-RIGHT BELL FIX) IS LOADED ", "color: white; background: #00d1ff; font-weight: bold; border: 1px solid white; padding: 2px 6px; border-radius: 4px;");

const LitElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// =============================================================================
//  CARD: STAMPANTE (domhouse-printer-card)
// =============================================================================
class DomHousePrinterCard extends LitElement {
  static get properties() { return { _config: {}, hass: {} }; }
  static getConfigElement() { return document.createElement("domhouse-printer-card-editor"); }

  static getStubConfig() {
    return {
      name: "Canon TS6500i",
      theme_mode: "default"
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Configurazione non valida");
    this._config = config;
  }

  getSensorState(entityId, fallback = null) {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallback;
    return this.hass.states[entityId].state;
  }

  _toggleAutomation() {
    if (!this._config.automation_entity || !this.hass) return;
    this.hass.callService("automation", "toggle", {
      entity_id: this._config.automation_entity
    });
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const name = this._config.name || "Stampante";
    const themeMode = this._config.theme_mode || "default";
    const cardClass = themeMode === "dark" ? "force-dark" : "theme-default";

    // --- COSTRUZIONE DINAMICA DELLA GRIGLIA (RESTITUITA ESATTAMENTE ALLA V1.2.1) ---
    let gridAreas = `"i n"`;

    // --- STATO STAMPANTE (Opzionale) ---
    const printerRaw = this.getSensorState(this._config.entity_printer, null);
    let statusHtml = html``;
    let iconColor = "var(--disabled-text-color, grey)";
    let icon = "mdi:printer-off";
    let animClass = "";

    if (this._config.entity_printer) {
      gridAreas += ` "status status"`;
      let translatedState = printerRaw;

      if (printerRaw === "idle") {
        iconColor = "var(--success-color, green)";
        icon = "mdi:printer";
        translatedState = "In Attesa";
      } else if (printerRaw === "printing") {
        iconColor = "var(--info-color, blue)";
        icon = "mdi:printer-eye";
        animClass = "blink";
        translatedState = "In Stampa";
      } else if (printerRaw === "unavailable") {
        translatedState = "Non Disponibile";
      } else if (printerRaw === "unknown") {
        translatedState = "Sconosciuto";
      }

      statusHtml = html`<div class="status-area">${translatedState}</div>`;
    } else {
      // Se non c'è il sensore, mostriamo un'icona di default accesa per estetica
      icon = "mdi:printer";
      iconColor = "var(--primary-text-color)";
    }

    // --- TONER NERO ---
    const blackRaw = this.getSensorState(this._config.entity_black, null);
    let blackHtml = html``;
    if (this._config.entity_black) {
      gridAreas += ` "black black"`;
      const blackLvl = parseFloat(blackRaw) || 0;
      const bColor = blackLvl < 10 ? 'var(--error-color, red)' : 'var(--primary-text-color, black)';
      blackHtml = html`
        <div class="black-area">
          <div class="ink-row">
            <span>Nero</span><span>${blackLvl}%</span>
          </div>
          <div class="ink-bg">
            <div class="ink-bar" style="background: ${bColor}; width: ${blackLvl}%;"></div>
          </div>
        </div>
      `;
    }

    // --- TONER COLORE (Opzionale) ---
    const colorRaw = this.getSensorState(this._config.entity_color, null);
    let colorHtml = html``;
    if (this._config.entity_color) {
      gridAreas += ` "color color"`;
      const colorLvl = parseFloat(colorRaw) || 0;
      const cColor = colorLvl < 10 ? 'var(--error-color, red)' : 'linear-gradient(to right, cyan, magenta, yellow)';
      colorHtml = html`
        <div class="color-area">
          <div class="ink-row">
            <span>Colore</span><span>${colorLvl}%</span>
          </div>
          <div class="ink-bg">
            <div class="ink-bar" style="background: ${cColor}; width: ${colorLvl}%;"></div>
          </div>
        </div>
      `;
    }

    // --- UPTIME (RESTITUITO ALLA VERSIONE v1.2.1) ---
    const uptimeRaw = this.getSensorState(this._config.entity_uptime, null);
    let uptimeHtml = html``;
    if (this._config.entity_uptime) {
      gridAreas += ` "uptime uptime"`;
      let uptimeText = uptimeRaw;
      if (uptimeRaw && uptimeRaw !== 'unavailable' && uptimeRaw !== 'unknown') {
        let d = new Date(uptimeRaw);
        if (!isNaN(d.getTime())) {
          const pad = (n) => String(n).padStart(2, '0');
          uptimeText = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        }
      } else {
        uptimeText = "Non disponibile";
      }
      uptimeHtml = html`
        <div class="uptime-area">
          <ha-icon icon="mdi:clock-outline"></ha-icon> <span>Attiva dal: ${uptimeText}</span>
        </div>
      `;
    }

    // --- CAMPANELLA AUTOMAZIONE IN ALTO A DESTRA ---
    let bellHtml = html``;
    if (this._config.automation_entity) {
      const automationState = this.getSensorState(this._config.automation_entity, null);
      let switchIcon = "mdi:bell-alert";
      let switchColor = "#ff4444";

      if (automationState) {
          const isAutomationOn = automationState === "on";
          switchIcon = isAutomationOn ? "mdi:bell-ring" : "mdi:bell-off";
          switchColor = isAutomationOn ? "#FFD700" : "#9E9E9E";
      }
      
      bellHtml = html`
        <div class="switch-area">
           <ha-icon-button @click="${(e) => { e.stopPropagation(); this._toggleAutomation(); }}">
              <ha-icon icon="${switchIcon}" style="color: ${switchColor};"></ha-icon>
           </ha-icon-button>
        </div>
      `;
    }

    return html`
      <ha-card class="${cardClass}">
        <div class="custom-grid" style="grid-template-areas: ${gridAreas};">
          <div class="icon-area">
            <ha-icon icon="${icon}" style="color: ${iconColor};" class="${animClass}"></ha-icon>
          </div>
          <div class="name-area">${name}</div>
          ${statusHtml}
          ${blackHtml}
          ${colorHtml}
          ${uptimeHtml}
        </div>
        ${bellHtml}
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; font-family: var(--primary-font-family, sans-serif); }
      ha-card { position: relative; border-radius: 15px; padding: 16px; background: var(--ha-card-background, var(--card-background-color)); box-sizing: border-box; }

      /* TEMA SCURO FORZATO */
      ha-card.force-dark {
        background: linear-gradient(145deg, #1a1a1a, #282828);
        color: white;
        --primary-text-color: #ffffff;
        --secondary-text-color: #aaaaaa;
        --secondary-background-color: rgba(255,255,255,0.1);
      }

      /* GRIGLIA ALLINEATA ESATTAMENTE COME NELLA VERSIONE 1.2.1 */
      .custom-grid {
        display: grid;
        grid-template-columns: 45px 1fr; /* Colonna fissa per l'icona, il resto al testo */
        column-gap: 12px; /* Spazio elegante tra icona e titolo */
        grid-template-rows: auto auto auto auto auto;
        align-items: center;
      }

      .icon-area { grid-area: i; display: flex; justify-content: center; align-items: center; }
      .icon-area ha-icon { --mdc-icon-size: 34px; }

      .name-area {
        grid-area: n;
        justify-self: start;
        font-weight: 800; /* Grassetto marcato per allineamento ottico */
        font-size: 22px;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        margin-top: 2px;
      }

      .status-area { grid-area: status; justify-self: start; font-size: 14px; color: var(--secondary-text-color); margin-top: 4px; }

      .black-area { grid-area: black; padding-top: 10px; width: 100%; }
      .color-area { grid-area: color; padding-top: 5px; width: 100%; }

      /* AREA UPTIME RIPRISTINATA (1.2.1) */
      .uptime-area { grid-area: uptime; padding-top: 12px; font-size: 11px; color: var(--secondary-text-color); justify-self: start; display: flex; align-items: center; gap: 6px; }
      .uptime-area ha-icon { --mdc-icon-size: 16px; color: var(--secondary-text-color); display: flex; }

      /* POSIZIONAMENTO ASSOLUTO DELLA CAMPANELLA IN ALTO A DESTRA */
      .switch-area {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
      }
      .switch-area ha-icon-button {
         --mdc-icon-button-size: 38px;
      }

      /* STILI BARRE INCHIOSTRO */
      .ink-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px; color: var(--primary-text-color); }
      .ink-bg { background: var(--secondary-background-color, #e0e0e0); border-radius: 5px; height: 8px; width: 100%; overflow: hidden;}
      .ink-bar { height: 8px; border-radius: 5px; transition: width 0.3s ease; }

      /* ANIMAZIONE STAMPA */
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      .blink { animation: blink 2s ease-in-out infinite; }
    `;
  }
}
customElements.define("domhouse-printer-card", DomHousePrinterCard);

// =============================================================================
//  EDITOR DELLA CARD
// =============================================================================
class DomHousePrinterCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = config; }

  // FUNZIONE PER IL TASTO SVUOTA (REPLICATO DALLA WEATHER CARD)
  _renderClearableSelector({ selector, value, configValue, label, style }) {
    const currentValue = value || "";
    return html`
      <div class="entity-row" style=${style || ""}>
        <ha-selector
          .hass=${this.hass}
          .selector=${selector}
          .value=${currentValue}
          .configValue=${configValue}
          .label=${label}
          @value-changed=${this._valueChanged}
        ></ha-selector>
        <ha-icon-button
          class="clear-btn"
          title="Svuota"
          .disabled=${!currentValue}
          @click=${(ev) => {
            ev.stopPropagation();
            this._setConfigValue(configValue, "");
          }}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  _setConfigValue(configValue, newValue) {
    if (!this._config || !this.hass) return;
    if (!configValue) return;

    if (this._config[configValue] === newValue) return;

    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) {
      delete newConfig[configValue];
    } else {
      newConfig[configValue] = newValue;
    }

    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;

    let newValue = ev.detail && ev.detail.value !== undefined ? ev.detail.value : target.value;
    this._setConfigValue(configValue, newValue);
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <div class="vertical-inputs">
            <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${this._config.name !== undefined ? this._config.name : 'Stampante'}
                .configValue=${"name"}
                .label=${"Nome Stampante"}
                @value-changed=${this._valueChanged}>
            </ha-selector>

            <ha-selector .hass=${this.hass} .selector=${{ select: { options: [{value: "default", label: "Segui Tema Home Assistant"}, {value: "dark", label: "Tema Scuro Fisso"}] } }} .value=${this._config.theme_mode || 'default'} .configValue=${"theme_mode"} .label=${"Stile Sfondo Card"} @value-changed=${this._valueChanged}></ha-selector>
        </div>

        <div class="sensor-group">
          <h4>🔔 Automazione Notifiche (Opzionale)</h4>
          <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 0;">Seleziona l'automazione per il fine inchiostro. La campanella apparirà in alto a destra.</p>
          <div class="vertical-inputs">
            ${this._renderClearableSelector({
                selector: { entity: { domain: "automation" } },
                value: this._config.automation_entity,
                configValue: "automation_entity",
                label: "Automazione Fine Inchiostro"
            })}
          </div>
        </div>

        <div class="sensor-group">
          <h4>🖨️ Entità Principali</h4>
          <div class="vertical-inputs">
            ${this._renderClearableSelector({
                selector: { entity: { domain: ["sensor"] } },
                value: this._config.entity_printer,
                configValue: "entity_printer",
                label: "Sensore Stato Stampante (Opzionale)"
            })}
            ${this._renderClearableSelector({
                selector: { entity: { domain: ["sensor"] } },
                value: this._config.entity_uptime,
                configValue: "entity_uptime",
                label: "Sensore Tempo di Attività (Opzionale)"
            })}
          </div>
        </div>

        <div class="sensor-group">
          <h4>🎨 Livelli Inchiostro/Toner</h4>
          <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 0;">Nota: Lascia vuoto il sensore colore se la tua stampante è monocromatica.</p>
          <div class="vertical-inputs">
            ${this._renderClearableSelector({
                selector: { entity: { domain: ["sensor"] } },
                value: this._config.entity_black,
                configValue: "entity_black",
                label: "Sensore Toner Nero (%)"
            })}
            ${this._renderClearableSelector({
                selector: { entity: { domain: ["sensor"] } },
                value: this._config.entity_color,
                configValue: "entity_color",
                label: "Sensore Toner Colore (%) - OPZIONALE"
            })}
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid var(--divider-color); text-align: center; opacity: 0.7; font-size: 0.9em;">
            Powered by <a href="https://www.domhouse.it" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">DomHouse.it</a>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config { padding: 10px; }
      h4 { margin-bottom: 10px; margin-top: 0; padding-bottom: 5px; color: var(--primary-text-color); }
      .sensor-group { background: var(--secondary-background-color); padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid var(--divider-color); }
      .vertical-inputs { display: flex; flex-direction: column; gap: 12px; width: 100%; }
      ha-selector { width: 100%; display: block; min-width: 0; }

      /* LAYOUT PULSANTE SVUOTA */
      .entity-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 4px;
        align-items: center;
        min-width: 0;
      }

      .clear-btn {
        color: var(--secondary-text-color, #888);
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        z-index: 2;
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        --mdc-icon-button-ink-color: var(--secondary-text-color);
        --mdc-icon-button-disabled-ink-color: var(--disabled-text-color);
      }
      .clear-btn:hover {
        color: var(--primary-text-color, #fff);
        --mdc-icon-button-ink-color: var(--primary-text-color);
      }
      .clear-btn ha-icon {
        color: inherit;
        opacity: 1;
      }
    `;
  }
}
customElements.define("domhouse-printer-card-editor", DomHousePrinterCardEditor);

// =============================================================================
//  REGISTRAZIONE UI HOME ASSISTANT
// =============================================================================
window.customCards = window.customCards || [];
window.customCards.push({
  type: "domhouse-printer-card",
  name: "DomHouse Printer Card",
  description: "Card con grid layout per il monitoraggio della stampante.",
  preview: true,
});