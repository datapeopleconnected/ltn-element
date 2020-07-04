import { LitElement } from "lit-element";
import { LtnLogger as Logger, LtnLogLevel as LogLevel } from './LtnLogger.js';

export enum LtnElementScope {
  ROOT = 'ROOT',
  TRADER = 'TRADER',
  AGGREGATE = 'AGGREGATE',
  COMPOSITE = 'COMPOSITE',
  CHILD = 'CHILD'
}

export class LtnElement extends LitElement {
  private __logger: Logger = new Logger(this.tagName.toLowerCase());
  private __scope: LtnElementScope = LtnElementScope.CHILD;
  protected _root: LtnElement | null = null;


  constructor() {
    super();    
  }

  connectedCallback() {
    super.connectedCallback();
    this.__initScope();
    this.__initRoot();

    this._info(`Scope:${this.__scope}`);
  }

  private __initRoot() {
    this._debug('__initRoot', this.__scope);
    if (this.__scope === LtnElementScope.ROOT) {
      this._root = this;
    } else {
      this._root = this._queryParentScope(LtnElementScope.ROOT);
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

  _queryService<T extends LtnElement>(Type: new () => T, scope: LtnElementScope=LtnElementScope.AGGREGATE, name=''): T | null {
    let service: T | null = null;
    this._debug(`${this.constructor.name} === ${Type.name}`);
    if (this.constructor.name === Type.name) {
      if (name === '' || name === this.id)
      return (this as unknown) as T;
    }
    const children = this?.shadowRoot?.childNodes;
    children?.forEach(c => {
      if (service !== null || !(c instanceof LtnElement)) return;
      const el = (c as LtnElement);
      if (c.__scope !== scope) return;

      service = el._queryService(Type, scope, name);
    });
    return service;
  }

  protected _queryParentScope(scope: LtnElementScope): LtnElement | null {
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

  protected _queryParentService<T extends LtnElement>(Type: new () => T): T | null {
    let parent: Node | null = this.parentNode;
    let result: T | null = null;

    while (parent !== null) {
      if (parent instanceof LtnElement) {
        const parentEl: LtnElement = parent as LtnElement;
        result = parentEl._queryService(Type);
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

  protected set _logLevel(logLevel: LogLevel) {
    this.__logger.level = logLevel;
  }
  _error(...args: unknown[]) {
    this?.__logger.error(...args);
  }
  _warn(...args: unknown[]) {
    this?.__logger.warn(...args);
  }
  _info(...args: unknown[]) {
    this?.__logger.info(...args);
  }
  _verbose(...args: unknown[]) {
    this?.__logger.verbose(...args);
  }
  _debug(...args: unknown[]) {
    this?.__logger.debug(...args);
  }
}
