import { html, css, property } from 'lit-element';
import {
  LtnElement,
  LtnElementScope as Scope,
  LtnElementScope,
} from './LtnElement.js';
import { openWcLogo } from './open-wc-logo.js';

import './bjs-db-service.js';
import './ltn-trader.js';
import './ltn-settings-service.js';

import { BjsDbService } from './BjsDbService.js';
import { LtnTrader } from './LtnTrader.js';
import { LtnSettingsService } from './LtnSettingsService.js';

export class LtnTestTs extends LtnElement {
  @property({ type: String }) page = 'main';
  @property({ type: String }) title = '';
  @property({ type: Object, attribute: false }) Scope = Scope;

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }

    @use {
    }

    main {
      flex-grow: 1;
    }

    .logo > svg {
      margin-top: 36px;
      animation: app-logo-spin infinite 5s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }

    mwc-top-app-bar {
      --mdc-theme-primary: orange;
      --mdc-theme-on-primary: black;
    }
  `;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;

    const trader: LtnTrader | null = this._queryService(LtnTrader);
    if (trader !== null) {
      this._traderStack.push(trader);
    }

    const settingsService: LtnSettingsService | null = this._queryService(
      LtnSettingsService,
      LtnElementScope.CHILD
    );
    this._debug('register with trader', settingsService);
    if (settingsService) {
      trader?.registerService({
        name: 'settings',
        service: settingsService,
      });
    }

    const dbService: BjsDbService | null = this._queryService(BjsDbService);
    this._debug('register with trader', dbService);
    if (dbService) {
      trader?.registerService({
        name: 'db',
        service: dbService,
      });
    }

    this._debug('connectedCallback');
  }

  render() {
    return html`
      <ltn-trader scope="${Scope.AGGREGATE}" log-level=""></ltn-trader>
      <ltn-settings-service log-level="verbose"></ltn-settings-service>
      <bjs-db-service
        scope="${Scope.AGGREGATE}"
        log-level="verbose"
      ></bjs-db-service>

      <main>
        <div class="logo">${openWcLogo}</div>
        <h1>The APP</h1>

        <p>Edit <code>src/LtnTestTs.js</code> and save to reload.</p>
        <a
          class="app-link"
          href="https://open-wc.org/developing/#code-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code examples
        </a>
      </main>
      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
