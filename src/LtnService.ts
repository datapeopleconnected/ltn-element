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

import { v4 } from 'uuid';

import { LtnElement } from './LtnElement.js';

export interface LtnTraderService {
  name: string;
  service: LtnElement;
}

export class LtnService extends LtnElement {

  protected _subscriptions: {[index: string]: {event: string, cb: Function}} = {};

  // eslint-disable-next-line class-methods-use-this
  static generateId(): string {
    return v4();
  }

  eventSubscribe(event: string, cb: Function) {
    const id = LtnService.generateId();
    this._subscriptions[id] = {event, cb};
    return id;
  }

  eventUnsubscribe(id: string): void {
    if (this._subscriptions[id]) delete this._subscriptions[id];
  }

  // eslint-disable-next-line no-undef
  dispatchCustomEvent(eventName: string, options: CustomEventInit) {
    this.dispatchEvent(new CustomEvent(eventName, options));

    Object.values(this._subscriptions)
      .filter((sub) => sub.event === eventName)
      .forEach((sub) => sub.cb(options.detail));
  }
}
