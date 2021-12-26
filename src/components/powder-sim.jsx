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
const tileWidth = 25
const tileHeight = 25

const tileTypes = {
  'EMPTY': {
    type: 'EMPTY',
    colour: 0x101010
  },
  'ROCK': {
    type: 'ROCK',
    colour: 0x1e1b1e
  }
}

export default class PowderSim extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height
    } = this.props
    this.tiles = Array.apply(null, Array(width)).map(() =>
       Array.apply(null, Array(height)).map(() => makeTile(tileTypes.EMPTY))
    )
    this.tiles[5][5] = { ...tileTypes.ROCK }
    this.state = {
      running: false,
      tick: false
    }
  }

  componentDidMount () {
    setInterval(() => { 
      try {
        this.tiles = this.update(this.tiles)
        this.setState({ tick: !this.state.tick })
      } catch (e) {
        console.error(e)
      }
    }, 1000)
  }

  applyGravity (tiles, j, i) {
    const nextHeight = j + 1
    const rightOfParticle = i + 1
    const leftOfParticle = i - 1
    if (nextHeight < tiles[j].length) {
      if (tiles[nextHeight][i].type === tileTypes.EMPTY.type) {
        const temp = tiles[j][i]
        tiles[j][i] = tiles[nextHeight][i]
        tiles[nextHeight][i] = temp
      } else if (tiles[nextHeight][rightOfParticle].type === tileTypes.EMPTY.type) {
        const temp = tiles[j][i]
        tiles[j][i] = tiles[nextHeight][rightOfParticle]
        tiles[nextHeight][rightOfParticle] = temp
      } else if (tiles[nextHeight][leftOfParticle].type === tileTypes.EMPTY.type) {
        const temp = tiles[j][i]
        tiles[j][i] = tiles[nextHeight][leftOfParticle]
        tiles[nextHeight][leftOfParticle] = temp
      }
    }
  }

  update (tiles) {
    let newTiles = Array.from(tiles).map(row => Array.from(row))
    for (let j = 0; j < tiles.length; j++) {
      for (let i = 0; i < tiles[j].length; i++) {
        switch (tiles[j][i].type) {
          case tileTypes.ROCK.type:
            this.applyGravity(newTiles, j, i)
            break
        }
      }
    }
    return newTiles
  }

  toggleRunning () {
    this.setState({
      running: !this.state.running
    })
  }

  render () {
    return (
      <div className="App">
        <Stage options={stageopts}>
          <AppContext.Consumer>
            {app => (
              <Container position={[mapXOffset, mapYOffset]}>
                <TileMap
                  tileWidth={tileWidth}
                  tileHeight={tileHeight}
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