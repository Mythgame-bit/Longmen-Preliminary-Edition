const ROWS = 5, COLS = 5;
const SYMBOLS = ["🍒", "🍋", "🐶", "💰", "⭐", "🃏"];
const WILD = "🃏";
let matrix = [];
let audioPool = new AudioPool(["spin", "win"]);

function initMatrix() {
  const container = document.getElementById("reels");
  const fragment = document.createDocumentFragment();
  matrix = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      let sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      row.push(sym);
      const div = document.createElement("div");
      div.className = "cell";
      div.id = `cell-${r}-${c}`;
      div.innerText = sym;
      fragment.appendChild(div);
    }
    matrix.push(row);
  }
  container.innerHTML = ""; // 清空容器
  container.appendChild(fragment); // 一次性渲染
}

function updateDisplay() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let cell = document.getElementById(`cell-${r}-${c}`);
      cell.innerText = matrix[r][c];
      cell.classList.remove("highlight");
    }
  }
}

function getWinningPositions() {
  const wins = [];
  for (let r = 0; r < ROWS; r++) {
    if (matrix[r][0] === matrix[r][1] && matrix[r][1] === matrix[r][2]) {
      wins.push([r, 0], [r, 1], [r, 2]);
    }
  }
  return wins;
}

function highlightWins(wins) {
  wins.forEach(([r, c]) => {
    document.getElementById(`cell-${r}-${c}`).classList.add("highlight");
  });
}

document.getElementById("spinBtn").onclick = async () => {
  audioPool.play("spin");
  initMatrix();
  updateDisplay();
  const wins = getWinningPositions();
  if (wins.length > 0) {
    audioPool.play("win");
    highlightWins(wins);
  }
};

document.getElementById("toggleSound").onclick = () => {
  audioPool.toggleMute();
};

window.onload = () => {
  initMatrix();
};
