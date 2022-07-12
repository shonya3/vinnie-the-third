import { scheduleJob } from 'node-schedule';
import { dateToRule, unitToMs } from './dates.js';

import type { Job } from 'node-schedule';
import { cronToClosestDate } from './dates.js';
import { MIN_POSSIBLE_OFFSET, MAX_POSSIBLE_OFFSET } from '../const.js';
import type {
  Rule,
  TimeUnit,
  RepeatingCallback,
  ReleaseCallback,
  Offset,
  OffsetsWithTimeUnit,
  AnyFunction,
  AnnouncementCallbacks,
} from '../types.js';

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

  schedule(callbacks?: AnnouncementCallbacks) {
    this.#callback = this.#composeCallback({
      repeating: callbacks?.repeating,
      onRelease: callbacks?.onRelease,
    });
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

  setReleaseCallback(f: AnyFunction) {
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

  #composeCallback({ repeating, onRelease }: AnnouncementCallbacks) {
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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const { waitSeconds, secondsLater, wait } = await import('./dates.js');

  it('Announcement', async () => {
    const announcement = new Announcement(secondsLater(new Date(), 2), {
      unit: 'seconds',
      offsets: [0, 0.5, 1],
    });
    const messages: string[] = [];
    const timestamps: number[] = [];
    const createMsg = (offset: number, unit: TimeUnit) => {
      return `Reminder that the event happens in ${offset} ${unit}`;
    };

    announcement.schedule({
      async repeating(offset, timeout, unit) {
        const msg = createMsg(offset, unit);
        messages.push(msg);
        timestamps.push(new Date().getTime());
        await wait(timeout, unit);
      },
      onRelease: () => messages.push('Release message!'),
    });

    await wait(2.1, 'seconds');
    expect(messages).toEqual([
      'Reminder that the event happens in 1 seconds',
      'Reminder that the event happens in 0.5 seconds',
      'Reminder that the event happens in 0 seconds',
      'Release message!',
    ]);
    const arr = [timestamps[2] - timestamps[1], timestamps[1] - timestamps[0]];
    expect(arr.every(el => Math.abs(el - 500) <= 50)).toBeTruthy();
  });
}
