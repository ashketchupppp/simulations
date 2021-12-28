import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "Line";
export const behavior = {
  customDisplayObject: (props) => new PIXI.Graphics(),
  customApplyProps: function (instance, oldProps, newProps) {
    if (
      oldProps.x !== newProps.x ||
      oldProps.y !== newProps.y ||
      oldProps.endY !== newProps.endY ||
      oldProps.endX !== newProps.endX ||
      oldProps.lineColour !== newProps.lineColour || 
      oldProps.width !== newProps.width 
    ) {
      instance.clear();
      instance.lineStyle(newProps.width, newProps.lineColour)
      instance.moveTo(newProps.x, newProps.y)
      instance.lineTo(newProps.endX, newProps.endY)
      instance.endFill();
    }
  }
};
export default CustomPIXIComponent(behavior, TYPE)
