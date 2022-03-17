"use strict";

const sudoku = [
  ["-", "-", "-", 8, 9, 4, 6, "-", "-"],
  ["-", 2, "-", "-", 6, 7, "-", 3, "-"],
  [7, "-", "-", 2, "-", "-", "-", "-", "-"],
  [3, 9, "-", "-", "-", "-", 1, "-", 4],
  [4, 8, "-", "-", "-", "-", "-", 2, 6],
  [2, "-", 7, "-", "-", "-", "-", 9, 5],
  ["-", "-", "-", "-", "-", 1, "-", "-", 7],
  ["-", 3, "-", 7, 2, "-", "-", 4, "-"],
  ["-", "-", 2, 4, 5, 9, "-", "-", "-"],
];

let rowNumber = 0; //0...8
let columnNumber = 0; //0...8

let row = sudoku[rowNumber];

let column = [
  sudoku[0][columnNumber],
  sudoku[1][columnNumber],
  sudoku[2][columnNumber],
  sudoku[3][columnNumber],
  sudoku[4][columnNumber],
  sudoku[5][columnNumber],
  sudoku[6][columnNumber],
  sudoku[7][columnNumber],
  sudoku[8][columnNumber],
];

// Blocks
const blocks = new Map([
  [
    "block1",
    sudoku[0].slice(0, 3).concat(sudoku[1].slice(0, 3), sudoku[2].slice(0, 3)),
  ],
  [
    "block2",
    sudoku[0].slice(3, 6).concat(sudoku[1].slice(3, 6), sudoku[2].slice(3, 6)),
  ],
  [
    "block3",
    sudoku[0].slice(6, 9).concat(sudoku[1].slice(6, 9), sudoku[2].slice(6, 9)),
  ],
  [
    "block4",
    sudoku[3].slice(0, 3).concat(sudoku[4].slice(0, 3), sudoku[5].slice(0, 3)),
  ],
  [
    "block5",
    sudoku[3].slice(3, 6).concat(sudoku[4].slice(3, 6), sudoku[5].slice(3, 6)),
  ],
  [
    "block6",
    sudoku[3].slice(6, 9).concat(sudoku[4].slice(6, 9), sudoku[5].slice(6, 9)),
  ],
  [
    "block7",
    sudoku[6].slice(0, 3).concat(sudoku[7].slice(0, 3), sudoku[8].slice(0, 3)),
  ],
  [
    "block8",
    sudoku[6].slice(3, 6).concat(sudoku[7].slice(3, 6), sudoku[8].slice(3, 6)),
  ],
  [
    "block9",
    sudoku[6].slice(6, 9).concat(sudoku[7].slice(6, 9), sudoku[8].slice(6, 9)),
  ],
]);

// check block number of point (x/y)
const giveBlockNum = function () {
  let block;

  if (rowNumber <= 2 && columnNumber <= 2) block = "block1";
  else if (rowNumber <= 2 && columnNumber <= 5) block = "block2";
  else if (rowNumber <= 2 && columnNumber <= 8) block = "block3";
  else if (rowNumber <= 5 && columnNumber <= 2) block = "block4";
  else if (rowNumber <= 5 && columnNumber <= 5) block = "block5";
  else if (rowNumber <= 5 && columnNumber <= 8) block = "block6";
  else if (columnNumber <= 2) block = "block7";
  else if (columnNumber <= 5) block = "block8";
  else if (columnNumber <= 8) block = "block9";
  return block;
};
//console.log(giveBlockNum());

// Rules

// add numbers in filtered array
const rowAdd = row
  .filter((character) => typeof character === "number")
  .reduce((acc, curr) => acc + curr);

// add numbers in filtered array
const columnAdd = column
  .filter((character) => typeof character === "number")
  .reduce((acc, curr) => acc + curr);

// 3. sum in each block must be 45
const blockSum = function () {
  let b = blocks.get(giveBlockNum()).filter((c) => typeof c === "number");
  if (!b.length) return 0;
  return b.reduce((acc, curr) => acc + curr);
};
// console.log(blockSum());

// in each row, the number occurs only once (Set)
const rowSet = new Set(row.filter((c) => typeof c === "number"));

// in each column, the number occurs only once (Set)
const columnSet = new Set(column.filter((c) => typeof c === "number"));

// in each block, the number occurs only once (Set)
const blockSet = new Set(
  blocks.get(giveBlockNum()).filter((c) => typeof c === "number")
);

// check, if rules are true
const test = function (blockNumber) {
  if (rowAdd <= 45 && columnAdd <= 45 && blockSum(blockNumber) <= 45)
    console.log("tests passed");
};
console.log(sudoku.slice(0, 1) + sudoku.slice(2, 8));
// change value of sudoku[x][y]
const changeValue = function (x, y, num) {
  if (y != 0) {
    sudoku = sudoku.slice(0, y);
    sudoku[y].slice(0, x - 1) +
      num.toString() +
      "," +
      sudoku[y].slice(x + 1, sudoku[y].length);
  }
};
//console.log(sudoku.length);
for (let x = 0; x < sudoku.length; x++) {
  for (let y = 0; y < sudoku.length; y++) {
    console.log(columnNumber, rowNumber, giveBlockNum());
    console.log([rowAdd <= 45, columnAdd <= 45, blockSum(giveBlockNum())]);
    console.log(x, y, sudoku[x][y] === "-");
    // if (sudoku[y].splice(x, 1) === "-") {
    //   sudoku = changeValue(x, y, num++);
    //   console.log(sudoku);
    // }
    columnNumber++;
    if (columnNumber === 9) {
      columnNumber = 0;
      break;
    }
  }
  rowNumber++;
  if (rowNumber === 9) {
    break;
  }
}
