import TileGame from "./tile-game.jsx";
import { makeTile } from "./tile.jsx";

export default class GameOfLife extends TileGame {
  constructor (props) {
    super(props)
  }

  onClick (i, j) {
    if (!this.state.running) {
      if (this.tiles[j][i].type === this.tileTypes().DEAD.type) {
        this.tiles[j][i] = makeTile(this.tileTypes().ALIVE)
      } else if (this.tiles[j][i].type === this.tileTypes().ALIVE.type) {
        this.tiles[j][i] = makeTile(this.tileTypes().DEAD)
      }
    }
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

  getNumSurroundingAlive (i, j) {
    let tiles = this.getSurroundingTiles(i, j)
    tiles = tiles.map(pos => this.tiles[pos[0]][pos[1]]).reduce((pV, cV) => {
      if (cV.type === this.tileTypes().ALIVE.type) {
        return pV + 1
      }
      return pV
    }, 0)
    return tiles
  }

  update(tiles) {
    let newTiles = Array.from(tiles).map(row => Array.from(row))
    for (let j = 0; j < tiles.length; j++) {
      for (let i = 0; i < tiles[j].length; i++) {
        let numSurroundingAlive = this.getNumSurroundingAlive(i, j)

        if (tiles[j][i].type === this.tileTypes().ALIVE.type) {
          if (numSurroundingAlive < 2 || numSurroundingAlive > 3) {
            newTiles[j][i] = this.tileTypes().DEAD
          }
        } else if (tiles[j][i].type === this.tileTypes().DEAD.type) {
          if (numSurroundingAlive > 2) {
            newTiles[j][i] = this.tileTypes().ALIVE
          }
        }
      }
    }
    return newTiles
  }
}