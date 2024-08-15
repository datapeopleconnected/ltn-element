/**
 * Ltn Element
 * Copyright (C) 2016-2024 Data People Connected LTD.
 * <https://www.dpc-ltd.com/>
 *
 * This file is part of Ltn Element.
 * Ltn Element is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public Licence as published by the Free Software
 * Foundation, either version 3 of the Licence, or (at your option) any later version.
 * Ltn Element is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public Licence for more details.
 * You should have received a copy of the GNU Affero General Public Licence along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { html, css } from 'lit';
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
    // this._sys(this.__services);
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
