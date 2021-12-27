import React from 'react'
import { Stage, AppContext } from 'react-pixi-fiber'
import { PlayCircleFilled, PauseCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd';
import { cloneDeep } from 'lodash';

import TileMap, { createBlankTiles } from './tilemap.jsx';

export default class GameOfLife extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height,
      tileSize
    } = this.props

    this.state = {
      running: false,
      tick: 0,
      rerenderFlag: false,
      target_fps: 60,
      updates_per_second: 3,
      tiles: this.getBlankTileMap()
    }
    this.newTiles = this.state.tiles
    this.update_handler = undefined
    this.render_handler = undefined
    if (!tileSize) {
      this.props.tileSize = 15
    }
    this.pointerDown = false
    this.renderCount = 0
  }

  componentDidMount () {
    this.update_handler = undefined
    this.render_handler = setInterval(this.rerender.bind(this), 1000 / this.state.target_fps)
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

  reset () {
    this.stop()
    this.setState({
      tick: 0,
      tiles: this.getBlankTileMap()
    })
    this.newTiles = this.getBlankTileMap()
  }

  rerender () {
    if (!this.timeSinceLastUpdate) {
      this.timeSinceLastUpdate = new Date().getTime()
    }
    const dt = new Date().getTime() - this.timeSinceLastUpdate
    if (dt > 1000 / this.state.target_fps) {
      this.setState({
        tiles: this.newTiles
      })
      this.newTiles = cloneDeep(this.state.tiles)
    }
  }

  update () {
    try {
      if (this.state.running) {
        for (let j = 0; j < this.state.tiles.length; j++) {
          for (let i = 0; i < this.state.tiles[j].length; i++) {
            let numSurroundingAlive = this.getNumSurroundingAlive(i, j, this.state.tiles)
    
            if (this.state.tiles[j][i].type === this.tileTypes().ALIVE.type) {
              if (numSurroundingAlive < 2 || numSurroundingAlive > 3) {
                this.newTiles[j][i].merge(this.tileTypes().DEAD)
              }
            } else if (this.state.tiles[j][i].type === this.tileTypes().DEAD.type) {
              if (numSurroundingAlive > 2) {
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

  start () {
    this.setState({
      running: true,
      update_handler: setInterval(this.update.bind(this), 1000 / this.state.updates_per_second)
    })
  }

  stop () {
    clearInterval(this.state.update_handler)
    this.setState({
      running: false,
      update_handler: undefined
    })
  }

  toggleRunning () {
    if (this.state.running) {
      this.stop()
    } else {
      this.start()
    }
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

  stageopts = {
    backgroundColor: 0x000000,
    height: this.props.height * this.props.tileSize,
    width: this.props.width * this.props.tileSize
  };

  render () {
    return (
      <>
        <Stage options={this.stageopts}>
          <TileMap
            tileWidth={this.props.tileSize}
            tileHeight={this.props.tileSize}
            tiles={this.state.tiles}
            pointerdown={e => this.pointerdown(e)}
            pointermove={e => this.pointermove(e)}
            pointerup={e => this.pointerup(e)}
          />
        </Stage>
        <Divider />
        {this.state.running
          ? <PauseCircleFilled 
                onClick={() => { this.toggleRunning() }}
                style={{ fontSize: '32px' }}
              />
          : <PlayCircleFilled
                onClick={() => { this.toggleRunning() }}
                style={{ fontSize: '32px' }} 
              />}
        {<CloseCircleFilled 
            onClick={() => { this.reset() }}
            style={{ fontSize: '32px' }}
        />}
        Iteration: {this.state.tick}
      </>
    )
  }
}