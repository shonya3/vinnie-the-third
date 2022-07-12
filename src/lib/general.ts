import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { AnyFunction } from '../types.js';

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));
export const extnameJsTs = (name: string) => {
  if (['.spec', '.test'].some(e => name.includes(e))) return false;
  return extname(name) === '.js' || extname(name) === '.ts';
};
export const __dir = (importMetaUrl: string) => dirname(fileURLToPath(importMetaUrl));
export const resolveFrom__dirname = (importMetaUrl: string, path: string) => resolve(__dir(importMetaUrl), path);

export const throwIfNot = <T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string): T[K] => {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(msg || `Environment is missing variable ${String(prop)}`);
  } else {
    return obj[prop] as T[K];
  }
};

export const arrToFile = (filename: string, arr: any[]) => {
  let fname = filename.includes('.') ? filename : filename.concat('.txt');
  writeFile(fname, arr.join('\n'));
};

export const capitalize = (str: string) => {
  if (str.length === 0) return '';
  const [first, ...rest] = str;
  return `${first.toUpperCase()}${rest.join('')}`;
};

export const concatStringsToLength = (s1: string, s2: string, length: number) => {
  const s1Length = s1.length;
  const s2Length = s2.length;
  const neededSpaces = length - (s1Length + s2Length);
  return `${s1}${' '.repeat(neededSpaces >= 0 ? neededSpaces : 0)}${s2}`;
};

export const preventSpamWrapper = <T extends AnyFunction>(
  f: T,
  milliseconds: number = 1000 * 5
): ((...args: Parameters<T>) => ReturnType<T>) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): ReturnType<T> {
    //@ts-ignore
    if (timeoutId) return;
    const result = f(...args);
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, milliseconds);
    return result;
  };
};

if (import.meta.vitest) {
  const { it, expect, describe, vi } = import.meta.vitest;

  it('unique', () => {
    expect(unique([1, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 3])).toEqual([1, 2, 3]);
  });
  it('extnameJsTs', () => {
    expect(extnameJsTs('index.html')).toBe(false);
    expect(extnameJsTs('index.js')).toBe(true);
    expect(extnameJsTs('index.ts')).toBe(true);
    expect(extnameJsTs('index.spec.py')).toBe(false);
    expect(extnameJsTs('index.spec.ts')).toBe(false);
    expect(extnameJsTs('index.test.js')).toBe(false);
  });

  it('throwIfNot', () => {
    let res;
    let errorMsg = 'Send this error message to test function';
    try {
      throwIfNot(process.env, 'NOTHERE', errorMsg);
    } catch (err) {
      res = errorMsg;
    }
    expect(res).toBe(errorMsg);
  });

  it('capitalize', () => {
    expect(capitalize('filename')).toBe('Filename');
    expect(capitalize('f')).toBe('F');
    expect(capitalize('')).toBe('');
  });
  it('concatStringsToLength', () => {
    const testString = concatStringsToLength('paragraph', 'article', 30);
    expect(testString.length).toBe(30);
    expect(testString).toBe('paragraph              article');
  });
  it('preventSpamWrapper', () => {
    const arr = [];
    const addArrElement = () => arr.push(1);
    const wrapped = preventSpamWrapper(addArrElement);
    for (let i = 0; i < 10; i++) wrapped();
    expect(arr.length).toBe(1);
  });
}
