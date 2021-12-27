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
      updates_per_second: 3,
      interval_handler: undefined
    }
  }

  reset () {
    this.stop()
    this.setState({
      tick: 0
    })
    this.props.onReset()
    this.rerender()
  }

  start () {
    const update = () => { 
      try {
        this.props.onUpdate()
        this.setState({
          tick: this.state.tick + 1
        })
      } catch (e) {
        console.error(e)
        clearInterval(this.state.interval_handler)
      }
    }
    const interval = setInterval(update.bind(this), 1000 / this.state.updates_per_second)

    this.setState({
      interval_handler: interval
    })
    this.props.onStart()
  }

  rerender () {
    this.setState({
      rerenderFlag: !this.state.rerenderFlag
    })
  }

  stop () {
    clearInterval(this.state.interval_handler)
    this.props.onStop()
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
           ? <PauseCircleFilled onClick={() => { this.toggleRunning() }} style={{ fontSize: '32px' }} />
           : <PlayCircleFilled onClick={() => { this.toggleRunning() }} style={{ fontSize: '32px' }} />}
        {<CloseCircleFilled onClick={() => { this.reset() }} style={{ fontSize: '32px' }} />}
        Iteration: {this.state.tick}
      </>
    );
  }
}