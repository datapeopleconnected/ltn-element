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

import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { LtnService } from '../src/LtnService.js';

class TestLtnService extends LtnService {
  render() {
    return html``;
  }
}

if (!customElements.get('test-ltn-service')) {
  customElements.define('test-ltn-service', TestLtnService);
}

describe('LtnService', () => {
  it('subscribes and receives dispatched details', async () => {
    const service = await fixture<TestLtnService>(
      html`<test-ltn-service scope="ROOT"></test-ltn-service>`
    );

    let payload: unknown;
    service.eventSubscribe('service-event', (detail: unknown) => {
      payload = detail;
    });

    service.dispatchCustomEvent('service-event', {
      detail: { ok: true },
      bubbles: true,
      composed: true,
    });

    expect(payload).to.deep.equal({ ok: true });
  });

  it('unsubscribes from events', async () => {
    const service = await fixture<TestLtnService>(
      html`<test-ltn-service scope="ROOT"></test-ltn-service>`
    );

    let callCount = 0;
    const subId = service.eventSubscribe('service-event', () => {
      callCount += 1;
    });

    service.dispatchCustomEvent('service-event', { detail: {} });
    service.eventUnsubscribe(subId);
    service.dispatchCustomEvent('service-event', { detail: {} });

    expect(callCount).to.equal(1);
  });

  it('dispatches a DOM CustomEvent', async () => {
    const service = await fixture<TestLtnService>(
      html`<test-ltn-service scope="ROOT"></test-ltn-service>`
    );

    const eventPromise = oneEvent(service, 'service-event');
    service.dispatchCustomEvent('service-event', {
      detail: { id: 42 },
      bubbles: true,
      composed: true,
    });

    const event = (await eventPromise) as CustomEvent;
    expect(event.detail).to.deep.equal({ id: 42 });
  });
});
