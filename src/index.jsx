import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import PowderSim from './components/powder-sim.jsx'

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <PowderSim />
  </StrictMode>,
  rootElement
);