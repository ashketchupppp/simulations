import React from "react";
import { Stage, AppContext, Container } from "react-pixi-fiber";
import { PlayCircleFilled, PauseCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd';

import TileMap from "./tilemap.jsx";
import { makeTile } from "./tile.jsx";

export default class TileGame extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height,
      tileSize
    } = this.props

    this.defaultTile = this.tileTypes()[Object.keys(this.tileTypes())[0]]

    this.tiles = Array.apply(null, Array(width)).map(() =>
      Array.apply(null, Array(height)).map(() => makeTile(this.defaultTile))
    )

    this.state = {
      running: false,
      tick: 0,
      rerenderFlag: false,
      updates_per_second: 3,
      interval_handler: undefined
    }
  }

  reset () {
    this.stop()
    this.setState({
      tick: 0
    })
    this.tiles = Array.apply(null, Array(this.props.width)).map(() =>
      Array.apply(null, Array(this.props.height)).map(() => makeTile(this.defaultTile))
    )
    this.rerender()
  }

  start () {
    const interval = setInterval(() => { 
      try {
        this.tiles = this.update.bind(this)(this.tiles)
        this.setState({
          tick: this.state.tick + 1
        })
      } catch (e) {
        console.error(e)
        clearInterval(this.state.interval_handler)
      }
    }, 1000 / this.state.updates_per_second)

    this.setState({
      interval_handler: interval,
      running: true
    })
  }

  rerender () {
    this.setState({
      rerenderFlag: !this.state.rerenderFlag
    })
  }

  stop () {
    clearInterval(this.state.interval_handler)
    this.setState({
      running: false
    })
  }

  toggleRunning () {
    if (this.state.running) {
      this.stop()
    } else {
      this.start()
    }
    this.setState({
      running: !this.state.running
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

  tileTypes () {
    return {
      EMPTY: {
        type: 'EMPTY',
        colour: 0x000000
      }
    }
  }

  update (tiles) {
    // Implement me - return the new tiles to render
  }

  onClick (i, j) {
    // Implement me
  }

  pointerdown (event, props) {
    const i = Math.floor(event.data.global.x / props.tileSize)
    const j = Math.floor(event.data.global.y / props.tileSize)
    this.onClick(i, j)
    this.rerender()
  }

  render () {
    const stageopts = {
      backgroundColor: 0x000000,
      height: this.props.tileSize * this.props.height,
      width: this.props.tileSize * this.props.width
    };

    return (
      <div className="App">
        <Stage options={stageopts}>
          <AppContext.Consumer>
            {app => (
              <Container interactive pointerdown={event => this.pointerdown(event, this.props)}>
                <TileMap
                  tileWidth={this.props.tileSize}
                  tileHeight={this.props.tileSize}
                  tiles={this.tiles}
                />
              </Container>
            )}
          </AppContext.Consumer>
        </Stage>
        <Divider/>
        {
          this.state.running
           ? <PauseCircleFilled onClick={() => { this.toggleRunning() }} style={{ fontSize: '32px' }} />
           : <PlayCircleFilled onClick={() => { this.toggleRunning() }} style={{ fontSize: '32px' }} />
        }
        {<CloseCircleFilled onClick={() => { this.reset() }} style={{ fontSize: '32px' }} />}
        Iteration: {this.state.tick}
      </div>
    );
  }
}