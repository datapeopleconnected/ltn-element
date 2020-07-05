import { html, css } from 'lit-element';
import { LtnElement } from './LtnElement.js';

export class BjsDbService extends LtnElement {
  static styles = css`  
    :host {
      display: none;
    }
  `;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    this._debug(`connectedCallback`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._debug(`disconnectedCallback`);
  }

  render() {
    return html`
    `;
  }
}
