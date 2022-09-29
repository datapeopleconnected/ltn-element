import { LtnElement } from './LtnElement.js';

export interface LtnTraderService {
  name: string;
  service: LtnElement;
}

export class LtnService extends LtnElement {
  connectedCallback() {
    super.connectedCallback();
    this._debug(`connectedCallback`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._debug(`disconnectedCallback`);
  }

  get(path: string): any {
    const parts = path.toString().split('.');
    let prop: any = this;
    // Loop over path parts[0..n-1] and dereference
    for (let i=0; i < parts.length; i += 1) {
      if (!prop) return undefined;
      const part = parts[i];
      prop = prop[part];
    }
    return prop;
  }

  set(path: string, value: any): string|undefined {
    const parts = path.toString().split('.');
    let prop: any = this;
    const last: any = parts[parts.length-1];
    if (parts.length > 1) {
      // Loop over path parts[0..n-2] and dereference
      for (let i=0; i < parts.length; i += 1) {
        const part = parts[i];
        prop = prop[part];
        if (!prop) return undefined;
      }
      // Set value to object at end of path
      prop[last] = value;
    } else {
      // Simple property set
      prop[path] = value;
    }

    return parts.join('.');
  }

  // push(path, ...items) {
  //   let info = {path: ''};
  //   let array = /** @type {Array}*/(get(this, path, info));
  //   let len = array.length;
  //   let ret = array.push(...items);
  //   if (items.length) {
  //     notifySplice(this, array, info.path, len, items.length, []);
  //   }
  //   return ret;
  // }

  subscribe(path: string, cb: Function) {
    console.log('subscribe', path);

    setTimeout(() => cb(), 1000);
  }

  unsubscribe() {
    
  }
}
