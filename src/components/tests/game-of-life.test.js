import { calculateNewCellState } from "../game-of-life.jsx";

test('dead cell with 2 or less neighbours stays dead', () => {
  expect(calculateNewCellState('DEAD', 0)).toEqual('DEAD')
  expect(calculateNewCellState('DEAD', 1)).toEqual('DEAD')
  expect(calculateNewCellState('DEAD', 2)).toEqual('DEAD')
})

test('dead cell with 4 or more neighbours stays dead', () => {
  expect(calculateNewCellState('DEAD', 4)).toEqual('DEAD')
  expect(calculateNewCellState('DEAD', 5)).toEqual('DEAD')
  expect(calculateNewCellState('DEAD', 6)).toEqual('DEAD')
  expect(calculateNewCellState('DEAD', 7)).toEqual('DEAD')
  expect(calculateNewCellState('DEAD', 8)).toEqual('DEAD')
})

test('dead cell with 3 neighbours comes alive', () => {
  expect(calculateNewCellState('DEAD', 3)).toEqual('ALIVE')
})

test('alive cell with 2 or 3 neightbours stays alive', () => {
  expect(calculateNewCellState('ALIVE', 2)).toEqual('ALIVE')
  expect(calculateNewCellState('ALIVE', 3)).toEqual('ALIVE')
})

test('alive cell with anything but 2 or 3 neightbours dies', () => {
  expect(calculateNewCellState('ALIVE', 0)).toEqual('DEAD')
  expect(calculateNewCellState('ALIVE', 1)).toEqual('DEAD')
  expect(calculateNewCellState('ALIVE', 4)).toEqual('DEAD')
  expect(calculateNewCellState('ALIVE', 5)).toEqual('DEAD')
  expect(calculateNewCellState('ALIVE', 6)).toEqual('DEAD')
  expect(calculateNewCellState('ALIVE', 7)).toEqual('DEAD')
  expect(calculateNewCellState('ALIVE', 8)).toEqual('DEAD')
})