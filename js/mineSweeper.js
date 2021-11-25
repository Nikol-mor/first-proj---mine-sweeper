'use strict';

const MINE = '💣';
const FLAG = '🚩';
const LIFE = '🤍';

var gBoard;
var gLevel = { size: 4, mines: 2 };
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
};
var gClickCount = 0;
var gGameInterval = null;
var gStartingTime;

function initGame() {
  gBoard = buildBoard();
  renderBoard(gBoard, '.board-container');
  gGame.lives = 3;
  updateLives();
  document.querySelector('.icon').innerHTML =
    "<img src='img/happy.jpg' height='50px' />";
}

function updateLives() {
  var strLives = '';
  var elLives = document.querySelector('.life');
  if (gGame.lives) {
    for (var i = 0; i < gGame.lives; i++) {
      strLives += LIFE;
      elLives.innerText = strLives;
    }
  } else {
    elLives.innerText = '';
  }
}

function buildBoard() {
  var board = [];

  for (var i = 0; i < gLevel.size; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: '',
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }

  for (var i = 0; i < gLevel.mines; i++) {
    var idxI = getRandomIntInt(0, gLevel.size);
    var idxJ = getRandomIntInt(0, gLevel.size);
    console.log('idxI ', idxI);
    console.log('idxJ ', idxJ);
    if (!board[idxI][idxJ].isMine) {
      board[idxI][idxJ].isMine = true;
    } else {
      idxI = getRandomIntInt(0, gLevel.size);
      board[idxI][idxJ].isMine = true;
    }
  }

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      board[i][j].minesAroundCount = setMinesNegsCount(i, j, board);
    }
  }
  console.table(board);
  return board;
}

function renderBoard(mat, selector) {
  var strHTML = '<table border="1" align="center"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + j;
      if (cell.isMine) {
        strHTML += `<td class="${className}" id="mine"
         data-i="${i}" data-j="${j}" data-inside="${MINE}"
            onclick="cellClicked(this,${i},${j})" oncontextmenu=" markFlag(this, ${i},${j})">
            ${''}</td>`;
      } else {
        strHTML += `<td class="${className}" id="num"
         data-i="${i}" data-j="${j}" data-inside="${setMinesNegsCount(
          i,
          j,
          gBoard
        )}"
        onclick="cellClicked(this,${i},${j})" oncontextmenu=" markFlag(this, ${i},${j})">
        ${''}</td>`;
      }
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(cellI, cellJ, board) {
  var negsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > board[i].length - 1) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) negsCount++;
    }
  }
  return negsCount;
}

function cellClicked(elCell) {
  gClickCount++;
  if (gClickCount > 1 && !gGame.isOn)
    alert(
      'You have finished the game, if you want to play - click on  play again'
    );
  if (gClickCount === 1) {
    startTimer();
    gGame.isOn = true;
  }
  //   console.log('gClickCount ', gClickCount);
  var i = elCell.getAttribute('data-i');
  var j = elCell.getAttribute('data-j');
  var inside = elCell.getAttribute('data-inside');
  //   console.log('clicked data-i ', i);
  //   console.log('clicked data-j ', j);
  //   console.log('clicked inside ', inside);
  //   if (elCell.classList.contains('clicked')) {
  //     return;
  //   } else {
  //     elCell.classList.add('clicked');
  //   }
  elCell.innerText = inside;
  //   console.log('inside ', inside);
  if (inside === MINE) {
    // document.querySelector('#mine').innerText = inside;
    gGame.lives--;
    updateLives();
    // showAllMines(i, j);
    // console.log('lose');
    // alert('Game over, you have lost.. You are welcome for another game😏');
  } else if (+inside === 0) {
    //   console.log('gBoard[i][j] that has 0 mines', gBoard[i][j]);
    //   console.log('showneg: i ', i);
    //   console.log('showneg: j ', j);

    showNeg(i, j);
  } else {
    // console.log('elcell innertext = inside', elCell);
    // console.log('inside', inside);
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    elCell.innerText = inside; ///  ?
    // if (inside === 0)
  }
  checkGameOver();
}

function showNeg(iIdx, jIdx) {
  for (var i = iIdx - 1; i <= iIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = jIdx - 1; j <= jIdx + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      if (gBoard[i][j].isMarked) continue;
      //   if (i === iIdx && j === jIdx) continue;
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        // var cell = gBoard[i][j].minesAroundCount;
        //   console.log('surrounding cell ', cell);
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        //   console.log('elCell', elCell);
        elCell.innerText = elCell.getAttribute('data-inside');
        // console.log('elCell.inside ', elCell.getAttribute('data-inside'));
        // console.log('elCell post innerText ', elCell);
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
      }
    }
  }
  checkGameOver();
}

function showAllMines(iIdx, jIdx) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine && i !== iIdx && j !== jIdx) {
        // document.querySelector('#mine').innerText = MINE;
        document.querySelector(`[data-i="${i}"][data-j="${j}"]`).innerText =
          MINE;
        // gGame.shownCount++;
        // gBoard[i][j].isMarked = true;
        // gGame.markedCount++;
      }
    }
  }
  clearInterval(gGameInterval);
  gGame.isOn = false;
}

function checkGameOver() {
  if (!gGame.lives) {
    alert('You have lost all the lives you had, sorry..');
    document.querySelector('.icon').innerHTML =
      "<img src='img/sad.jpg' height='50px' />";
    clearInterval(gGameInterval);
  }
  console.log('gGame.shownCount', gGame.shownCount);
  if (
    // gGame.markedCount === gLevel.mines &&
    gGame.shownCount ===
    gLevel.size ** 2 - gLevel.mines
  ) {
    document.querySelector('.icon').innerHTML =
      "<img src='img/cool.jpg' height='50px' />";
    clearInterval(gGameInterval);
    alert('You have won!');
  }
  // var count = 0;
  // for (var i = 0; i < gBoard.length; i++) {
  //   for (var j = 0; j < gBoard[0].length; j++) {
  //     if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
  //       count++;
  //     }
  //   }
  // }
  // if (count === gLevel.mines) {
  //   clearInterval(gGameInterval);
  //   alert('Well done, You are victorious😎');
  //   gGame.isOn = false;
  // }
}

function markFlag(elCell) {
  const noContext = document.getElementById('noContextMenu');
  noContext.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  var i = elCell.getAttribute('data-i');
  var j = elCell.getAttribute('data-j');
  if (gBoard[i][j].isMine) gGame.markedCount++;
  if (!gBoard[i][j].isMarked) {
    elCell.innerText = FLAG;
    gBoard[i][j].isMarked = true;
  } else {
    elCell.innerText = '';
    gBoard[i][j].isMarked = false;
    if (gBoard[i][j].isMine) gGame.markedCount--;
  }
  checkGameOver();
}

function changeLevel(elBtn) {
  gLevel.size = +elBtn.getAttribute('data-level');
  console.log('size', gLevel.size);
  gLevel.mines = changeMines(gLevel.size);
  console.log('changeMines', changeMines(gLevel.size));
  console.log('mines', gLevel.mines);
  restart();
}

function changeMines(level) {
  if (level === 4) {
    return 2;
  } else if (level === 8) {
    return 12;
  } else if (level === 12) {
    return 30;
  }
}

function restart() {
  clearInterval(gGameInterval);
  gGameInterval = null;
  gGame.markedCount = 0;
  gClickCount = 0;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gGame.lives = 3;
  document.querySelector('.icon').innerHTML =
    "<img src='img/happy.jpg' height='50px' />";
  updateLives();
  initGame();
}
