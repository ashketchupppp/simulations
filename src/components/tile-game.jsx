import React from "react";
import { Stage, AppContext, Container } from "react-pixi-fiber";

import TileMap from "./tilemap.jsx";
import { makeTile } from "./tile.jsx";

const stageopts = {
  backgroundColor: 0x000000,
  height: window.innerHeight * 0.95,
  width: window.innerWidth * 0.95
};
const mapXOffset = stageopts.width / 4;
const mapYOffset = stageopts.height / 4;

export default class TileGame extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height,
      tileSize,
      tileTypes
    } = this.props

    this.tileTypes = {
      EMPTY: {
        type: 'EMPTY',
        colour: 0x101010
      },
      ...tileTypes
    }

    this.tiles = Array.apply(null, Array(width)).map(() =>
      Array.apply(null, Array(height)).map(() => makeTile(this.tileTypes.EMPTY))
    )

    this.state = {
      running: false,
      tick: false,
      updates_per_second: 1,
      interval_handler: undefined
    }
  }

  componentDidMount () {
    const interval = setInterval(() => { 
      try {
        this.tiles = this.update(this.tiles)
        this.setState({ tick: !this.state.tick })
      } catch (e) {
        console.error(e)
        clearInterval(this.state.interval_handler)
      }
    }, 1000 / this.state.updates_per_second)

    this.setState({
      interval_handler: interval
    })
  }

  toggleRunning () {
    this.setState({
      running: !this.state.running
    })
  }

  update () {
    // Implement me
  }

  render () {
    return (
      <div className="App">
        <Stage options={stageopts}>
          <AppContext.Consumer>
            {app => (
              <Container position={[mapXOffset, mapYOffset]}>
                <TileMap
                  tileWidth={this.props.tileSize}
                  tileHeight={this.props.tileSize}
                  tiles={this.tiles}
                />
              </Container>
            )}
          </AppContext.Consumer>
        </Stage>
        <button onClick={() => { this.toggleRunning() }}>Start/Stop</button>
      </div>
    );
  }
}