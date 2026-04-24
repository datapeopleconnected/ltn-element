import { aTimeout, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { LtnElement, LtnElementScope } from '../src/LtnElement.js';

class TestLtnElement extends LtnElement {
  query<T extends LtnElement>(
    Type: new () => T,
    scope: LtnElementScope = LtnElementScope.AGGREGATE,
    name = ''
  ) {
    return this._queryService(Type, scope, name);
  }

  rootRef() {
    return this._root;
  }

  addTrader(trader: { getService<T extends LtnElement>(Type: new () => T): T | undefined }) {
    this._traderStack.push(trader);
  }

  getFromTraderStack<T extends LtnElement>(Type: new () => T) {
    return this._getService(Type);
  }

  emitError(...args: unknown[]) {
    this._error(...args);
  }

  emitWarn(...args: unknown[]) {
    this._warn(...args);
  }

  emitInfo(...args: unknown[]) {
    this._info(...args);
  }

  emitDebug(...args: unknown[]) {
    this._debug(...args);
  }

  emitSys(...args: unknown[]) {
    this._sys(...args);
  }

  render() {
    return html``;
  }
}

class QueryRootElement extends TestLtnElement {
  render() {
    return html`
      <test-ltn-element id="skip" scope="AGGREGATE"></test-ltn-element>
      <span>skip-non-element-node</span>
      <test-ltn-element id="target"></test-ltn-element>
      <test-ltn-element id="extra"></test-ltn-element>
    `;
  }
}

class ShadowHostElement extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    if (!this.shadowRoot?.querySelector('#shadow-child')) {
      const child = document.createElement('test-ltn-element');
      child.id = 'shadow-child';
      this.shadowRoot?.appendChild(child);
    }
  }
}

if (!customElements.get('test-ltn-element')) {
  customElements.define('test-ltn-element', TestLtnElement);
}

if (!customElements.get('query-root-element')) {
  customElements.define('query-root-element', QueryRootElement);
}

if (!customElements.get('shadow-host-element')) {
  customElements.define('shadow-host-element', ShadowHostElement);
}

describe('LtnElement', () => {
  it('sets itself as root when scope is ROOT', async () => {
    const el = await fixture<TestLtnElement>(
      html`<test-ltn-element scope="ROOT"></test-ltn-element>`
    );

    expect(el.rootRef()).to.equal(el);
  });

  it('throws if a non-root element has no ROOT ancestor', () => {
    const el = document.createElement('test-ltn-element') as TestLtnElement;

    expect(() => el.connectedCallback()).to.throw('Missing root element');
  });

  it('can resolve itself by type and id', async () => {
    const el = await fixture<TestLtnElement>(
      html`<test-ltn-element scope="ROOT" id="self"></test-ltn-element>`
    );

    const service = el.query(TestLtnElement, LtnElementScope.AGGREGATE, 'self');
    expect(service).to.equal(el);
  });

  it('resolves immediate parent in AGGREGATE scope', async () => {
    const root = await fixture<TestLtnElement>(html`
      <test-ltn-element scope="ROOT" id="root">
        <test-ltn-element id="parent">
          <test-ltn-element id="child"></test-ltn-element>
        </test-ltn-element>
      </test-ltn-element>
    `);

    const child = root.querySelector('#child') as TestLtnElement;
    const parent = root.querySelector('#parent') as TestLtnElement;

    const service = child.query(TestLtnElement, LtnElementScope.AGGREGATE, 'parent');
    expect(service).to.equal(parent);
  });

  it('queries shadow-root children and respects scope filtering', async () => {
    const root = await fixture<QueryRootElement>(
      html`<query-root-element scope="ROOT"></query-root-element>`
    );

    const service = root.query(TestLtnElement, LtnElementScope.CHILD, 'target');
    const target = root.shadowRoot?.querySelector('#target');
    expect(service).to.equal(target);
  });

  it('finds aggregate parent through a ShadowRoot boundary', async () => {
    const root = await fixture<TestLtnElement>(html`
      <test-ltn-element scope="ROOT" id="root">
        <shadow-host-element id="host"></shadow-host-element>
      </test-ltn-element>
    `);

    await aTimeout(0);
    const host = root.querySelector('#host') as ShadowHostElement;
    const shadowChild = host.shadowRoot?.querySelector('#shadow-child') as TestLtnElement;

    const service = shadowChild.query(TestLtnElement, LtnElementScope.AGGREGATE, 'root');
    expect(service).to.equal(root);
    expect(shadowChild.rootRef()).to.equal(root);
  });

  it('resolves service from ancestor trader stack across shadow boundary', async () => {
    const root = await fixture<TestLtnElement>(html`
      <test-ltn-element scope="ROOT" id="root">
        <shadow-host-element id="host"></shadow-host-element>
      </test-ltn-element>
    `);

    await aTimeout(0);
    const host = root.querySelector('#host') as ShadowHostElement;
    const shadowChild = host.shadowRoot?.querySelector('#shadow-child') as TestLtnElement;
    const service = document.createElement('test-ltn-element') as TestLtnElement;

    const traderWith = (result?: TestLtnElement) => ({
      getService: <T extends LtnElement>(_Type: new () => T) => result as unknown as T | undefined,
    });

    root.addTrader(traderWith(undefined));
    root.addTrader(traderWith(service));
    root.addTrader(traderWith(root));

    const resolved = shadowChild.getFromTraderStack(TestLtnElement);
    expect(resolved).to.equal(service);
  });

  it('applies log-label and log-disable attributes', async () => {
    const el = await fixture<TestLtnElement>(
      html`<test-ltn-element scope="ROOT" log-label="MyLabel" log-disable></test-ltn-element>`
    );

    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = () => {
      warnCalled = true;
    };

    try {
      el.emitWarn('message');
      expect(warnCalled).to.equal(false);
    } finally {
      console.warn = originalWarn;
    }
  });

  it('routes protected logger wrappers to logger methods', async () => {
    const el = await fixture<TestLtnElement>(
      html`<test-ltn-element scope="ROOT" .logLevel=${'sys'} log-label="MixedCase"></test-ltn-element>`
    );

    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    const errors: unknown[][] = [];
    const warns: unknown[][] = [];
    const infos: unknown[][] = [];
    const debugs: unknown[][] = [];

    console.error = (...args: unknown[]) => {
      errors.push(args);
    };
    console.warn = (...args: unknown[]) => {
      warns.push(args);
    };
    console.info = (...args: unknown[]) => {
      infos.push(args);
    };
    console.debug = (...args: unknown[]) => {
      debugs.push(args);
    };

    try {
      el.emitError('e');
      el.emitWarn('w');
      el.emitInfo('i');
      el.emitDebug('d');
      el.emitSys('s');

      expect(errors.length).to.equal(1);
      expect(warns.length).to.equal(1);
      expect(infos.length).to.equal(1);
      expect(debugs.length).to.be.greaterThan(1);
      expect(warns[0][1]).to.equal('[mixedcase]');
    } finally {
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      console.debug = originalDebug;
    }
  });
});
