import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LtnElement } from './LtnElement.js';

export interface LtnTraderService {
  name: string;
  service: LtnElement;
}

@customElement('ltn-trader')
export class LtnTrader extends LtnElement {
  private __services: Array<LtnTraderService>;

  static styles = css`
    :host {
      display: none;
    }
  `;

  constructor() {
    super();
    this.__services = [];
  }

  registerService(service: LtnTraderService) {
    this.__services.push(service);
  }

  getNamedService<T extends LtnElement>(
    Type: new () => T,
    serviceName: string
  ): T | undefined {
    return this.getService(Type, serviceName);
  }

  getService<T extends LtnElement>(
    Type: new () => T,
    serviceName = ''
  ): T | undefined {
    let service = this.__findService(Type, serviceName);
    // this._debug(this.__services);
    while (service === undefined) {
      const trader = this._findParentTrader();
      if (trader === undefined) break;
      service = trader.__findService(Type, serviceName);
    }

    return service;
  }

  private __findService<T extends LtnElement>(
    Type: new () => T,
    serviceName: string
  ): T | undefined {
    const services: T[] = this.__services
      .filter(s => serviceName === '' || s.name === serviceName)
      .map(s => s.service._queryService(Type))
      .filter(s => s) as T[];

    if (services.length > 0) return services[0];
    return undefined;
  }

  private _findParentTrader(): LtnTrader | undefined {
    let parent: Node | null = this.parentNode;
    let result: LtnTrader | undefined;

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
