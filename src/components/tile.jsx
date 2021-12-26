import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';

export const tileTypes = {
  'ROCK': 'ROCK'
}

export const tileProperties = {
  [tileTypes.ROCK]: {
    colour: 0x1e1b1e
  }
}

export const tile = (props = {}) => {
  let typeProperties
  if (props.Type) {
    typeProperties = tileProperties[props.Type]
  }
  return {
    key: uuidv4(),
    colour: 0x000000,
    x: 0,
    y: 0,
    w: 20,
    h: 20,
    ...typeProperties,
    ...props,
  };
}

export const getTile = (type) => {
  return tile({ Type: type })
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
