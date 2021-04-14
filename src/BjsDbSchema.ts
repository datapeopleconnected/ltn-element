import { settings } from 'cluster';
import { html, css, property } from 'lit-element';
import { LtnElement, LtnElementScope as Scope } from './LtnElement.js';
import { LtnSettingsService, ButtressSettings } from './LtnSettingsService.js';

export class BjsDbSchema extends LtnElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  // @property({ type: String, attribute: false }) endpoint = "hello";
  // private _endpoint: String = "hello";

  private __settings: ButtressSettings | null = null;
  private __schema = null;

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
    this._debug(this.__settings);

    await this.__fetchSchema();

    this._debug(`connectedCallback`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._debug(`disconnectedCallback`);
  }

  private async __fetchSchema() {
    this._verbose(this.__settings);
    if (!this.__settings) return;

    const req: RequestInfo = `${
      this.__settings.endpoint
    }/api/v1/app/schema?urq${Date.now()}&token=${this.__settings.token}`;
    const init: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(req, init);
    if (response.ok) {
      const body = await response.json();
      this.__schema = body;
      this._debug(body);
    } else {
      throw new Error(
        `Buttress Error: ${response.status}: ${response.statusText}`
      );
    }
  }

  render() {
    return html``;
  }
}
