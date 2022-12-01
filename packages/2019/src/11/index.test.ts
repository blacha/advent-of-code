import o from 'ospec';
import { PanelColor, Robot } from './index.js';

o.spec('2019:Day11', () => {
  o('Answers', () => {
    const robot = new Robot();
    robot.run();
    console.log('');

    console.log('2019:11.Question#1', robot.paintCount);
    o(robot.paintCount).equals(1709);

    const robotB = new Robot();
    robotB.robot.x = 0;
    robotB.robot.y = 0;
    robotB.paint(PanelColor.White);
    robotB.run();

    console.log('2019:11.Question#2');
    for (let y = 0; y < 6; y++) {
      const line: string[] = [];
      for (let x = 0; x < 41; x++) {
        if (robotB.grid.get(`${x}:${y}`) == PanelColor.White) {
          line.push('XX');
        } else {
          line.push('  ');
        }
      }
      console.log(line.join(''));
    }
  });
});
