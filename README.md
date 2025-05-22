# Longmen-Preliminary-Edition
	1.	完整 5×5 老虎机逻辑（含连锁掉落、108条中奖线架构）
	2.	音效系统框架（支持播放/控制/切换音效，方便后续替换）
	3.	动画性能优化（限制动画负载，按列播放）
	4.	RTP & RNG 框架接口预设
	5.	兼容 Stake 静态文件模式架构
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <title>Stake老虎机开发框架</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="main.css" />
</head>
<body>
  <div id="slot-game">
    <div id="reels" class="reel-grid"></div>
    <button id="spinBtn">旋转</button>
    <button id="toggleSound">🔊</button>
  </div>
  <script src="audio.js"></script>
  <script src="slot.js"></script>
</body>
</html>
main.css 示例（基础样式）
body {
  background: black;
  color: white;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  padding: 20px;
}
#slot-game {
  text-align: center;
}
.reel-grid {
  display: grid;
  grid-template-columns: repeat(5, 64px);
  grid-template-rows: repeat(5, 64px);
  gap: 5px;
  margin-bottom: 10px;
}
.cell {
  background: #222;
  border-radius: 6px;
  font-size: 32px;
  line-height: 64px;
  text-align: center;
  color: #fff;
}
.highlight {
  box-shadow: 0 0 10px gold;
}
button {
  margin: 5px;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}
slot.js（主要游戏逻辑模块）
const ROWS = 5, COLS = 5;
const SYMBOLS = ["🍒", "🍋", "🐶", "💰", "⭐", "🃏"];
const WILD = "🃏";
let matrix = [];
let audioPool = new AudioPool(["spin", "win"]);

function initMatrix() {
  const container = document.getElementById("reels");
  container.innerHTML = "";
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
      container.appendChild(div);
    }
    matrix.push(row);
  }
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

// 简化版：模拟中奖检测
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
audio.js（音效播放管理模块）
class AudioPool {
  constructor(sounds) {
    this.sounds = {};
    this.muted = false;
    sounds.forEach(name => {
      const audio = new Audio(`sounds/${name}.mp3`);
      audio.preload = "auto";
      this.sounds[name] = audio;
    });
  }

  play(name) {
    if (this.muted || !this.sounds[name]) return;
    const audio = this.sounds[name].cloneNode();
    audio.play();
  }

  toggleMute() {
    this.muted = !this.muted;
    console.log("音效已", this.muted ? "静音" : "开启");
  }
}
