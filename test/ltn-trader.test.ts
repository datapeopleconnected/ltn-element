/**
 * Ltn Element
 * Copyright (C) 2016-2026 Data People Connected LTD.
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

/* eslint-disable max-classes-per-file */

import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { LtnElement } from '../src/LtnElement.js';
import { LtnTrader } from '../src/LtnTrader.js';
import '../src/components/ltn-trader.js';

class TestLtnTrader extends LtnTrader {
  render() {
    return html``;
  }
}

class TraderBackedService extends LtnElement {
  render() {
    return html``;
  }
}

class TraderShadowHost extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      // eslint-disable-next-line wc/attach-shadow-constructor
      this.attachShadow({ mode: 'open' });
    }

    if (!this.shadowRoot?.querySelector('test-ltn-trader')) {
      const childTrader = document.createElement('test-ltn-trader');
      this.shadowRoot?.appendChild(childTrader);
    }
  }
}

if (!customElements.get('test-ltn-trader')) {
  customElements.define('test-ltn-trader', TestLtnTrader);
}

if (!customElements.get('trader-backed-service')) {
  customElements.define('trader-backed-service', TraderBackedService);
}

if (!customElements.get('trader-shadow-host')) {
  customElements.define('trader-shadow-host', TraderShadowHost);
}

describe('LtnTrader', () => {
  it('registers and resolves a service by type', async () => {
    const trader = await fixture<TestLtnTrader>(
      html`<test-ltn-trader scope="ROOT"></test-ltn-trader>`
    );
    const service = document.createElement(
      'trader-backed-service'
    ) as TraderBackedService;
    service.id = 'svc-a';

    trader.registerService({ name: 'main', service });

    const resolved = trader.getService(TraderBackedService);
    expect(resolved).to.equal(service);
  });

  it('resolves a named service', async () => {
    const trader = await fixture<TestLtnTrader>(
      html`<test-ltn-trader scope="ROOT"></test-ltn-trader>`
    );
    const service = document.createElement(
      'trader-backed-service'
    ) as TraderBackedService;

    trader.registerService({ name: 'main', service });

    const resolved = trader.getNamedService(TraderBackedService, 'main');
    expect(resolved).to.equal(service);
  });

  it('returns undefined when no matching service exists', async () => {
    const trader = await fixture<TestLtnTrader>(
      html`<test-ltn-trader scope="ROOT"></test-ltn-trader>`
    );

    const resolved = trader.getNamedService(TraderBackedService, 'missing');
    expect(resolved).to.equal(undefined);
  });

  it('registers the ltn-trader custom element', () => {
    expect(customElements.get('ltn-trader')).to.equal(LtnTrader);
  });

  it('falls back to parent trader across shadow boundary', async () => {
    const parent = await fixture<TestLtnTrader>(html`
      <test-ltn-trader scope="ROOT" id="parent-trader">
        <trader-shadow-host id="host"></trader-shadow-host>
      </test-ltn-trader>
    `);

    const service = document.createElement(
      'trader-backed-service'
    ) as TraderBackedService;
    parent.registerService({ name: 'main', service });

    const host = parent.querySelector('#host') as TraderShadowHost;
    const childTrader = host.shadowRoot?.querySelector(
      'test-ltn-trader'
    ) as TestLtnTrader;

    const resolved = childTrader.getService(TraderBackedService);
    expect(resolved).to.equal(service);
  });

  it('renders nothing by default for the base ltn-trader element', async () => {
    const trader = await fixture<LtnTrader>(
      html`<ltn-trader scope="ROOT"></ltn-trader>`
    );
    expect(trader.shadowRoot?.querySelectorAll('*:not(style)').length).to.equal(
      0
    );
  });
});
