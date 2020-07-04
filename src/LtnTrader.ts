import { html, css } from 'lit-element';
import { LtnElement } from './LtnElement.js';
// import { LtnLogLevel } from './LtnLogger.js';

export interface LtnTraderService {
  name: string;
  service: LtnElement;
}

export interface LtnTraderRequestCallback {
  (service: LtnTrader): void;
}
export interface LtnTraderRequest {
  stack: LtnTrader[];
  callback: LtnTraderRequestCallback;
}

export class LtnTrader extends LtnElement {
  private __services: Array<LtnTraderService>;

  static styles = css`
    :host {
      display: none;
    }
  `;

  constructor() {
    super();
    // this._logLevel = LtnLogLevel.DEBUG;
    this.__services = new Array<LtnTraderService>();
  }

  connectedCallback() {
    super.connectedCallback();
    this._debug(`connectedCallback`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._debug(`disconnectedCallback`);
  }

  registerService(service: LtnTraderService) {
    this.__services.push(service);
  }

  getNamedService<T extends LtnElement>(Type: new  () => T, serviceName: string): T | null {
    let services: T[] = this.__services
      .filter(s => s.name === serviceName)
      .map(s => s.service._queryService(Type))
      .filter(s => s) as T[];

    while (!services) {
      const trader: LtnTrader | null = this._queryParentService(LtnTrader);
      if (trader === null) break;
      services = this.__services
        .filter(s => s.name === serviceName)
        .map(s => s.service._queryService(Type))
        .filter(s => s) as T[];
    }

    return services.length > 0 ? services[0] : null;
  }

  getService<T extends LtnElement>(Type: new () => T): T | null {
    let services: T[] = this.__services
      .map(s => s.service._queryService(Type))
      .filter(s => s) as T[];

    while (!services) {
      const trader: LtnTrader | null = this._queryParentService(LtnTrader);
      if (trader === null) break;
      services = this.__services
        .map(s => s.service._queryService(Type))
        .filter(s => s) as T[];
    }

    return services.length > 0 ? services[0] : null;
  }

  render() {
    return html`
    `;
  }
}
