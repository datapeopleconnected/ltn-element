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

import { expect } from '@open-wc/testing';

import { LtnLogger, LtnLogLevel } from '../src/LtnLogger.js';

describe('LtnLogger', () => {
  afterEach(() => {
    LtnLogger.disableLogging = false;
  });

  it('writes WARN logs when level allows it', () => {
    const logger = new LtnLogger('test', LtnLogLevel.WARN);
    const originalWarn = console.warn;
    const calls: unknown[][] = [];

    console.warn = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      logger.warn('message');
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal('[WARN]');
      expect(calls[0][1]).to.equal('[test]');
      expect(calls[0][2]).to.equal('message');
    } finally {
      console.warn = originalWarn;
    }
  });

  it('does not write INFO logs when level is WARN', () => {
    const logger = new LtnLogger('test', LtnLogLevel.WARN);
    const originalInfo = console.info;
    let called = false;

    console.info = () => {
      called = true;
    };

    try {
      logger.info('message');
      expect(called).to.equal(false);
    } finally {
      console.info = originalInfo;
    }
  });

  it('does not log when instance logging is disabled', () => {
    const logger = new LtnLogger('test', LtnLogLevel.SYS);
    logger.disable = true;

    const originalDebug = console.debug;
    let called = false;

    console.debug = () => {
      called = true;
    };

    try {
      logger.sys('message');
      expect(called).to.equal(false);
    } finally {
      console.debug = originalDebug;
    }
  });

  it('does not log when global logging is disabled', () => {
    const logger = new LtnLogger('test', LtnLogLevel.SYS);
    LtnLogger.disableLogging = true;

    const originalDebug = console.debug;
    let called = false;

    console.debug = () => {
      called = true;
    };

    try {
      logger.sys('message');
      expect(called).to.equal(false);
    } finally {
      console.debug = originalDebug;
    }
  });

  it('writes ERROR logs with label payload array', () => {
    const logger = new LtnLogger('test');
    const originalError = console.error;
    const calls: unknown[][] = [];

    console.error = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      logger.error('boom');
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.deep.equal(['test', 'boom']);
    } finally {
      console.error = originalError;
    }
  });

  it('uses label setter for WARN output', () => {
    const logger = new LtnLogger('initial', LtnLogLevel.WARN);
    logger.label = 'updated';

    const originalWarn = console.warn;
    const calls: unknown[][] = [];

    console.warn = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      logger.warn('message');
      expect(calls.length).to.equal(1);
      expect(calls[0][1]).to.equal('[updated]');
    } finally {
      console.warn = originalWarn;
    }
  });

  it('writes INFO when level is raised via setter', () => {
    const logger = new LtnLogger('test', LtnLogLevel.WARN);
    logger.level = LtnLogLevel.INFO;

    const originalInfo = console.info;
    const calls: unknown[][] = [];

    console.info = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      logger.info('hello');
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal('[INFO]');
    } finally {
      console.info = originalInfo;
    }
  });

  it('writes DEBUG and SYS when level is SYS', () => {
    const logger = new LtnLogger('test', LtnLogLevel.SYS);
    const originalDebug = console.debug;
    const calls: unknown[][] = [];

    console.debug = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      logger.debug('dbg');
      logger.sys('sys');
      expect(calls.length).to.equal(2);
      expect(calls[0][0]).to.equal('[DEBUG]');
      expect(calls[1][0]).to.equal('[SYS]');
    } finally {
      console.debug = originalDebug;
    }
  });
});
