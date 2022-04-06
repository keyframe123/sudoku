"use strict";

const buttonSolve = document.querySelector(".solve");
const buttonReset = document.querySelector(".reset");
const inputFields = document.querySelector(".input");

const rows = [
  document.querySelector(".row1"),
  document.querySelector(".row2"),
  document.querySelector(".row3"),
  document.querySelector(".row4"),
  document.querySelector(".row5"),
  document.querySelector(".row6"),
  document.querySelector(".row7"),
  document.querySelector(".row8"),
  document.querySelector(".row9"),
];

let sudoku;

// let sudokuTest = [
//   [0, 0, 0, 8, 9, 4, 6, 0, 0],
//   [0, 2, 0, 0, 6, 7, 0, 3, 0],
//   [7, 0, 0, 2, 0, 0, 0, 0, 0],
//   [3, 9, 0, 0, 0, 0, 1, 0, 4],
//   [4, 8, 0, 0, 0, 0, 0, 2, 6],
//   [2, 0, 7, 0, 0, 0, 0, 9, 5],
//   [0, 0, 0, 0, 0, 1, 0, 0, 7],
//   [0, 3, 0, 7, 2, 0, 0, 4, 0],
//   [0, 0, 2, 4, 5, 9, 0, 0, 0],
// ];

// const original = JSON.parse(JSON.stringify(sudokuTest));
let solved;

// dynamically insert rows
for (let i = 0; i <= 8; i++) {
  let html;
  for (let j = 0; j <= 8; j++) {
    html = `<td class="cell${j}"><input class="input input${j}" type="number" maxlength="1" value=""></td>`;
    rows[i].innerHTML += html;
  }
}

// inserts sudoku array in HTML
const resetSudoku = () => {
  for (let row = 0; row < 9; row++) {
    // console.group(`row${row}`);
    for (let column = 0; column < 9; column++) {
      rows[row].childNodes[column].childNodes[0].value = "";
    }
    // console.groupEnd();
  }
};
//insertSudoku(true);

// checks, if row is correct
const checkRow = (row) => {
  let count = 0;
  const set = new Set();
  for (let column = 0; column < 9; column++) {
    if (rows[row].childNodes[column].childNodes[0].value === "") {
      continue;
    }
    set.add(rows[row].childNodes[column].childNodes[0].value);
    count++;
  }
  if (set.size < count) {
    return false;
  }
  return true;
};

// checks, if column is correct
const checkColumn = (column) => {
  let count = 0;
  const set = new Set();
  for (let row = 0; row < 9; row++) {
    if (rows[row].childNodes[column].childNodes[0].value === "") {
      continue;
    }
    set.add(rows[row].childNodes[column].childNodes[0].value);
    count++;
  }
  if (set.size < count) {
    return false;
  }
  return true;
};

// checks, if block is currect
const checkBlock = (row, column) => {
  let count = 0;
  const set = new Set();
  const blockRow = Math.floor(row / 3) * 3;
  const blockColumn = Math.floor(column / 3) * 3;

  for (let row = blockRow; row < blockRow + 3; row++) {
    for (let column = blockColumn; column < blockColumn + 3; column++) {
      if (rows[row].childNodes[column].childNodes[0].value === "") {
        continue;
      }
      set.add(rows[row].childNodes[column].childNodes[0].value);
      count++;
    }
  }
  if (set.size < count) {
    return false;
  }
  return true;
};

// solve sudoku
const solve = () => {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (rows[row].childNodes[column].childNodes[0].value === "") {
        for (let n = 1; n <= 9; n++) {
          rows[row].childNodes[column].childNodes[0].value = n;
          if (
            checkRow(row) &&
            checkColumn(column) &&
            checkBlock(row, column) &&
            solve()
          ) {
            return true;
          } else {
            rows[row].childNodes[column].childNodes[0].value = "";
          }
        }
        return false;
      }
    }
  }
  return true;
};

// if input is not correct, print error message
const checkAll = () => {
  const set = new Set();
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (checkBlock(row, column) && checkRow(row) && checkColumn(column)) {
        set.add(true);
      } else set.add(false);
    }
  }
  if (set.size === 2) {
    return false;
  }
  return true;
};

buttonSolve.addEventListener("click", function () {
  if (checkAll()) solve();
  else alert("not solvable");
  // sudokuTest = JSON.parse(JSON.stringify(sudokuTest));
});

buttonReset.addEventListener("click", function () {
  // sudokuTest = original;
  // console.log(original);
  resetSudoku(false);
});

// for (let row = 0; row < 9; row++) {
//   for (let column = 0; column < 9; column++) {
//     if ((rows[row].childNodes[column].childNodes[0].value === "0")) {
//       // .input add class .hide
//       rows[row].childNodes[column].childNodes[0].value.classList.add("hide");
//     }
//   }
// }
// submitButton.addEventListener("click", function () {
//   let test = [];
//   for (let i = 0; i <= 8; i++) {
//     test.push(inputLines[`${i}`].value.split("").map(Number));
//   }
//   console.log(test);

//   sudokuTest = test;
//   console.log(sudokuTest);
//   insertSudoku();
// });
