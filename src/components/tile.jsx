import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';

export const makeTile = (props = {}) => {
  return {
    key: uuidv4(),
    colour: 0x000000,
    merge: function (tile) {
      this.colour = tile.colour
      this.type = tile.type
    },
    ...props,
  };
}

const TYPE = "Rectangle";
export const behavior = {
  customDisplayObject: (props) => new PIXI.Graphics(),
  customApplyProps: function (instance, oldProps, newProps) {
    if (
      oldProps.colour !== newProps.colour ||
      oldProps.x !== newProps.x ||
      oldProps.y !== newProps.y ||
      oldProps.w !== newProps.w ||
      oldProps.h !== newProps.h ||
      oldProps.mask !== newProps.mask
    ) {
      instance.clear();
      instance.beginFill(newProps.colour);
      instance.drawRect(newProps.x, newProps.y, newProps.w, newProps.h);
      instance.endFill();
      if (newProps.mask) {
        instance.mask = newProps.mask
      }
    }
  }
};
export default CustomPIXIComponent(behavior, TYPE)
