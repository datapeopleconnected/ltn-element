import { LitElement } from 'lit-element';
import {
  LtnLogger as Logger,
  LtnLogLevel as LogLevel,
  LtnLogLevelStrings as LogLevelStrings,
} from './LtnLogger.js';

interface LtnTrader {
  getService<T extends LtnElement>(Type: new () => T): T | null;
}

export enum LtnElementScope {
  ROOT = 'ROOT',
  AGGREGATE = 'AGGREGATE',
  COMPOSITE = 'COMPOSITE',
  CHILD = 'CHILD',
}

export class LtnElement extends LitElement {
  private __logger: Logger = new Logger(this.tagName.toLowerCase());
  private __scope: LtnElementScope = LtnElementScope.CHILD;
  protected _root: LtnElement | null = null;
  protected _traderStack: Array<LtnTrader> = [];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.__initScope();
    this.__initRoot();
    this.__initLogger();

    this._verbose(`Scope:${this.__scope}`);
  }

  _queryService<T extends LtnElement>(
    Type: new () => T,
    scope: LtnElementScope = LtnElementScope.AGGREGATE,
    name = ''
  ): T | null {
    let service: T | null = null;
    this._debug(`${this.constructor.name} === ${Type.name}`);
    if (this.constructor.name === Type.name) {
      if (name === '' || name === this.id) return (this as unknown) as T;
    }

    // in aggregate structures check your parent before checking children, but only immediate parent
    if (scope === LtnElementScope.AGGREGATE) {
      const parent: LtnElement | null = this.__getParentLtnElement();
      if (parent) {
        if (parent.constructor.name === Type.name) {
          if (name === '' || name === parent.id) {
            return (parent as unknown) as T;
          }
        }
      }
    }

    const children = this?.shadowRoot?.childNodes;
    children?.forEach(c => {
      if (service !== null || !(c instanceof LtnElement)) return;
      const el = c as LtnElement;
      if (el.__scope !== scope) return;

      service = el._queryService(Type, scope, name);
    });
    return service;
  }

  _getService<T extends LtnElement>(Type: new () => T): T | null {
    let parent: Node | null = this.parentNode;
    let result: T | null = null;

    while (parent !== null) {
      if (parent instanceof LtnElement) {
        const parentEl: LtnElement = parent as LtnElement;
        this._debug(
          `_getService`,
          parentEl,
          parentEl._traderStack[0],
          parentEl._traderStack[0]?.getService(Type)
        );
        result = parentEl._traderStack.reduce<T | null>((curr, next) => {
          if (curr) return curr;
          return next.getService(Type);
        }, (null as unknown) as T);

        if (result) {
          break;
        }
      }

      if (parent instanceof ShadowRoot) {
        parent = (parent as ShadowRoot).host;
      } else {
        parent = parent.parentNode;
      }
    }

    return result;
  }

  protected _error(...args: unknown[]) {
    this?.__logger.error(...args);
  }
  protected _warn(...args: unknown[]) {
    this?.__logger.warn(...args);
  }
  protected _info(...args: unknown[]) {
    this?.__logger.info(...args);
  }
  protected _verbose(...args: unknown[]) {
    this?.__logger.verbose(...args);
  }
  protected _debug(...args: unknown[]) {
    this?.__logger.debug(...args);
  }

  private __initRoot() {
    this._debug('__initRoot', this.__scope);
    if (this.__scope === LtnElementScope.ROOT) {
      this._root = this;
    } else {
      this._root = this.__queryParentScope(LtnElementScope.ROOT);
      this._debug('__initRoot', this._root);
      if (this._root === null) {
        throw new Error(`Missing root element`);
      }
    }
  }

  private __initScope() {
    let scope: string | null = this.getAttribute('scope');
    if (!scope || !(scope in LtnElementScope)) {
      scope = LtnElementScope.CHILD;
    }
    this.__scope = scope as LtnElementScope;
  }

  private __initLogger() {
    const ll: string | null = this.getAttribute('log-level');
    if (ll !== null) {
      const logLevel: LogLevelStrings = ll.toUpperCase() as LogLevelStrings;
      if (logLevel !== null && LogLevel[logLevel] !== undefined) {
        this.__logger.level = LogLevel[logLevel];
      }
    }
    const logLabel: string | null = this.getAttribute('log-label');
    if (logLabel !== null) {
      this.__logger.label = logLabel.toLowerCase();
    }
    const logDisable: string | null = this.getAttribute('log-disable');
    if (logDisable !== null) {
      this.__logger.disable = true;
    }
  }

  private __getParentLtnElement(): LtnElement | null {
    let parent: Node | null = this.parentNode;
    let result: LtnElement | null = null;

    while (parent !== null) {
      if (parent instanceof LtnElement) {
        result = parent as LtnElement;
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

  private __queryParentScope(scope: LtnElementScope): LtnElement | null {
    let parent: Node | null = this.parentNode;
    let result: LtnElement | null = null;

    while (parent !== null) {
      if (parent instanceof LtnElement) {
        const parentEl: LtnElement = parent as LtnElement;
        if (parentEl.__scope === scope) {
          result = parentEl;
          break;
        }
      }

      if (parent instanceof ShadowRoot) {
        parent = (parent as ShadowRoot).host;
      } else {
        parent = parent.parentNode;
      }
    }

    return result;
  }
}
