import 'source-map-support/register';

import * as o from 'ospec';
import { Robot, PanelColor } from './index';

o.spec('Day11', () => {
    o('Answers', () => {
        const robot = new Robot();
        robot.run();
        console.log('');

        console.log('Day11.Question#1', robot.paintCount);
        o(robot.paintCount).equals(1709);

        const robotB = new Robot();
        robotB.robot.x = 0;
        robotB.robot.y = 0;
        robotB.paint(PanelColor.White);
        robotB.run();

        console.log('Day11.Question#2');
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

