import React from "react";
import Tile, { makeTile } from "./tile.jsx";
import { Container } from "react-pixi-fiber";

export function createBlankTiles (width, height, tileSize, defaultTile) {
  let tiles = Array.apply(null, Array(width)).map(() =>
    Array.apply(null, Array(height)).map(() => makeTile(defaultTile))
  )
  let i
  let j = -1;
  return tiles.map(row => {
    i = -1;
    j++
    return row.map(currTile => {
      i++;
      return {
        ...currTile,
        w: tileSize,
        h: tileSize,
        x: tileSize * i,
        y: tileSize * j
      }
    })
  })
}

export default function TileMap(props) {
  const {
    tiles,
    pointerdown,
    pointermove,
    pointerup
  } = props;

  return (
    <>
      <Container 
        interactive
        position={[0, 0]}
        pointerdown={pointerdown ? pointerdown : () => {}}
        pointermove={pointermove ? pointermove : () => {}}
        pointerup={pointerup ? pointerup : () => {}}
      >
        {tiles.flat().map((tile) => (<Tile {...tile} /> ))}
      </Container>
    </>
  );
}