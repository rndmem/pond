// https://gist.github.com/blixt/f17b47c62508be59987b
// http://www.firstpr.com.au/dsp/rand31/

export class Random {
  constructor(private _seed: number = 0) {
    this._seed = _seed % 2147483647
    if (this._seed <= 0) this._seed += 2147483646
  }

  /** @return [min, max) */
  float(min: number = 0, max: number = 1): number {
    this._seed = (this._seed * 16807) % 2147483647
    return min + ((max - min) * (this._seed - 1)) / 2147483646
  }

  /** @return An integer [min, max). */
  int(min = 0, max = 2): number {
    return Math.floor(this.float(min, max))
  }
}