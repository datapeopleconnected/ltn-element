import { html, css, property } from 'lit-element';
import { LtnElement } from './LtnElement.js';

import settings from './config.js';

export interface ButtressSettings {
  endpoint: RequestInfo;
  token: string;
  appId: string;
}

export class LtnSettingsService extends LtnElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  constructor() {
    super();
  }

  getButtressSettings(): ButtressSettings {
    return settings.global.buttress;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;

    this._debug(`connectedCallback`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._debug(`disconnectedCallback`);
  }

  render() {
    return html``;
  }
}
