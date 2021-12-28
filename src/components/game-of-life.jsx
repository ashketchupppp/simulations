import React from 'react'
import { cloneDeep } from 'lodash';

import TileMap, { createBlankTiles } from './tilemap.jsx';
import Simulation from './simulation.jsx';

export default class GameOfLife extends React.Component {
  static defaultProps = {
    width: 400,
    height: 400,
    tileSize: 15,
    updatesPerSec: 3
  }

  constructor (props) {
    super(props)
    const {
      width,
      height,
      tileSize,
      updatesPerSec
    } = this.props

    this.state = {
      tiles: this.getBlankTileMap()
    }

    this.newTiles = this.state.tiles
    this.update_handler = undefined
    this.pointerDown = false
    this.renderCount = 0
  }

  componentDidMount () {
    this.update_handler = undefined
  }

  getBlankTileMap () {
    return createBlankTiles(
      this.props.width, 
      this.props.height, 
      this.props.tileSize,
      this.tileTypes().DEAD
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

  onReset () {
    this.setState({
      tiles: this.getBlankTileMap()
    })
    this.newTiles = this.getBlankTileMap()
  }

  onRerender () {
    this.setState({
      tiles: this.newTiles
    })
    this.newTiles = cloneDeep(this.state.tiles)
    // TODO: Make the tile JSON serializable and deep copy
    //       by doing JSON.parse(JSON.stringify(this.state.tiles))
  }

  update () {
    try {
      if (this.running) {
        for (let j = 0; j < this.state.tiles.length; j++) {
          for (let i = 0; i < this.state.tiles[j].length; i++) {
            let numSurroundingAlive = this.getNumSurroundingAlive(i, j, this.state.tiles)
    
            if (this.state.tiles[j][i].type === this.tileTypes().ALIVE.type) {
              if (numSurroundingAlive < 2 || numSurroundingAlive > 3) {
                this.newTiles[j][i].merge(this.tileTypes().DEAD)
              }
            } else if (this.state.tiles[j][i].type === this.tileTypes().DEAD.type) {
              if (numSurroundingAlive === 3) {
                this.newTiles[j][i].merge(this.tileTypes().ALIVE)
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      clearInterval(this.state.update_handler)
    }
  }

  onStart () {
    this.running = true
    this.setState({
      running: true,
      update_handler: setInterval(this.update.bind(this), 1000 / this.props.updatesPerSec)
    })
  }

  onStop () {
    this.running = false
    clearInterval(this.state.update_handler)
    this.setState({
      update_handler: undefined
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

  getNumSurroundingAlive (i, j, tiles) {
    return this.getSurroundingTiles(i, j)
    .map(pos => tiles[pos[0]][pos[1]])
    .reduce((pV, cV) => {
      if (cV.type === this.tileTypes().ALIVE.type) {
        return pV + 1
      }
      return pV
    }, 0)
  }

  pointerdown (event) {
    this.pointerDown = true
    const i = Math.floor(event.data.global.x / this.props.tileSize)
    const j = Math.floor(event.data.global.y / this.props.tileSize)
    if (!this.state.running) {
      if (this.state.tiles[j][i].type === this.tileTypes().DEAD.type) {
        this.newTiles[j][i].merge(this.tileTypes().ALIVE)
      } else if (this.state.tiles[j][i].type === this.tileTypes().ALIVE.type) {
        this.newTiles[j][i].merge(this.tileTypes().DEAD)
      }
    }
  }

  pointermove (event) {
    const i = Math.floor(event.data.global.x / this.props.tileSize)
    const j = Math.floor(event.data.global.y / this.props.tileSize)
    if (!this.state.running && this.pointerDown &&
        i < this.props.width && i >= 0 &&
        j < this.props.width && j >= 0) {
      if (this.state.tiles[j][i].type === this.tileTypes().DEAD.type) {
        this.newTiles[j][i].merge(this.tileTypes().ALIVE)
      }
    }
  }

  pointerup (event) {
    this.pointerDown = false
  }

  render () {
    return (
      <>
        <Simulation
          width={this.props.width * this.props.tileSize}
          height={this.props.height * this.props.tileSize}
          onRerender={() => this.onRerender()}
          onReset={() => this.onReset()}
          onStart={() => this.onStart()}
          onStop={() => this.onStop()}
        >
          <TileMap
              tileWidth={this.props.tileSize}
              tileHeight={this.props.tileSize}
              tiles={this.state.tiles}
              pointerdown={e => this.pointerdown(e)}
              pointermove={e => this.pointermove(e)}
              pointerup={e => this.pointerup(e)}
            />
        </Simulation>
      </>
    )
  }
}