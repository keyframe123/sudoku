'use strict';

class SudokuApp {
	constructor() {
		this.buttonSolve = document.querySelector('.solve');
		this.buttonReset = document.querySelector('.reset');
		this.buttonFreeze = document.querySelector('.freeze');
		this.buttonHint = document.querySelector('.hint');

		this.rows = [
			document.querySelector('.row1'),
			document.querySelector('.row2'),
			document.querySelector('.row3'),
			document.querySelector('.row4'),
			document.querySelector('.row5'),
			document.querySelector('.row6'),
			document.querySelector('.row7'),
			document.querySelector('.row8'),
			document.querySelector('.row9'),
		];

		this.grid = Array.from({ length: 9 }, () => Array(9).fill(0));
		this.savedPos = [];
		this.freezeFlag = true;

		this._initializeGridCells();

		this.allCellInputs = document.querySelectorAll('.cell input');

		this._bindEvents();
	}

	_initializeGridCells() {
		for (let i = 0; i <= 8; i++) {
			let html;
			for (let j = 0; j <= 8; j++) {
				html = `<td class="cell cell${j}"><input class="input input${j}" inputmode="numeric" type="number" min="1" max="9" value=""></td>`;
				this.rows[i].innerHTML += html;
			}
		}
	}

	loadFromDom() {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const value = parseInt(this.rows[row].children[col].children[0].value, 10) || 0;
				this.grid[row][col] = value;
			}
		}
	}

	dumpToDom(reset = false) {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				this.rows[row].children[col].children[0].value = reset ? '' : this.grid[row][col] || '';
			}
		}
	}

	resetSudoku() {
		this.resetColors();
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				this.grid[row][col] = 0;
			}
		}
		this.dumpToDom(true);
	}

	checkRow(row, isDone = true) {
		const seen = [];
		for (let column = 0; column < 9; column++) {
			const value = this.grid[row][column];
			if (!value) {
				continue;
			}

			if (seen[value] !== undefined) {
				if (!isDone) {
					this.mark(...seen[value]);
				}
				return false;
			}

			seen[value] = [row, column];
		}

		return true;
	}

	checkColumn(column, isDone = true) {
		const seen = [];
		for (let row = 0; row < 9; row++) {
			const value = this.grid[row][column];
			if (!value) continue;
			if (seen[value] !== undefined) {
				if (!isDone) {
					this.mark(...seen[value]);
				}
				return false;
			}
			seen[value] = [row, column];
		}

		return true;
	}

	checkBlock(row, column, isDone = true) {
		const seen = [];
		const blockRow = Math.floor(row / 3) * 3;
		const blockColumn = Math.floor(column / 3) * 3;
		for (let r = blockRow; r < blockRow + 3; r++) {
			for (let c = blockColumn; c < blockColumn + 3; c++) {
				const value = this.grid[r][c];
				if (!value) continue;
				if (seen[value] !== undefined) {
					if (!isDone) {
						this.mark(...seen[value]);
					}
					return false;
				}
				seen[value] = [r, c];
			}
		}

		return true;
	}

	mark(row, col) {
		const cellInput = this.rows[row].querySelector(`.input${col}`);
		if (cellInput) cellInput.style.backgroundColor = 'red';
	}

	solve() {
		for (let row = 0; row < 9; row++) {
			for (let column = 0; column < 9; column++) {
				if (this.grid[row][column] === 0) {
					for (let n = 1; n <= 9; n++) {
						this.grid[row][column] = n;
						if (
							this.checkRow(row) &&
							this.checkColumn(column) &&
							this.checkBlock(row, column) &&
							this.solve()
						) {
							return true;
						} else {
							this.grid[row][column] = 0;
						}
					}

					return false;
				}
			}
		}

		return true;
	}

	checkAll(isDone = true) {
		for (let i = 0; i < 9; i++) {
			if (!this.checkRow(i, isDone)) {
				return false;
			}
			if (!this.checkColumn(i, isDone)) {
				return false;
			}
			for (let j = 0; j < 9; j++) {
				if (!this.checkBlock(i, j, isDone)) {
					return false;
				}
			}
		}

		return true;
	}

	resetColors() {
		this.allCellInputs.forEach(el => {
			el.style.backgroundColor = 'rgb(51, 51, 51)';
		});
	}

	showHint() {
		const original = structuredClone(this.grid);
		this.saveFirstEmpty();
		this.solve();
		const solvedPoint = this.grid[this.savedPos[0]][this.savedPos[1]];
		for (let row = 0; row < 9; row++) {
			for (let column = 0; column < 9; column++) {
				this.grid[row][column] = original[row][column];
			}
		}
		this.grid[this.savedPos[0]][this.savedPos[1]] = solvedPoint;
	}

	saveFirstEmpty() {
		for (let row = 0; row < 9; row++) {
			for (let column = 0; column < 9; column++) {
				if (this.grid[row][column] === 0) {
					this.savedPos = [row, column];
					return true;
				}
			}
		}

		return false;
	}

	freeze() {
		if (this.freezeFlag) {
			for (let row = 0; row < 9; row++) {
				for (let column = 0; column < 9; column++) {
					if (this.grid[row][column] !== 0) {
						this.rows[row].children[column].children[0].readOnly = true;
					}
				}
			}
			this.freezeFlag = false;
			this.buttonFreeze.innerHTML = 'Freeze on';

			return false;
		} else {
			for (let row = 0; row < 9; row++) {
				for (let column = 0; column < 9; column++) {
					if (this.grid[row][column] != 0) {
						this.rows[row].children[column].children[0].readOnly = false;
					}
				}
			}
			this.freezeFlag = true;
			this.buttonFreeze.innerHTML = 'Freeze off';

			return true;
		}
	}

	_bindEvents() {
		this.buttonSolve.addEventListener('click', () => {
			this.loadFromDom();
			console.log(this.grid);
			if (this.checkAll()) {
				this.solve();
				this.dumpToDom();
			}
		});

		this.buttonReset.addEventListener('click', () => {
			for (let row = 0; row < 9; row++) {
				for (let column = 0; column < 9; column++) {
					this.rows[row].children[column].children[0].readOnly = false;
				}
			}
			this.resetSudoku();
			this.savedPos = [];
		});

		this.buttonFreeze.addEventListener('click', () => {
			this.loadFromDom();
			this.freeze();
		});

		this.buttonHint.addEventListener('click', () => {
			this.loadFromDom();
			this.showHint();
			this.dumpToDom();
		});

		// Validate on change
		this.allCellInputs.forEach(el => {
			el.addEventListener('change', () => {
				this.loadFromDom();
				if (this.checkAll(false)) {
					this.resetColors();
				}
			});
		});
	}
}

new SudokuApp();
