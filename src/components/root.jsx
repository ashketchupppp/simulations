import React, { StrictMode, useState } from "react";
import 'antd/dist/antd.css'

import { Menu } from 'antd'

import PowderSim from "./powder-sim.jsx";
import GameOfLife from "./game-of-life.jsx";

const selectableItems = {
  'powder-sim': (<PowderSim width={10} height={10} tileSize={20} />),
  'game-of-life': (<GameOfLife width={50} height={50} tileSize={10} />)
}

export default function Root (props) {
  const [selected, setSelected] = useState('powder-sim')

  const onClick = event => {
    setSelected(event.key)
  }

  const menuItems = Object.keys(selectableItems).map(key => {
    return (
      <Menu.Item key={key}>
        {key}
      </Menu.Item>
    )
  })

  return (
    <StrictMode>
      <Menu mode="horizontal" onClick={onClick}>
        {menuItems}
      </Menu>
        {selectableItems[selected]}
    </StrictMode>
  )
}