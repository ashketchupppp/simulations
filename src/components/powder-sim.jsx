import React from "react";
import TileMap from "./tilemap.jsx";
import { Stage, AppContext, Container } from "react-pixi-fiber";

export default class PowderSim extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const stageopts = {
      backgroundColor: 0x000000,
      height: window.innerHeight * 0.95,
      width: window.innerWidth * 0.95
    };
    const mapXOffset = stageopts.width / 4;
    const mapYOffset = stageopts.height / 4;
    const tileWidth = 25
    const tileHeight = 25

    const tiles = []
  
    return (
      <div className="App">
        <Stage options={stageopts}>
          <AppContext.Consumer>
            {app => (
              <Container position={[mapXOffset, mapYOffset]}>
                <TileMap
                  tileWidth={tileWidth}
                  tileHeight={tileHeight}
                  tiles={tiles}
                />
              </Container>
            )}
          </AppContext.Consumer>
        </Stage>
      </div>
    );
  }
}