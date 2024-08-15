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

// eslint-disable-next-line no-shadow
export enum LtnLogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
  SYS,
}

export type LtnLogLevelStrings = keyof typeof LtnLogLevel;

export class LtnLogger {
  protected _level: LtnLogLevel = LtnLogLevel.INFO;

  private _label: string;

  private _disable = false;

  static disableLogging = false;

  constructor(label: string, level: LtnLogLevel = LtnLogLevel.INFO) {
    this._label = label;
    this._level = level;
  }

  set level(level: LtnLogLevel) {
    this._level = level;
  }

  set label(label: string) {
    this._label = label;
  }

  set disable(disable: boolean) {
    this._disable = disable;
  }

  error(...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.error([this._label, ...args]);
  }

  warn(..._args: unknown[]) {
    if (
      LtnLogger.disableLogging === false &&
      this._disable === false &&
      this._level >= LtnLogLevel.WARN
    ) {
      const args: unknown[] = ['[WARN]', `[${this._label}]`, ..._args];
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  }

  info(..._args: unknown[]) {
    if (
      LtnLogger.disableLogging === false &&
      this._disable === false &&
      this._level >= LtnLogLevel.INFO
    ) {
      const args: unknown[] = ['[INFO]', `[${this._label}]`, ..._args];
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  }

  debug(..._args: unknown[]) {
    if (
      LtnLogger.disableLogging === false &&
      this._disable === false &&
      this._level >= LtnLogLevel.DEBUG
    ) {
      const args: unknown[] = ['[DEBUG]', `[${this._label}]`, ..._args];
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  }

  sys(..._args: unknown[]) {
    if (
      LtnLogger.disableLogging === false &&
      this._disable === false &&
      this._level >= LtnLogLevel.SYS
    ) {
      const args: unknown[] = ['[SYS]', `[${this._label}]`, ..._args];
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  }
}
