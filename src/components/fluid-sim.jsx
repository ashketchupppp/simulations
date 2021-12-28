import React from "react";
import Simulation from "./simulation.jsx";

export default class FluidSim extends React.Component {
  constructor (props) {
    super(props)
    const {
      width,
      height
    } = this.props

    this.state = {
      currentMask: []
    }

    this.nextMask = []
    this.running = false
  }

  onRerender() {

  }

  onStart() {

  }

  onStop() {

  }

  onReset() {

  }

  render() {
    return (
      <Simulation
        width={this.props.width}
        height={this.props.height}
        onRerender={() => this.onRerender()}
        onReset={() => this.onReset()}
        onStart={() => this.onStart()}
        onStop={() => this.onStop()}
      >

      </Simulation>
    )
  }
}