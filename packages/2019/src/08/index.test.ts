import o from 'ospec';
import 'source-map-support/register';
import { ElfImage, Color } from './index';
import { InputData } from './input';

o.spec('2019:Day08', () => {
  o('should do first example', () => {
    const img = new ElfImage(3, 2);
    img.load('123456789012'.split('').map((c) => parseInt(c)));

    o(img.layers[0]).deepEquals([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    o(img.layers[1]).deepEquals([
      [7, 8, 9],
      [0, 1, 2],
    ]);
  });

  o('should do second example', () => {
    const img = new ElfImage(2, 2);
    img.load(`0222112222120000`.split('').map((c) => parseInt(c)));

    const topLeft = img.pixel(0, 0);
    const topRight = img.pixel(1, 0);
    const bottomLeft = img.pixel(0, 1);
    const bottomRight = img.pixel(1, 1);
    o(topLeft).equals(Color.black);
    o(topRight).equals(Color.white);
    o(bottomRight).equals(Color.black);
    o(bottomLeft).equals(Color.white);
  });

  o('Answers', () => {
    const img = new ElfImage(25, 6);
    img.load(InputData);
    const zeroLayer = img.findLayerZeros();

    console.log();
    console.log('2019:08.Question#1', zeroLayer.one * zeroLayer.two);
    o(zeroLayer.one * zeroLayer.two).equals(1848);
    console.log('2019:08.Question#2');

    for (let y = 0; y < img.height; y++) {
      const row = [];
      for (let x = 0; x < img.width; x++) {
        if (img.pixel(x, y) == Color.white) {
          row.push('XX');
        } else {
          row.push('  ');
        }
      }
      console.log(row.join(''));
    }
    console.log('Done');
  });
});
