import { html, css, property } from 'lit-element';
import { LtnElement } from './LtnElement.js';
import { LtnSettingsService, ButtressSettings } from './LtnSettingsService.js';

export class BjsDbService extends LtnElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  // @property({ type: String, attribute: false }) endpoint = "hello";
  // private _endpoint: String = "hello";

  private __settings: ButtressSettings | null = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;

    const settingsService: LtnSettingsService | null = this._getService(
      LtnSettingsService
    );
    this.__settings = settingsService
      ? settingsService.getButtressSettings()
      : null;
    this._verbose(this.__settings);

    if (this.__settings) {
      const response = await fetch(this.__settings.endpoint);
      const body = await response.json();
      this._verbose(body);
    }

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
