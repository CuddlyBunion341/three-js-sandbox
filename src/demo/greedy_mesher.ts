export class GreedyMesher {
  constructor() { }
  static build(matrix: number[]) {
    const WIDTH = 4
    const HEIGHT = 3

    matrix.reduce((acc, cur, idx) => {
      const {lastShape, shapes} = acc

      const col = idx % WIDTH
      const row = Math.floor(idx / WIDTH)

      if (cur !== acc.lastBlock) {
        console.log('new block', acc.lastBlock, acc.lastIdx, acc.lastRow, acc.lastCol)
        shapes.push({
          start: acc.lastIdx,
          end: idx,
          row: acc.lastRow,
          col: acc.lastCol,
          block: acc.lastBlock
        })
        
      }
    }, {lastBlock: matrix[0][0], lastIdx: 0, lastRow: 0, lastCol: 0, shapes: []})
    return []
  }
}
