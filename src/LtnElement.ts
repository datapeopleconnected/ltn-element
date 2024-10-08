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

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  LtnLogger as Logger,
  LtnLogLevel as LogLevel,
  LtnLogLevelStrings as LogLevelStrings,
} from './LtnLogger.js';

interface LtnTrader {
  // eslint-disable-next-line no-use-before-define
  getService<T extends LtnElement>(Type: new () => T): T | undefined;
}

// eslint-disable-next-line no-shadow
export enum LtnElementScope {
  ROOT = 'ROOT',
  AGGREGATE = 'AGGREGATE',
  COMPOSITE = 'COMPOSITE',
  CHILD = 'CHILD',
}

export class LtnElement extends LitElement {
  private __logger: Logger = new Logger(this.tagName.toLowerCase());

  private __scope: LtnElementScope = LtnElementScope.CHILD;

  protected _root?: LtnElement;

  protected _traderStack: Array<LtnTrader> = [];

  public readonly LtnElementVersion: number = 1;

  @property({ type: String })
  logLevel: string = 'info';

  connectedCallback() {
    super.connectedCallback();
    this.__initScope();
    this.__initRoot();
    this.__initLogger();

    this._sys(`Scope:${this.__scope}`);
  }

  _queryService<T extends LtnElement>(
    Type: new () => T,
    scope: LtnElementScope = LtnElementScope.AGGREGATE,
    name = ''
  ): T | undefined {
    let service: T | undefined;
    this._sys(scope, `${this.constructor.name} === ${Type.name}`);
    if (this.constructor.name === Type.name) {
      if (name === '' || name === this.id) return this as unknown as T;
    }

    // in aggregate structures check your parent before checking children, but only immediate parent
    if (scope === LtnElementScope.AGGREGATE) {
      const parent = this.__getParentLtnElement();
      if (parent) {
        if (parent.constructor.name === Type.name) {
          if (name === '' || name === parent.id) {
            return parent as unknown as T;
          }
        }
      }
    }

    const children = this?.shadowRoot?.childNodes;
    children?.forEach(c => {
      if (service !== undefined || !(c as LtnElement).LtnElementVersion) return;

      const el = c as LtnElement;
      if (el.__scope !== scope) return;

      service = el._queryService(Type, scope, name);
    });
    return service;
  }

  _getService<T extends LtnElement>(Type: new () => T): T | undefined {
    let parent: Node | null = this.parentNode;
    let result: T | undefined;

    while (parent !== null) {
      if ((parent as LtnElement).LtnElementVersion) {
        const parentEl: LtnElement = parent as LtnElement;
        this._sys(
          `_getService`,
          parentEl,
          parentEl._traderStack[0],
          parentEl._traderStack[0]?.getService(Type)
        );
        result = parentEl._traderStack.reduce<T | undefined>((curr, next) => {
          if (curr) return curr;
          return next.getService(Type);
        }, undefined as unknown as T);

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

  protected _setLogLevel(level: LogLevel) {
    this.__logger.level = level;
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

  protected _debug(...args: unknown[]) {
    this?.__logger.debug(...args);
  }

  protected _sys(...args: unknown[]) {
    this?.__logger.sys(...args);
  }

  private __initRoot() {
    this._sys('__initRoot', this.__scope);
    if (this.__scope === LtnElementScope.ROOT) {
      this._root = this;
    } else {
      this._root = this.__queryParentScope(LtnElementScope.ROOT);
      this._sys('__initRoot', this._root);
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
    const ll: string | null = this.logLevel;
    if (ll !== null) {
      const logLevel: LogLevelStrings = ll.toUpperCase() as LogLevelStrings;
      if (logLevel !== null && LogLevel[logLevel] !== undefined) {
        this._setLogLevel(LogLevel[logLevel]);
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

  private __getParentLtnElement(): LtnElement | undefined {
    let parent: Node | null = this.parentNode;
    let result: LtnElement | undefined;

    while (parent !== null) {
      if ((parent as LtnElement).LtnElementVersion) {
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

  private __queryParentScope(scope: LtnElementScope): LtnElement | undefined {
    let parent: Node | null = this.parentNode;
    let result: LtnElement | undefined;

    while (parent !== null) {
      if ((parent as LtnElement).LtnElementVersion) {
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
