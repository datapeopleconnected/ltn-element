import { html, css, property } from 'lit-element';
import { LtnElement, LtnElementScope as Scope } from './LtnElement.js';
import { LtnSettingsService, ButtressSettings } from './LtnSettingsService.js';
import './bjs-db-schema.js';

export class BjsDbService extends LtnElement {
  static styles = css`
    :host {
      display: none;
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

    this._debug(`connectedCallback`, this.__settings);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._debug(`disconnectedCallback`);
  }

  render() {
    return html`
      <bjs-db-schema
        scope="${Scope.AGGREGATE}"
        log-level="verbose"
      ></bjs-db-schema>
    `;
  }
}
