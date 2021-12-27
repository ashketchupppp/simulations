import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';

export const makeTile = (props = {}) => {
  return {
    key: uuidv4(),
    colour: 0x000000,
    ...props,
  };
}

const TYPE = "Rectangle";
export const behavior = {
  customDisplayObject: (props) => new PIXI.Graphics(),
  customApplyProps: function (instance, oldProps, newProps) {
    const { x, y, w, h, colour } = newProps;
    instance.clear();
    instance.beginFill(colour);
    instance.drawRect(x, y, w, h);
    instance.endFill();
  }
};
export default CustomPIXIComponent(behavior, TYPE)
