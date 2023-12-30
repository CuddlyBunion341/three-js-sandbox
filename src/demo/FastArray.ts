export class FastArray<T> {
  private array: T[]
  private lastIndex: number

  constructor(maxSize: number) {
    this.array = new Array(maxSize)
    this.lastIndex = 0
  }

  append(...items: T[]) {
    for (let i = 0; i < items.length; i++) {
      this.array[this.lastIndex + i] = items[i]
      this.lastIndex++
    }
  }

  shorten() {
    return this.array.slice(0, this.lastIndex)
  }
}
