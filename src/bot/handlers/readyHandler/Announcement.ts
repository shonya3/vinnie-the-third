import { scheduleJob } from 'node-schedule';
import { dateToRule, unitToMs } from '../../../utils/dates.js';

import type { Job } from 'node-schedule';
import { cronToClosestDate } from '../../../utils/dates.js';
import { MIN_POSSIBLE_OFFSET, MAX_POSSIBLE_OFFSET } from '../../../const.js';
import type { Rule, TimeUnit } from '../../../types.js';

type RepeatingCallback = (offset: number, timeout: number, unit: TimeUnit) => Promise<any>;
type ReleaseCallback = Function;

type Offset = number;
interface OffsetsWithTimeUnit {
  offsets: Offset[];
  unit: TimeUnit;
}

export class Announcement {
  job?: Job;
  minPossibleOffset = MIN_POSSIBLE_OFFSET;
  maxPossibleOffset = MAX_POSSIBLE_OFFSET;
  repeatingCallback?: RepeatingCallback;
  releaseCallback?: ReleaseCallback;
  offsetsUnit: TimeUnit = 'minutes';
  #offsets?: number[];
  #callback?: Function;
  context: Map<any, any> = new Map();

  constructor(public rule: Rule, offsets?: Offset[] | OffsetsWithTimeUnit) {
    if (offsets) {
      if (Array.isArray(offsets)) this.offsets = offsets;
      else {
        this.offsetsUnit = offsets.unit;
        this.offsets = offsets.offsets;
      }
    }
  }

  schedule(repeating?: RepeatingCallback, onRelease?: ReleaseCallback) {
    this.#callback = this.#composeCallback(repeating, onRelease);
    // ? scheduleJob(this.bossName, this.rule, this.#callback.bind(this))
    // : scheduleJob(this.rule, this.#callback.bind(this));
    const job = scheduleJob(this.rule, this.#callback.bind(this));
    job.announcement = this;
    this.job = job;
    return job;
  }

  addContext(k: any, v: any) {
    this.context.set(k, v);
  }

  hasContext(k: any) {
    return this.context.has(k);
  }

  getContext(k: any) {
    return this.context.get(k);
  }

  set offsets(val: number[]) {
    this.#offsets = val;
    if (typeof this.rule === 'string') this.#buildRuleFromCron();
    if (this.rule instanceof Date) this.#applyOffsetToRule(this.rule);
  }

  get offsets() {
    return this.#offsets ?? [];
  }

  get maxOffset() {
    return this.offsets.length ? Math.max(...this.offsets) : undefined;
  }

  setRepeatingCallback(f: RepeatingCallback) {
    this.repeatingCallback = f;
  }

  setReleaseCallback(f: Function) {
    this.releaseCallback = f;
  }

  setMinMaxPossibleOffsets(min: number, max: number) {
    this.minPossibleOffset = min;
    this.maxPossibleOffset = max;
  }

  #buildRuleFromCron() {
    if (!this.maxOffset) return;
    if (this.#needsRuleTransform) {
      this.rule = cronToClosestDate(this.rule as string);
    }
  }

  #applyOffsetToRule(date: Date) {
    if (!this.maxOffset) return;
    const dateWithOffset = new Date(date.getTime() - unitToMs(this.maxOffset, this.offsetsUnit));
    this.rule = dateToRule(dateWithOffset);
  }

  get #needsRuleTransform() {
    return typeof this.rule === 'string' && this.maxOffset !== undefined;
  }

  #validateOffsets() {
    if (!this.offsets) return;

    if (this.offsets.some(offset => offset < this.minPossibleOffset))
      throw new Error('offset cannot be less than minPossibleOffset');
    if (this.offsets.some(offset => offset > this.maxPossibleOffset))
      throw new Error(`offset cannot be more than maxPossibleOffset.`);
  }

  async #runRepeatingCallbacks() {
    this.#validateOffsets();
    this.offsets.sort((a, b) => b - a);

    if (!this.repeatingCallback) throw new Error('no callback to repeat');
    for (let i = 0; i < this.offsets.length; i++) {
      const largerOffset = this.offsets[i];
      const smallerOffset = this.offsets[i + 1] ?? 0;
      const timeout = largerOffset - smallerOffset;
      await this.repeatingCallback(largerOffset, timeout, this.offsetsUnit);
    }
  }

  #composeCallback(repeating?: RepeatingCallback, onRelease?: ReleaseCallback) {
    if (repeating) this.setRepeatingCallback(repeating);
    if (onRelease) this.setReleaseCallback(onRelease);
    if (!this.repeatingCallback && !this.releaseCallback)
      throw new Error('should be at least repeating or release callback');

    return async () => {
      if (this.repeatingCallback) await this.#runRepeatingCallbacks();
      if (this.releaseCallback) await this.releaseCallback?.();
    };
  }
}
