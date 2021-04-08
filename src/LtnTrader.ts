import { html, css } from 'lit-element';
import { LtnElement } from './LtnElement.js';

export interface LtnTraderService {
  name: string;
  service: LtnElement;
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

  getNamedService<T extends LtnElement>(
    Type: new () => T,
    serviceName: string
  ): T | null {
    return this.getService(Type, serviceName);
  }

  getService<T extends LtnElement>(
    Type: new () => T,
    serviceName = ''
  ): T | null {
    let service: T | null = this.__findService(Type, serviceName);
    // this._debug(this.__services);
    while (service === null) {
      const trader: LtnTrader | null = this._findParentTrader();
      if (trader === null) break;
      service = trader.__findService(Type, serviceName);
    }

    return service;
  }

  private __findService<T extends LtnElement>(
    Type: new () => T,
    serviceName: string
  ): T | null {
    const services: T[] = this.__services
      .filter(s => serviceName === '' || s.name === serviceName)
      .map(s => s.service._queryService(Type))
      .filter(s => s) as T[];

    if (services.length > 0) return services[0];
    return null;
  }

  private _findParentTrader(): LtnTrader | null {
    let parent: Node | null = this.parentNode;
    let result: LtnTrader | null = null;

    while (parent !== null) {
      if (parent instanceof LtnTrader) {
        result = parent as LtnTrader;
        break;
      }

      if (parent instanceof ShadowRoot) {
        parent = (parent as ShadowRoot).host;
      } else {
        parent = parent.parentNode;
      }
    }

    return result;
  }

  render() {
    return html``;
  }
}
