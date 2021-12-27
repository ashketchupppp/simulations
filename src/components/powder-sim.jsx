import React from "react";
import TileGame from "./tile-game.jsx";

const tileTypes = {
  'EMPTY': {
    type: 'EMPTY',
    colour: 0x101010
  },
  'ROCK': {
    type: 'ROCK',
    colour: 0x1e1b1e
  }
}

export default class PowderSim extends TileGame {
  constructor (props) {
    super(props)
    this.tiles[5][5] = { ...tileTypes.ROCK }
  }

  applyGravity (tiles, j, i) {
    const nextHeight = j + 1
    const rightOfParticle = i + 1
    const leftOfParticle = i - 1
    if (nextHeight < tiles[j].length) {
      if (tiles[nextHeight][i].type === tileTypes.EMPTY.type) {
        const temp = tiles[j][i]
        tiles[j][i] = tiles[nextHeight][i]
        tiles[nextHeight][i] = temp
      } else if (tiles[nextHeight][rightOfParticle].type === tileTypes.EMPTY.type) {
        const temp = tiles[j][i]
        tiles[j][i] = tiles[nextHeight][rightOfParticle]
        tiles[nextHeight][rightOfParticle] = temp
      } else if (tiles[nextHeight][leftOfParticle].type === tileTypes.EMPTY.type) {
        const temp = tiles[j][i]
        tiles[j][i] = tiles[nextHeight][leftOfParticle]
        tiles[nextHeight][leftOfParticle] = temp
      }
    }
  }

  update (tiles) {
    let newTiles = Array.from(tiles).map(row => Array.from(row))
    for (let j = 0; j < tiles.length; j++) {
      for (let i = 0; i < tiles[j].length; i++) {
        switch (tiles[j][i].type) {
          case tileTypes.ROCK.type:
            this.applyGravity(newTiles, j, i)
            break
        }
      }
    }
    return newTiles
  }
}