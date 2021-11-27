'use strict';

const MINE = '💣';
const FLAG = '🚩';
const LIFE = '💓';
const HINT = '💡';
const EMPTY = '';

var gBoard;
var gLevel = { size: 4, mines: 2 };
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
  hints: 3,
};
var gClickCount = 0;
var gGameInterval = null;
var gStartingTime;
var isHintClicked = false;

function initGame() {
  gBoard = buildBoard();
  renderBoard(gBoard, '.board-container');
  gGame.lives = 3;
  updateLives();
  gGame.hints = 3;
  updateHints();
  document.querySelector('.icon').innerHTML =
    "<img src='img/happy.jpg' height='50px' />";
}

function restart() {
  clearInterval(gGameInterval);
  gGameInterval = null;
  gGame.markedCount = 0;
  gClickCount = 0;
  gGame.shownCount = 0;
  gGame.secsPassed = 0;
  gGame.lives = 3;
  updateLives();
  gGame.hints = 3;
  updateHints();
  document.querySelector('.icon').innerHTML =
    "<img src='img/happy.jpg' height='50px' />";
  initGame();
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
        isMineRevealed: false,
      };
    }
  }
  return board;
}

function updateHints() {
  var strHints = '';
  var elHints = document.querySelector('.hint');
  if (gGame.hints) {
    for (var i = 1; i <= gGame.hints; i++) {
      var className = 'hint' + i;
      strHints += `<span class="${className}" onclick="hintMe(this)">${HINT}</span>`;
      elHints.innerHTML = strHints;
    }
  } else {
    elHints.innerText = '';
  }
}

function hintMe(elHint) {
  elHint.style.opacity = 0.4;
  isHintClicked = true;
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
        if (!cell.minesAroundCount) {
          strHTML += `<td class="${className}" id="num"
         data-i="${i}" data-j="${j}" data-inside="${EMPTY}"
        onclick="cellClicked(this,${i},${j})" oncontextmenu=" markFlag(this, ${i},${j})">
        ${''}</td>`;
        } else {
          strHTML += `<td class="${className}" id="num"
         data-i="${i}" data-j="${j}" data-inside="${cell.minesAroundCount}"
        onclick="cellClicked(this,${i},${j})" oncontextmenu=" markFlag(this, ${i},${j})">
        ${''}</td>`;
        }
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
  if (gClickCount > 1 && !gGame.isOn) {
    alert(
      'You have finished the game, if you want to play - click on  play again'
    );
    return;
  }
  var i = +elCell.getAttribute('data-i');
  var j = +elCell.getAttribute('data-j');
  if (gClickCount === 1) {
    startTimer();
    gGame.isOn = true;
    for (var x = 0; x < gLevel.mines; x++) {
      do {
        var idxI = getRandomIntInt(0, gLevel.size);
      } while (idxI === i);
      var idxJ = getRandomIntInt(0, gLevel.size);

      if (!gBoard[idxI][idxJ].isMine) {
        gBoard[idxI][idxJ].isMine = true;
      } else {
        idxI = getRandomIntInt(0, gLevel.size);
        gBoard[idxI][idxJ].isMine = true;
      }
    }

    for (var r = 0; r < gBoard.length; r++) {
      for (var c = 0; c < gBoard[0].length; c++) {
        gBoard[r][c].minesAroundCount = setMinesNegsCount(r, c, gBoard);
      }
    }
    console.table(gBoard);
    renderBoard(gBoard, '.board-container');
  }

  var inside = elCell.getAttribute('data-inside');
  elCell.innerText = inside;

  if (isHintClicked) {
    debugger;
    allNegs(i, j);
    setTimeout(() => {
      isHintClicked = false;
      allNegs(i, j);
    }, 1000);
  } else {
    if (inside === MINE) {
      // if (!elCell.classList.conatins('Mineclicked')) elCell.classList.add('Mineclicked');
      gGame.lives--;
      updateLives();
      gBoard[i][j].isMineRevealed = true;
    } else if (+inside === 0) {
      showNeg(i, j);
    } else {
      gBoard[i][j].isShown = true;
      elCell.innerText = inside;
      elCell.style.opacity = 0.7;
    }
  }
  checkGameOver();
}

function allNegs(iIdx, jIdx) {
  for (var i = iIdx - 1; i <= iIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = jIdx - 1; j <= jIdx + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      if (isHintClicked) {
        elCell.innerText = elCell.getAttribute('data-inside');
        gBoard[i][j].isShown = true;
      } else {
        elCell.innerText = '';
        gBoard[i][j].isShown = false;
      }
    }
  }
}

function showNeg(iIdx, jIdx) {
  for (var i = iIdx - 1; i <= iIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = jIdx - 1; j <= jIdx + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      if (gBoard[i][j].isMarked) continue;
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        elCell.innerText = elCell.getAttribute('data-inside');
        elCell.style.opacity = 0.7;
        gBoard[i][j].isShown = true;
      }
    }
  }
  checkGameOver();
}

function showAllMines(iIdx, jIdx) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine && i !== iIdx && j !== jIdx) {
        document.querySelector(`[data-i="${i}"][data-j="${j}"]`).innerText =
          MINE;
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
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        showAllMines(i, j);
      }
    }
    gGame.isOn = false;
  }
  var countShow = 0;
  var countFlagged = 0;
  var countShownMine = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isShown) countShow++;
      if (gBoard[i][j].isMarked) countFlagged++;
      if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) countShownMine++;
    }
  }
  if (countShow + countFlagged + countShownMine == gLevel.size ** 2) {
    clearInterval(gGameInterval);
    document.querySelector('.icon').innerHTML =
      "<img src='img/cool.jpg' height='50px' />";
    alert('You have won!');
  }
}

function markFlag(elCell) {
  const noContext = document.getElementById('noContextMenu');
  noContext.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  var i = elCell.getAttribute('data-i');
  var j = elCell.getAttribute('data-j');
  if (gBoard[i][j].isMineRevealed) return;
  if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    elCell.innerText = FLAG;
    gGame.markedCount++;
    gBoard[i][j].isMarked = true;
  } else if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
    elCell.innerText = '';
    gGame.markedCount--;
    gBoard[i][j].isMarked = false;
  } else if (!gBoard.isMine) {
    elCell.innerText = elCell.innerText === FLAG ? '' : FLAG;
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
