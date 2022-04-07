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

let sudoku, solved, columnSave, rowSave;
let duplicates = [];
// const original = JSON.parse(JSON.stringify(sudokuTest));

// dynamically insert rows
for (let i = 0; i <= 8; i++) {
  let html;
  for (let j = 0; j <= 8; j++) {
    html = `<td class="cell cell${j}"><input class="input input${j}" type="number" min="1" max="9" value=""></td>`;
    rows[i].innerHTML += html;
  }
}

// inserts sudoku array in HTML
const resetSudoku = () => {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      rows[row].childNodes[column].childNodes[0].value = "";
    }
  }
};

// checks, if row is correct
const checkRow = (row) => {
  const arr = [];
  let count = 0;
  const set = new Set();
  for (let column = 0; column < 9; column++) {
    // for marking
    arr.push([rows[row].childNodes[column].childNodes[0].value, row, column]);
    // console.log(arr);
    // for checking
    if (rows[row].childNodes[column].childNodes[0].value === "") {
      continue;
    }
    // for checking
    set.add(rows[row].childNodes[column].childNodes[0].value);
    count++;
  }
  // for marking
  for (let x = 1; x <= 9; x++) {
    arr.forEach((element) => {
      // console.log(element);
      if (element[0] === `${x}`) {
        duplicates.push([x, element[1], element[2]]);
      }
    });
  }
  // console.log(duplicates);
  // rowSave = row;
  // console.log(duplicates);
  // for checking
  if (set.size < count) {
    return false;
  }
  return true;
};

// checks, if column is correct
const checkColumn = (column) => {
  const arr = [];
  let count = 0;
  const set = new Set();
  for (let row = 0; row < 9; row++) {
    // for marking
    arr.push([rows[row].childNodes[column].childNodes[0].value, row, column]);
    // console.log(arr);
    // for checking
    if (rows[row].childNodes[column].childNodes[0].value === "") {
      continue;
    }
    // for checking
    set.add(rows[row].childNodes[column].childNodes[0].value);
    count++;
  }
  // for marking
  for (let x = 1; x <= 9; x++) {
    arr.forEach((element) => {
      if (element[0] === `${x}`) duplicates.push([x, element[1], element[2]]);
    });
  }

  // console.log(duplicates);
  // columnSave = column;
  // console.log(duplicates);
  // for checking
  if (set.size < count) {
    return false;
  }
  return true;
};

// checks, if block is currect
const checkBlock = (row, column) => {
  const arr = [];
  let count = 0;
  const set = new Set();
  const blockRow = Math.floor(row / 3) * 3;
  const blockColumn = Math.floor(column / 3) * 3;

  for (let row = blockRow; row < blockRow + 3; row++) {
    for (let column = blockColumn; column < blockColumn + 3; column++) {
      // for marking
      arr.push([rows[row].childNodes[column].childNodes[0].value, row, column]);
      // console.log(arr);
      // for checking
      if (rows[row].childNodes[column].childNodes[0].value === "") {
        continue;
      }
      // for checking
      set.add(rows[row].childNodes[column].childNodes[0].value);
      count++;
    }
  }
  // for marking
  for (let x = 1; x <= 9; x++) {
    arr.forEach((element) => {
      if (element[0] === `${x}`) {
        duplicates.push([x, element[1], element[2]]);
      }
    });
  }
  // console.log(duplicates);
  // for checking
  if (set.size < count) {
    return false;
  }
  return true;
};

const mark = () => {
  // if (flag === "row") {
  for (let i = 0; i < duplicates.length - 1; i++) {
    if (duplicates[i][0] === duplicates[i + 1][0]) {
      document
        .querySelector(`.row${duplicates[i][1] + 1}`)
        .querySelector(`.input${duplicates[i][2]}`).style.backgroundColor =
        "red";
      document
        .querySelector(`.row${duplicates[i + 1][1] + 1}`)
        .querySelector(`.input${duplicates[i + 1][2]}`).style.backgroundColor =
        "red";
    }
  }
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
  let flag = true;
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (!checkBlock(row, column)) {
        mark();
        duplicates = [];
        flag = false;
      }
      if (!checkRow(row)) {
        mark();
        duplicates = [];
        flag = false;
      }
      if (!checkColumn(column)) {
        mark();
        duplicates = [];
        flag = false;
      }
      if (!flag) return false;
    }
  }
  return true;
};

// freeze when value is not empty
const freeze = () => {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (rows[row].childNodes[column].childNodes[0].value != "") {
        rows[row].childNodes[column].childNodes[0].readOnly = true;
      }
    }
  }
};

buttonSolve.addEventListener("click", function () {
  if (checkAll()) solve();
});

buttonReset.addEventListener("click", function () {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      rows[row].childNodes[column].childNodes[0].readOnly = false;
    }
  }
  resetSudoku(false);
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      document
        .querySelector(`.row${row + 1}`)
        .querySelector(`.input${column}`).style.backgroundColor =
        " rgb(51, 51, 51)";
    }
  }
  duplicates = [];
});

document.querySelectorAll("input").forEach((el) => {
  el.addEventListener("change", () => {
    checkAll();
  });
  el.addEventListener("keyup", () => {
    checkAll();
  });
});
