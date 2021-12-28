import React from 'react'
import { Stage, AppContext } from 'react-pixi-fiber'
import { PlayCircleFilled, PauseCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd';

export default class Simulation extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height,
      onRerender,
      onStart,
      onStop,
      onReset
    } = this.props

    this.state = {
      running: false,
      tick: 0,
      rerenderFlag: false,
      target_fps: 60
    }
    this.render_handler = undefined
  }

  componentDidMount () {
    this.render_handler = setInterval(this.rerender.bind(this), 1000 / this.state.target_fps)
  }

  reset () {
    this.stop()
    this.setState({
      tick: 0
    })
    this.props.onReset()
  }

  rerender () {
    if (!this.timeSinceLastUpdate) {
      this.timeSinceLastUpdate = new Date().getTime()
    }
    const dt = new Date().getTime() - this.timeSinceLastUpdate
    if (dt > 1000 / this.state.target_fps) {
      this.props.onRerender()
      // TODO: Make the tile JSON serializable and deep copy
      //       by doing JSON.parse(JSON.stringify(this.state.tiles))
    }
  }

  start () {
    this.setState({
      running: true
    })
    this.props.onStart()
  }

  stop () {
    this.setState({
      running: false
    })
    this.props.onStop()
  }

  stageopts = {
    backgroundColor: 0x000000,
    height: this.props.height,
    width: this.props.width
  };

  render () {
    return (
      <>
        <Stage options={this.stageopts}>
          {this.props.children}
        </Stage>
        <Divider />
        {this.state.running
           ? <PauseCircleFilled 
                onClick={() => { this.stop() }}
                style={{ fontSize: '32px' }}
              />
           : <PlayCircleFilled
                onClick={() => { this.start() }}
                style={{ fontSize: '32px' }} 
              />}
        {<CloseCircleFilled 
            onClick={() => { this.reset() }}
            style={{ fontSize: '32px' }}
        />}
        Iteration: {this.state.tick}
      </>
    );
  }
}