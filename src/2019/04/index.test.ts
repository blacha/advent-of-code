import o from 'ospec';
import { checkInput, hasDoubleDupe } from './index';

o.spec('2019:Day04', () => {
  o('check dupes', () => {
    o(checkInput('111111')).equals(true);
    o(checkInput('223450')).equals(false);
    o(checkInput('123789')).equals(false);
  });

  o('Answer', () => {
    const Input = {
      low: 240298,
      high: 784956,
    };
    const answerOne = [];
    for (let i = Input.low; i <= Input.high; i++) {
      const iStr = i.toString();
      if (checkInput(iStr)) {
        answerOne.push(iStr);
      }
    }
    const answerTwo = [];
    for (const check of answerOne) {
      if (hasDoubleDupe(check)) {
        answerTwo.push(check);
      }
    }

    console.log('');
    console.log('2020:04.Question#1', answerOne.length);
    console.log('2020:04.Question#2', answerTwo.length);
  });
});
