export enum Color {
  black = 0,
  white = 1,
  transparent = 2,
}

export class ElfImage {
  width: number;
  height: number;
  layers: number[][][] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  offset(x: number, y: number) {
    return y * this.width + x;
  }

  load(bytes: number[]) {
    const bytesPerLayer = this.width * this.height;
    const totalLayers = bytes.length / bytesPerLayer;
    const layers: number[][][] = [];
    for (let layerIndex = 0; layerIndex < totalLayers; layerIndex++) {
      const layer: number[][] = [];
      for (let y = 0; y < this.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < this.width; x++) {
          const offset = layerIndex * bytesPerLayer + this.offset(x, y);
          row.push(bytes[offset]);
        }
        layer.push(row);
      }
      layers.push(layer);
    }
    this.layers = layers;
  }

  findLayerZeros() {
    const bestLayer = {
      zero: Number.MAX_SAFE_INTEGER,
      one: 0,
      two: 0,
    };
    for (const layer of this.layers) {
      let zeroCount = 0;
      let oneCount = 0;
      let twoCount = 0;

      layer.forEach((r) =>
        r.forEach((n) => {
          if (n == 0) {
            zeroCount++;
          }
          if (n == 1) {
            oneCount++;
          }
          if (n == 2) {
            twoCount++;
          }
        }),
      );

      if (zeroCount < bestLayer.zero) {
        bestLayer.zero = zeroCount;
        bestLayer.one = oneCount;
        bestLayer.two = twoCount;
      }
    }
    return bestLayer;
  }

  pixel(x: number, y: number): number {
    for (const layer of this.layers) {
      if (layer[y][x] == Color.transparent) {
        continue;
      }
      return layer[y][x];
    }
    throw new Error('Invalid');
  }
}
