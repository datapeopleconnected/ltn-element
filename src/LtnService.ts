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
