export enum LtnLogLevel {
  ERROR,
  WARN,
  INFO,
  VERBOSE,
  DEBUG
}

export type LtnLogLevelStrings = keyof typeof LtnLogLevel;

export class LtnLogger {
  protected _level: LtnLogLevel = LtnLogLevel.INFO;
  private _label: string;
  private _disable = false;

  static disableLogging = false;
  
  constructor(label: string, level: LtnLogLevel=LtnLogLevel.INFO) {
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
    console.error([this._label, ...args]);
  }

  warn(..._args: unknown[]) {
    if (LtnLogger.disableLogging === false && this._disable === false && this._level >= LtnLogLevel.WARN) {
      const args: unknown[] = ['[WARN]', `[${this._label}]`, ..._args];
      console.warn(...args);
    }
  }

  info(..._args: unknown[]) {
    if (LtnLogger.disableLogging === false && this._disable === false && this._level >= LtnLogLevel.INFO) {
      const args: unknown[] = ['[INFO]', `[${this._label}]`, ..._args];
      console.info(...args);
    }
  }

  verbose(..._args: unknown[]) {
    if (LtnLogger.disableLogging === false && this._disable === false && this._level >= LtnLogLevel.VERBOSE) {
      const args: unknown[] = ['[VERBOSE]', `[${this._label}]`, ..._args];
      console.log(...args);
    }
  }

  debug(..._args: unknown[]) {
    if (LtnLogger.disableLogging === false && this._disable === false && this._level >= LtnLogLevel.DEBUG) {
      const args: unknown[] = ['[DEBUG]', `[${this._label}]`, ..._args];
      console.debug(...args);
    }
  }
}
