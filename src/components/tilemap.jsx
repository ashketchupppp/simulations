import React from "react";
import Tile, { makeTile } from "./tile.jsx";
import { Container } from "react-pixi-fiber";

export default function TileMap(props) {
  const { tileWidth, tileHeight, tiles, tileTypes } = props;

  // j is how far down the tile is, i is how far along the tile is
  let i
  let j = -1;
  const tileFlatmap = tiles.map(row => {
    i = -1;
    j++
    return row.map(currTile => {
      i++;
      return makeTile({
        ...currTile,
        w: tileWidth,
        h: tileHeight,
        x: tileWidth * i,
        y: tileHeight * j
      })
    })
  }).flat();

  return (
    <>
      <Container position={[0, 0]}>
        {tileFlatmap.map((tile) => (<Tile {...tile} /> ))}
      </Container>
    </>
  );
}