import * as o from 'ospec';
import 'source-map-support/register';
import { Computer } from '../shared/computer/int.computer';
import { Day9Input } from './input';

o.spec('Day9', () => {
    const computer = new Computer();

    o('should do first example', () => {
        computer.state.offsetRelative = 2000;
        computer.init('109,19');
        computer.resume();
        o(computer.state.offsetRelative).equals(2019);

        computer.run('109,34,204,-34');
        o(computer.state.output).deepEquals([109]);

        computer.run('109,37,204,-34');
        o(computer.state.output).deepEquals([-34]);
    });

    o('should do second example', () => {
        computer.run('104,1125899906842624,99');
        o(computer.output).deepEquals(1125899906842624);

        computer.run('1102,34915192,34915192,7,4,7,99,0');
        o(computer.output).equals(1219070632396864);

        computer.run('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99');
        o(computer.state.output.join(',')).equals('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99');
    });

    o('Answers', () => {
        computer.run(Day9Input, [1]);
        o(computer.isEnded).equals(true);

        console.log();
        console.log('Day9.Question#1', computer.output);

        computer.run(Day9Input, [2]);
        o(computer.isEnded).equals(true);
        console.log('Day9.Question#2', computer.output);
    });
});
