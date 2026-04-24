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