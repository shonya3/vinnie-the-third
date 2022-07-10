import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { AnyFunction, Wrapper } from '../types.js';

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));
export const extnameJsTs = (name: string) => extname(name) === '.js' || extname(name) === '.ts';
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

export const countUniqueMessages = (messages: string[]) => {
  const unique = Array.from(new Set(messages)).length;
  return `unique messages: ${unique} / ${messages.length}`;
};

export const concatStringsToLength = (s1: string, s2: string, length: number) => {
  const s1Length = s1.length;
  const s2Length = s2.length;
  const neededSpaces = length - (s1Length + s2Length);
  return `${s2}${' '.repeat(neededSpaces >= 0 ? neededSpaces : 0)}${s1}`;
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
