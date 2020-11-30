import { Grid } from '../03';
import { Computer } from '../shared/computer/int.computer';
import { RobotProgram } from './robot';
export enum PanelColor {
  Black = 0,
  White = 1,
}

export enum GridType {
  North = '^',
  East = '>',
  West = '<',
  South = 'v',
}
const RobotDirections = [GridType.North, GridType.East, GridType.South, GridType.West];

export enum RobotDirection {
  Left = 0,
  Right = 1,
}

export interface RobotLocation {
  x: number;
  y: number;
  type: GridType;
}

export class Robot {
  computer = new Computer();
  grid: Map<string, PanelColor> = new Map();
  robot: RobotLocation;
  paintCount = 0;
  constructor() {
    this.robot = { x: 100, y: 100, type: GridType.North };
    this.computer.init(RobotProgram);
  }

  get currentPanelColor(): PanelColor {
    const { x, y } = this.robot;
    return this.grid.get(`${x}:${y}`) || PanelColor.Black;
  }

  paint(color: PanelColor) {
    const { x, y } = this.robot;

    const lastColor = this.grid.get(`${x}:${y}`);
    if (lastColor == null) {
      this.paintCount++;
      // return;
    }
    return this.grid.set(`${x}:${y}`, color);
  }
  run() {
    while (!this.computer.isEnded) {
      this.step();
    }
  }

  step() {
    // console.log('Resume', this.currentPanelColor)
    this.computer.resume([this.currentPanelColor]);
    const paintColor = this.computer.state.output.shift();
    // console.log('Paint', paintColor)
    if (paintColor == null) {
      throw new Error('Failed to paint');
    }
    this.paint(paintColor);
    const direction = this.computer.state.output.shift();
    this.changeDirection(direction);
    this.move();
  }

  changeDirection(direction?: RobotDirection) {
    if (direction == null) {
      throw new Error('Failed');
    }
    let currentIndex = RobotDirections.indexOf(this.robot.type);
    if (direction == RobotDirection.Left) {
      currentIndex--;
    } else {
      currentIndex++;
    }
    if (currentIndex < 0) {
      currentIndex = RobotDirections.length - 1;
    } else if (currentIndex == RobotDirections.length) {
      currentIndex = 0;
    }
    // console.log('Direction', RobotDirection[direction], this.robot.type, '=>', RobotDirections[currentIndex])
    this.robot.type = RobotDirections[currentIndex];
  }

  move() {
    switch (this.robot.type) {
      case GridType.North:
        this.robot.y--;
        break;
      case GridType.West:
        this.robot.x--;
        break;
      case GridType.East:
        this.robot.x++;
        break;
      case GridType.South:
        this.robot.y++;
        break;
    }
  }
}
