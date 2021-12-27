import React from 'react'

import Simulation from "./simulation.jsx";
import TileMap from './tilemap.jsx';
import { makeTile } from "./tile.jsx";

export default class GameOfLife extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height
    } = this.props

    this.state = {
      running: false,
      rerenderFlag: false
    }

    this.setup()
  }

  setup () {
    this.tiles = Array.apply(null, Array(this.props.width)).map(() =>
      Array.apply(null, Array(this.props.height)).map(() => makeTile(this.tileTypes().DEAD))
    )
  }

  tileTypes () {
    return {
      DEAD: {
        type: 'DEAD',
        colour: 0x101010
      },
      ALIVE: {
        type: 'ALIVE',
        colour: 0xffffff
      },
    }
  }

  rerender () {
    this.setState({
      rerenderFlag: !this.state.rerenderFlag
    })
  }

  getSurroundingTiles (i, j) {
    return [
      [j - 1, i - 1], [j - 1, i], [j - 1, i + 1], [j, i - 1], 
      [j, i + 1], [j + 1, i - 1], [j + 1, i], [j + 1, i + 1]
    ].filter(value => 
      (value[0] >= 0 && value[0] < this.props.height) &&
      (value[1] >= 0 && value[1] < this.props.width)
    )
  }

  getNumSurroundingAlive (i, j) {
    let tiles = this.getSurroundingTiles(i, j)
    tiles = tiles.map(pos => this.tiles[pos[0]][pos[1]]).reduce((pV, cV) => {
      if (cV.type === this.tileTypes().ALIVE.type) {
        return pV + 1
      }
      return pV
    }, 0)
    return tiles
  }

  pointerdown (event) {
    const i = Math.floor(event.data.global.x / this.props.tileSize)
    const j = Math.floor(event.data.global.y / this.props.tileSize)
    if (!this.state.running) {
      if (this.tiles[j][i].type === this.tileTypes().DEAD.type) {
        this.tiles[j][i] = makeTile(this.tileTypes().ALIVE)
      } else if (this.tiles[j][i].type === this.tileTypes().ALIVE.type) {
        this.tiles[j][i] = makeTile(this.tileTypes().DEAD)
      }
    }
    this.rerender()
  }

  update(tiles) {
    let newTiles = Array.from(tiles).map(row => Array.from(row))
    for (let j = 0; j < tiles.length; j++) {
      for (let i = 0; i < tiles[j].length; i++) {
        let numSurroundingAlive = this.getNumSurroundingAlive(i, j)

        if (tiles[j][i].type === this.tileTypes().ALIVE.type) {
          if (numSurroundingAlive < 2 || numSurroundingAlive > 3) {
            newTiles[j][i] = this.tileTypes().DEAD
          }
        } else if (tiles[j][i].type === this.tileTypes().DEAD.type) {
          if (numSurroundingAlive > 2) {
            newTiles[j][i] = this.tileTypes().ALIVE
          }
        }
      }
    }
    this.tiles = newTiles
    this.rerender()
  }

  render () {
    return (
      <Simulation
        height={300}
        width={300}
        onUpdate={() => this.update(this.tiles)}
        onStart={() => this.setState({ running: true })}
        onStop={() => this.setState({ running: false })}
        onReset={() => this.setup()}
      >
        <TileMap
          tileWidth={this.props.tileSize}
          tileHeight={this.props.tileSize}
          tiles={this.tiles}
          pointerdown={e => this.pointerdown(e)}
        />
      </Simulation>
    )
  }
}