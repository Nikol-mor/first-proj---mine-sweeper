/*****************TIMER****************/

function startTimer() {
  gStartingTime = new Date().getTime();
  gGameInterval = setInterval(timer, 600);
}

function timer() {
  var now = new Date().getTime();
  var timer = (now - gStartingTime) / 1000;
  var elTime = document.getElementById('timer');
  elTime.innerText = `${timer}`;
}

// another timer

// gGameInterval = setInterval(startTimer, 100);
function startTimer2() {
  var timer = document.querySelector('.time');
  var milisec = 0;
  var sec = 0;
  var min = 0;
  milisec++;
  if (milisec > 9) {
    sec++;
    milisec = 0;
  }
  if (sec > 59) {
    min++;
    sec = 0;
  }
  timer.innerText =
    (min < 10 ? '0' + min : min) +
    ':' +
    (sec < 10 ? '0' + sec : sec) +
    ':' +
    '0' +
    milisec;
}

/**used in pacman */

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getEmptyCell(board) {
  var emptyCells = [];

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell === EMPTY) {
        var emptyCellPos = { i, j };
        emptyCells.push(emptyCellPos);
      }
    }
  }
  var randomIdx = getRandomIntInt(0, emptyCells.length);
  var emptyCell = emptyCells[randomIdx];
  return emptyCell;
}

/************************************************ */
function playSound() {
  var audio = new Audio('sounds/Ball Collected.wav');
  audio.play();
}

//used in ball board (with the green creature)

// const GAMER_IMG = '<img src="img/gamer.png" />';
// function renderBoard(board) {

// 	var strHTML = '';
// 	for (var i = 0; i < board.length; i++) {
// 		strHTML += '<tr>';
// 		for (var j = 0; j < board[0].length; j++) {
// 			var currCell = board[i][j];

// 			var cellClass = getClassName({ i: i, j: j })
// 			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall';

// 			strHTML += `<td class="cell ${cellClass}"
// 			 onclick="moveTo('${i}','${j}')" >`;

// 			switch (currCell.gameElement) {
// 				case GAMER:
// 					strHTML += GAMER_IMG;
// 					break;
// 				case BALL:
// 					strHTML += BALL_IMG;
// 					break;
// 			}
// 			strHTML += '</td>';
// 		}
// 		strHTML += '</tr>';
// 	}
// 	var elBoard = document.querySelector('.board');
// 	elBoard.innerHTML = strHTML;
// }
// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}
/************************************************* */

function printMat(mat, selector) {
  var strHTML = '<table border="1" align="center"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>';
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function copyMat(mat) {
  var newMat = [];
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = [];
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j];
    }
  }
  return newMat;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawNum() {
  return gNums.pop();
}

function shuffle(items) {
  var randIdx, keep;
  for (var i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);

    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}

function drawNum2() {
  var idx = getRandomInt(0, gNums2.length);
  var num = gNums2[idx];
  gNums2.splice(idx, 1);
  return num;
}

function printPrimaryDiagonal(squareMat) {
  for (var d = 0; d < squareMat.length; d++) {
    var item = squareMat[d][d];
    console.log(item);
  }
}

// printSecondaryDiagonal(gMat)

function printSecondaryDiagonal(squareMat) {
  for (var d = 0; d < squareMat.length; d++) {
    var item = squareMat[d][squareMat.length - d - 1];
    console.log(item);
  }
}

function countInSecondaryDiagonal(board, symbol) {
  var count = 0;
  for (var i = 0; i < board.length; i++) {
    var cell = board[i][board.length - 1 - i];
    if (cell === symbol) count++;
  }
  return count;
}

function countInPrimaryDiagonal(board, symbol) {
  var count = 0;
  for (var i = 0; i < board.length; i++) {
    var cell = board[i][i];
    if (cell === symbol) count++;
  }
  return count;
}

function countInCol(board, colIdx, symbol) {
  var count = 0;
  for (var i = 0; i < board.length; i++) {
    var cell = board[i][colIdx];
    if (cell === symbol) count++;
  }
  return count;
}

function countInRow(board, rowIdx, symbol) {
  var count = 0;
  var row = board[rowIdx];
  for (var i = 0; i < row.length; i++) {
    var cell = row[i];
    if (cell === symbol) count++;
  }
  return count;
}

function countNegs(cellI, cellJ, mat) {
  var negsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > mat[i].length - 1) continue;
      if (i === cellI && j === cellJ) continue;
      // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++;
      if (mat[i][j]) negsCount++;
    }
  }
  return negsCount;
}

function sumCol(mat, colIdx) {
  var sum = 0;
  for (var i = 0; i < mat.length; i++) {
    sum += mat[i][colIdx];
  }
  return sum;
}

function sumRow(mat, rowIdx) {
  var sum = 0;
  for (var j = 0; j < mat[0].length; j++) {
    mat[rowIdx][j];
  }
  return sum;
}

function createMat(ROWS, COLS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}
