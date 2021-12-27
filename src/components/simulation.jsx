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
      onUpdate
    } = this.props

    this.state = {
      running: false,
      tick: 0,
      rerenderFlag: false,
      target_fps: 60,
      updates_per_second: 3
    }
    this.update_handler = undefined
    this.render_handler = undefined
  }

  componentDidMount () {
    this.update_handler = setInterval(this.update.bind(this), 1000 / this.state.updates_per_second)
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
      this.setState({
        rerenderFlag: !this.state.rerenderFlag
      })
    }
  }

  update () {
    try {
      if (this.state.running) {
        this.props.onUpdate()
      }
    } catch (e) {
      console.error(e)
      clearInterval(this.state.update_handler)
    }
  }

  start () {
    this.props.onStart()
    this.setState({
      running: true
    })
  }

  stop () {
    clearInterval(this.state.update_handler)
    this.props.onStop()
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

  render () {
    const stageopts = {
      backgroundColor: 0x000000,
      height: this.props.height,
      width: this.props.width
    };
    return (
      <>
        <Stage options={stageopts}>
          {this.props.children}
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
    );
  }
}