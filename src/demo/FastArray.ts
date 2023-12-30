export class FastArray<T> {
  private data: T[]
  private lastIndex: number

  constructor(maxSize: number) {
    this.data = new Array(maxSize)
    this.lastIndex = 0
  }

  append(items: T[]) {
    for (let i = 0; i < items.length; i++) {
      this.data[this.lastIndex] = items[i]
      this.lastIndex++
    }
  }

  shorten() {
    return this.data.slice(0, this.lastIndex)
  }

  get itemCount() {
    return this.lastIndex
  }
}
