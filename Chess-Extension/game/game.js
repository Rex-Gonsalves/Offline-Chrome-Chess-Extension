"use strict";

/* =========================================================================
   1. BESPOKE 16x16 PIXEL-ART STAUNTON PIECES (1-Bit Crisp SVG Generator)
   - White pieces: bright white fill (#ffffff) + crisp black outline (#111111)
   - Black pieces: pitch-black fill (#111111) + 1px white inner detail lines
     + automatic 1px off-white outer halo (#f4f4f0) so every piece pops on
     both white squares and 1-bit dithered dark squares.
========================================================================== */
const PIXEL_MATRICES = {
  /* White Pawn (1) */
  1: [
    "................",
    "................",
    "......####......",
    ".....#WWWW#.....",
    ".....#WWWW#.....",
    "......####......",
    ".....#WWWW#.....",
    "......####......",
    "......#WW#......",
    ".....#WWWW#.....",
    ".....#WWWW#.....",
    "....#WWWWWW#....",
    "...##########...",
    "..#WWWWWWWWWW#..",
    "..############..",
    "................"
  ],
  /* White Knight (2) */
  2: [
    "................",
    "......###.......",
    ".....#WWW##.....",
    "....#WW#WWW#....",
    "...#WWWWWWWW#...",
    "..#WWWWWWWWWW#..",
    "..#WW###WWWWW#..",
    "..###..#WWWWW#..",
    ".......#WWWWW#..",
    "......#WWWWWW#..",
    ".....#WWWWWWW#..",
    "....#WWWWWWWW#..",
    "...##########...",
    "..#WWWWWWWWWW#..",
    "..############..",
    "................"
  ],
  /* White Bishop (3) */
  3: [
    ".......##.......",
    "......#WW#......",
    ".......##.......",
    ".....######.....",
    "....#WW#WWW#....",
    "...#WWW#WWWW#...",
    "...#WW###WWW#...",
    "...#WWW#WWWW#...",
    "....#WWWWWW#....",
    ".....######.....",
    ".....#WWWW#.....",
    "....#WWWWWW#....",
    "...##########...",
    "..#WWWWWWWWWW#..",
    "..############..",
    "................"
  ],
  /* White Rook (4) */
  4: [
    "................",
    "..###..##..###..",
    "..#W####W###W#..",
    "..#WWWWWWWWWW#..",
    "..#WWWWWWWWWW#..",
    "...##########...",
    "....#WWWWWW#....",
    "....#WWWWWW#....",
    "....#WWWWWW#....",
    "....#WWWWWW#....",
    "....#WWWWWW#....",
    "...#WWWWWWWW#...",
    "..############..",
    "..#WWWWWWWWWW#..",
    "..############..",
    "................"
  ],
  /* White Queen (5) */
  5: [
    "................",
    "..#...#..#...#..",
    ".#W#.#W##W#.#W#.",
    "..#W##WWWW##W#..",
    "..#WWWWWWWWWW#..",
    "..#WWWWWWWWWW#..",
    "...#WWWWWWWW#...",
    "...#WWWWWWWW#...",
    "....########....",
    "....#WWWWWW#....",
    "....#WWWWWW#....",
    "...#WWWWWWWW#...",
    "..############..",
    "..#WWWWWWWWWW#..",
    "..############..",
    "................"
  ],
  /* White King (6) */
  6: [
    ".......##.......",
    ".....######.....",
    ".......##.......",
    "....########....",
    "...#WW####WW#...",
    "..#WWWW##WWWW#..",
    "..#WWWW##WWWW#..",
    "...#WWWWWWWW#...",
    "....########....",
    "....#WWWWWW#....",
    "....#WWWWWW#....",
    "...#WWWWWWWW#...",
    "..############..",
    "..#WWWWWWWWWW#..",
    "..############..",
    "................"
  ],
  /* Black Pawn (9) */
  9: [
    "................",
    "................",
    "......####......",
    ".....######.....",
    ".....######.....",
    "......####......",
    ".....#WWWW#.....",
    "......####......",
    "......####......",
    ".....######.....",
    ".....######.....",
    "....########....",
    "...#WWWWWWWW#...",
    "..############..",
    "..############..",
    "................"
  ],
  /* Black Knight (10) */
  10: [
    "................",
    "......###.......",
    ".....######.....",
    "....###W####....",
    "...########W#...",
    "..##########W#..",
    "..##########W#..",
    "..###..#####W#..",
    ".......######...",
    "......#######...",
    ".....########...",
    "....#########...",
    "...#WWWWWWWW#...",
    "..############..",
    "..############..",
    "................"
  ],
  /* Black Bishop (11) */
  11: [
    ".......##.......",
    "......####......",
    ".......##.......",
    ".....######.....",
    "....###W####....",
    "....###W####....",
    "...###WWW####...",
    "...####W#####...",
    "....########....",
    ".....#WWWW#.....",
    ".....######.....",
    "....########....",
    "...#WWWWWWWW#...",
    "..############..",
    "..############..",
    "................"
  ],
  /* Black Rook (12) */
  12: [
    "................",
    "..###..##..###..",
    "..############..",
    "..############..",
    "..#WWWWWWWWWW#..",
    "...##########...",
    "....########....",
    "....########....",
    "....########....",
    "....########....",
    "....########....",
    "...##########...",
    "..#WWWWWWWWWW#..",
    "..############..",
    "..############..",
    "................"
  ],
  /* Black Queen (13) */
  13: [
    "................",
    "..#...#..#...#..",
    ".####.####.####.",
    "..############..",
    "..##W##WW##W##..",
    "..############..",
    "...##########...",
    "...##########...",
    "....#WWWWWW#....",
    "....########....",
    "....########....",
    "...##########...",
    "..#WWWWWWWWWW#..",
    "..############..",
    "..############..",
    "................"
  ],
  /* Black King (14) */
  14: [
    ".......##.......",
    ".....######.....",
    ".......##.......",
    "....########....",
    "...####WW####...",
    "..#####WW#####..",
    "..#####WW#####..",
    "...##########...",
    "....#WWWWWW#....",
    "....########....",
    "....########....",
    "...##########...",
    "..#WWWWWWWWWW#..",
    "..############..",
    "..############..",
    "................"
  ]
};

function buildPixelSvg(pieceId) {
  const rows = PIXEL_MATRICES[pieceId];
  const isBlack = pieceId >= 8;
  let haloRects = "";
  let blackRects = "";
  let whiteRects = "";

  /* 18x18 canvas with 1px margin so halo never clips */
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const ch = rows[y][x];
      if (ch === "#") {
        blackRects += `<rect x="${x + 1}" y="${y + 1}" width="1" height="1"/>`;
        if (isBlack) {
          /* 1px white halo around every black piece pixel */
          haloRects += `<rect x="${x}" y="${y + 1}" width="3" height="1"/><rect x="${x + 1}" y="${y}" width="1" height="3"/>`;
        }
      } else if (ch === "W") {
        whiteRects += `<rect x="${x + 1}" y="${y + 1}" width="1" height="1"/>`;
      }
    }
  }

  return `<svg viewBox="0 0 18 18" shape-rendering="crispEdges">` +
    (haloRects ? `<g fill="#f4f4f0">${haloRects}</g>` : "") +
    `<g fill="#111111">${blackRects}</g>` +
    (whiteRects ? `<g fill="#ffffff">${whiteRects}</g>` : "") +
    `</svg>`;
}

const PIECE_SVGS = {};
for (const id of [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]) {
  PIECE_SVGS[id] = buildPixelSvg(id);
}

/* =========================================================================
   2. 8-BIT RETRO WEB AUDIO SYNTHESIZER (Zero External Files)
========================================================================== */
const RetroAudio = (() => {
  let ctx = null;

  function ensureCtx() {
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function blip(type, f1, f2, dur, vol, delay = 0) {
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f1, t);
    if (f2 !== f1) osc.frequency.setValueAtTime(f2, t + dur * 0.5);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  return {
    move()    { blip("square", 320, 240, 0.045, 0.06); },
    capture() { blip("square", 220, 110, 0.075, 0.09); blip("triangle", 520, 320, 0.04, 0.07, 0.02); },
    castle()  { blip("square", 280, 280, 0.04, 0.06, 0); blip("square", 420, 420, 0.05, 0.06, 0.065); },
    check()   { blip("square", 660, 880, 0.11, 0.08); },
    gameOver(){ blip("square", 440, 440, 0.09, 0.07, 0); blip("square", 554, 554, 0.09, 0.07, 0.1); blip("square", 659, 659, 0.18, 0.08, 0.2); }
  };
})();

/* =========================================================================
   3. COMPLETE CLIENT-SIDE CHESS RULES (0x88, Castling, EP, Promo, Draws)
========================================================================== */
const EMPTY = 0, PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;
const WHITE = 0, BLACK = 8;
const WP = 1, WN = 2, WB = 3, WR = 4, WQ = 5, WK = 6;
const BP = 9, BN = 10, BB = 11, BR = 12, BQ = 13, BK = 14;
const FLAG_DOUBLE = 1, FLAG_EP = 2, FLAG_CASTLE = 4;

const KNIGHT_DIRS = [-33, -31, -18, -14, 14, 18, 31, 33];
const KING_DIRS   = [-17, -16, -15, -1, 1, 15, 16, 17];
const BISHOP_DIRS = [-17, -15, 15, 17];
const ROOK_DIRS   = [-16, -1, 1, 16];
const QUEEN_DIRS  = [-17, -16, -15, -1, 1, 15, 16, 17];

const CASTLE_MASK = new Uint8Array(128).fill(15);
CASTLE_MASK[0x00] = 7;  CASTLE_MASK[0x04] = 3;  CASTLE_MASK[0x07] = 11;
CASTLE_MASK[0x70] = 13; CASTLE_MASK[0x74] = 12; CASTLE_MASK[0x77] = 14;

class ChessGame {
  constructor() {
    this.board = new Int8Array(128);
    this.kingSq = [0x74, 0x04];
    this.reset();
  }

  reset() {
    this.board.fill(EMPTY);
    const bW = [WR, WN, WB, WQ, WK, WB, WN, WR];
    const bB = [BR, BN, BB, BQ, BK, BB, BN, BR];
    for (let f = 0; f < 8; f++) {
      this.board[0x00 | f] = bB[f];
      this.board[0x10 | f] = BP;
      this.board[0x60 | f] = WP;
      this.board[0x70 | f] = bW[f];
    }
    this.kingSq = [0x74, 0x04];
    this.side = WHITE;
    this.castle = 15;
    this.epSq = -1;
    this.halfmove = 0;
    this.history = [];
    this.positionCounts = new Map();
    this.recordPosition();
  }

  positionKey() {
    let s = "";
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) s += String.fromCharCode(65 + this.board[(r << 4) | f]);
    }
    return `${s}|${this.side}|${this.castle}|${this.epSq}`;
  }

  recordPosition() {
    const k = this.positionKey();
    this.positionCounts.set(k, (this.positionCounts.get(k) || 0) + 1);
  }

  sqToAlg(sq) {
    return String.fromCharCode(97 + (sq & 7)) + String.fromCharCode(56 - (sq >> 4));
  }

  moveToUci(m) {
    let s = this.sqToAlg(m.from) + this.sqToAlg(m.to);
    if (m.promo) s += ["", "", "n", "b", "r", "q"][m.promo];
    return s;
  }

  isSquareAttacked(sq, bySide) {
    if (bySide === WHITE) {
      let s = sq + 15; if (!(s & 0x88) && this.board[s] === WP) return true;
      s = sq + 17; if (!(s & 0x88) && this.board[s] === WP) return true;
    } else {
      let s = sq - 15; if (!(s & 0x88) && this.board[s] === BP) return true;
      s = sq - 17; if (!(s & 0x88) && this.board[s] === BP) return true;
    }
    const nP = bySide | KNIGHT;
    for (let i = 0; i < 8; i++) { const s = sq + KNIGHT_DIRS[i]; if (!(s & 0x88) && this.board[s] === nP) return true; }
    const kP = bySide | KING;
    for (let i = 0; i < 8; i++) { const s = sq + KING_DIRS[i]; if (!(s & 0x88) && this.board[s] === kP) return true; }
    const bP = bySide | BISHOP, qP = bySide | QUEEN;
    for (let i = 0; i < 4; i++) {
      let s = sq + BISHOP_DIRS[i];
      while (!(s & 0x88)) { const p = this.board[s]; if (p) { if (p === bP || p === qP) return true; break; } s += BISHOP_DIRS[i]; }
    }
    const rP = bySide | ROOK;
    for (let i = 0; i < 4; i++) {
      let s = sq + ROOK_DIRS[i];
      while (!(s & 0x88)) { const p = this.board[s]; if (p) { if (p === rP || p === qP) return true; break; } s += ROOK_DIRS[i]; }
    }
    return false;
  }

  inCheck(color = this.side) {
    return this.isSquareAttacked(this.kingSq[color >> 3], color ^ 8);
  }

  generateLegalMoves() {
    const moves = [];
    const us = this.side, them = us ^ 8;
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sq = (r << 4) | f, p = this.board[sq];
        if (!p || (p & 8) !== us) continue;
        const pt = p & 7;

        if (pt === PAWN) {
          const dir = us === WHITE ? -16 : 16;
          const startRank = us === WHITE ? 6 : 1;
          const promoRank = us === WHITE ? 1 : 6;
          const to = sq + dir;
          if (!this.board[to]) {
            if (r === promoRank) {
              for (const pr of [QUEEN, ROOK, BISHOP, KNIGHT]) moves.push({ from: sq, to, cap: 0, promo: pr, flags: 0 });
            } else {
              moves.push({ from: sq, to, cap: 0, promo: 0, flags: 0 });
              if (r === startRank && !this.board[to + dir]) moves.push({ from: sq, to: to + dir, cap: 0, promo: 0, flags: FLAG_DOUBLE });
            }
          }
          for (const d of (us === WHITE ? [-17, -15] : [15, 17])) {
            const cSq = sq + d;
            if (cSq & 0x88) continue;
            const t = this.board[cSq];
            if (t && (t & 8) === them) {
              if (r === promoRank) {
                for (const pr of [QUEEN, ROOK, BISHOP, KNIGHT]) moves.push({ from: sq, to: cSq, cap: t, promo: pr, flags: 0 });
              } else {
                moves.push({ from: sq, to: cSq, cap: t, promo: 0, flags: 0 });
              }
            } else if (cSq === this.epSq) {
              moves.push({ from: sq, to: cSq, cap: them | PAWN, promo: 0, flags: FLAG_EP });
            }
          }
        } else if (pt === KNIGHT) {
          for (const d of KNIGHT_DIRS) {
            const to = sq + d;
            if (to & 0x88) continue;
            const t = this.board[to];
            if (!t || (t & 8) === them) moves.push({ from: sq, to, cap: t, promo: 0, flags: 0 });
          }
        } else if (pt === KING) {
          for (const d of KING_DIRS) {
            const to = sq + d;
            if (to & 0x88) continue;
            const t = this.board[to];
            if (!t || (t & 8) === them) moves.push({ from: sq, to, cap: t, promo: 0, flags: 0 });
          }
          if (us === WHITE) {
            if ((this.castle & 1) && !this.board[0x75] && !this.board[0x76] && !this.isSquareAttacked(0x74, BLACK) && !this.isSquareAttacked(0x75, BLACK) && !this.isSquareAttacked(0x76, BLACK))
              moves.push({ from: 0x74, to: 0x76, cap: 0, promo: 0, flags: FLAG_CASTLE });
            if ((this.castle & 2) && !this.board[0x73] && !this.board[0x72] && !this.board[0x71] && !this.isSquareAttacked(0x74, BLACK) && !this.isSquareAttacked(0x73, BLACK) && !this.isSquareAttacked(0x72, BLACK))
              moves.push({ from: 0x74, to: 0x72, cap: 0, promo: 0, flags: FLAG_CASTLE });
          } else {
            if ((this.castle & 4) && !this.board[0x05] && !this.board[0x06] && !this.isSquareAttacked(0x04, WHITE) && !this.isSquareAttacked(0x05, WHITE) && !this.isSquareAttacked(0x06, WHITE))
              moves.push({ from: 0x04, to: 0x06, cap: 0, promo: 0, flags: FLAG_CASTLE });
            if ((this.castle & 8) && !this.board[0x03] && !this.board[0x02] && !this.board[0x01] && !this.isSquareAttacked(0x04, WHITE) && !this.isSquareAttacked(0x03, WHITE) && !this.isSquareAttacked(0x02, WHITE))
              moves.push({ from: 0x04, to: 0x02, cap: 0, promo: 0, flags: FLAG_CASTLE });
          }
        } else {
          const dirs = pt === BISHOP ? BISHOP_DIRS : (pt === ROOK ? ROOK_DIRS : QUEEN_DIRS);
          for (const d of dirs) {
            let to = sq + d;
            while (!(to & 0x88)) {
              const t = this.board[to];
              if (!t) moves.push({ from: sq, to, cap: 0, promo: 0, flags: 0 });
              else { if ((t & 8) === them) moves.push({ from: sq, to, cap: t, promo: 0, flags: 0 }); break; }
              to += d;
            }
          }
        }
      }
    }
    return moves.filter(m => {
      const snap = this.applyRaw(m);
      const ok = !this.isSquareAttacked(this.kingSq[us >> 3], them);
      this.revertRaw(m, snap);
      return ok;
    });
  }

  applyRaw(m) {
    const snap = { castle: this.castle, epSq: this.epSq, halfmove: this.halfmove, kingSq: [...this.kingSq] };
    const piece = this.board[m.from], pt = piece & 7, us = this.side, them = us ^ 8;
    this.board[m.from] = EMPTY;
    if (m.flags & FLAG_EP) this.board[us === WHITE ? m.to + 16 : m.to - 16] = EMPTY;
    this.board[m.to] = m.promo ? (us | m.promo) : piece;
    if (pt === KING) {
      this.kingSq[us >> 3] = m.to;
      if (m.flags & FLAG_CASTLE) {
        if (m.to === 0x76) { this.board[0x77] = EMPTY; this.board[0x75] = WR; }
        else if (m.to === 0x72) { this.board[0x70] = EMPTY; this.board[0x73] = WR; }
        else if (m.to === 0x06) { this.board[0x07] = EMPTY; this.board[0x05] = BR; }
        else { this.board[0x00] = EMPTY; this.board[0x03] = BR; }
      }
    }
    this.epSq = (m.flags & FLAG_DOUBLE) ? (us === WHITE ? m.to + 16 : m.to - 16) : -1;
    this.castle &= CASTLE_MASK[m.from] & CASTLE_MASK[m.to];
    this.halfmove = (pt === PAWN || m.cap) ? 0 : this.halfmove + 1;
    this.side = them;
    return snap;
  }

  revertRaw(m, snap) {
    this.side ^= 8;
    const us = this.side, them = us ^ 8;
    const moved = m.promo ? (us | PAWN) : this.board[m.to];
    this.board[m.from] = moved;
    if (m.flags & FLAG_EP) {
      this.board[m.to] = EMPTY;
      this.board[us === WHITE ? m.to + 16 : m.to - 16] = them | PAWN;
    } else {
      this.board[m.to] = m.cap;
    }
    if ((moved & 7) === KING && (m.flags & FLAG_CASTLE)) {
      if (m.to === 0x76) { this.board[0x77] = WR; this.board[0x75] = EMPTY; }
      else if (m.to === 0x72) { this.board[0x70] = WR; this.board[0x73] = EMPTY; }
      else if (m.to === 0x06) { this.board[0x07] = BR; this.board[0x05] = EMPTY; }
      else { this.board[0x00] = BR; this.board[0x03] = EMPTY; }
    }
    this.castle = snap.castle; this.epSq = snap.epSq; this.halfmove = snap.halfmove; this.kingSq = snap.kingSq;
  }

  makeMove(m) {
    const uci = this.moveToUci(m);
    const snap = this.applyRaw(m);
    const posKey = this.positionKey();
    this.recordPosition();
    const givesCheck = this.inCheck();
    this.history.push({ move: m, snap, uci, posKey });
    return { uci, givesCheck };
  }

  undo() {
    if (this.history.length === 0) return false;
    const entry = this.history.pop();
    const cnt = this.positionCounts.get(entry.posKey) || 1;
    if (cnt <= 1) this.positionCounts.delete(entry.posKey);
    else this.positionCounts.set(entry.posKey, cnt - 1);
    this.revertRaw(entry.move, entry.snap);
    return true;
  }

  isInsufficientMaterial() {
    const pieces = [];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = this.board[(r << 4) | f];
        if (!p || (p & 7) === KING) continue;
        pieces.push({ p, pt: p & 7, color: (r + f) & 1 });
      }
    }
    if (pieces.length === 0) return true;
    if (pieces.length === 1 && (pieces[0].pt === KNIGHT || pieces[0].pt === BISHOP)) return true;
    if (pieces.length === 2 && pieces[0].pt === BISHOP && pieces[1].pt === BISHOP &&
        (pieces[0].p & 8) !== (pieces[1].p & 8) && pieces[0].color === pieces[1].color) return true;
    return false;
  }

  getGameStatus(playerColor) {
    const legal = this.generateLegalMoves();
    if (legal.length === 0) {
      if (this.inCheck()) {
        const playerWon = this.side !== playerColor;
        return { over: true, message: playerWon ? "CHECKMATE - YOU WIN!" : "CHECKMATE - COMPUTER WINS" };
      }
      return { over: true, message: "STALEMATE - DRAW" };
    }
    if (this.halfmove >= 100) return { over: true, message: "DRAW - 50-MOVE RULE" };
    if ((this.positionCounts.get(this.positionKey()) || 0) >= 3) return { over: true, message: "DRAW - REPETITION" };
    if (this.isInsufficientMaterial()) return { over: true, message: "DRAW - INSUFFICIENT MATERIAL" };
    return { over: false };
  }
}

/* =========================================================================
   4. UI CONTROLLER, INLINE BLOB WORKER & POINTER INTERACTION
========================================================================== */
const game = new ChessGame();
let playerColor = WHITE;
let boardFlipped = false;
let selectedSq = -1;
let legalMovesCache = [];
let pendingPromo = null;
let aiThinking = false;
let gameOver = false;
let gameStarted = false;
let searchCounter = 0;
let dragState = null;

/* Load the engine as a packaged extension worker (Manifest V3 compatible). */
const aiWorker = new Worker("engine.js");

/* DOM References */
const boardEl = document.getElementById("chessboard");
const statusBanner = document.getElementById("status-banner");
const statusText = document.getElementById("status-text");
const btnNew = document.getElementById("btn-new");
const btnUndo = document.getElementById("btn-undo");
const btnFlip = document.getElementById("btn-flip");
const sideModal = document.getElementById("side-modal");
const promoModal = document.getElementById("promo-modal");
const promoChoices = document.getElementById("promo-choices");
const dragGhost = document.getElementById("drag-ghost");

/* Render Pixel Kings inside Side Selection Modal */
document.getElementById("icon-white-king").innerHTML = PIECE_SVGS[WK];
document.getElementById("icon-black-king").innerHTML = PIECE_SVGS[BK];

/* Handle AI Worker Responses */
aiWorker.onmessage = (e) => {
  const msg = e.data;
  if (msg.type !== "bestmove" || msg.searchId !== searchCounter) return;
  aiThinking = false;
  if (msg.uci && !gameOver && game.side !== playerColor) {
    const legal = game.generateLegalMoves();
    const chosen = legal.find(m => game.moveToUci(m) === msg.uci);
    if (chosen) executeMove(chosen);
  }
};

function triggerAI() {
  if (gameOver || !gameStarted || game.side === playerColor) return;
  searchCounter++;
  aiThinking = true;
  renderStatus();
  aiWorker.postMessage({
    type: "go",
    moves: game.history.map(h => h.uci),
    searchId: searchCounter
  });
}

function executeMove(m) {
  const { givesCheck } = game.makeMove(m);
  selectedSq = -1;
  legalMovesCache = game.generateLegalMoves();

  const status = game.getGameStatus(playerColor);
  if (status.over) {
    gameOver = true;
    aiThinking = false;
    RetroAudio.gameOver();
  } else if (givesCheck) {
    RetroAudio.check();
  } else if (m.flags & FLAG_CASTLE) {
    RetroAudio.castle();
  } else if (m.cap) {
    RetroAudio.capture();
  } else {
    RetroAudio.move();
  }

  renderBoard();
  renderStatus(status);

  if (!gameOver && game.side !== playerColor) {
    setTimeout(triggerAI, 120);
  }
}

function renderStatus(cachedStatus = null) {
  btnUndo.disabled = !gameStarted || game.history.length === 0;
  statusBanner.classList.remove("inverted");

  if (!gameStarted) {
    statusText.innerHTML = "CHOOSE YOUR SIDE";
    return;
  }

  const st = cachedStatus || game.getGameStatus(playerColor);
  if (st.over) {
    statusBanner.classList.add("inverted");
    statusText.textContent = st.message;
    return;
  }

  if (aiThinking || game.side !== playerColor) {
    statusText.innerHTML = `THINKING... <span class="blink-cursor"></span>`;
  } else if (game.inCheck()) {
    statusBanner.classList.add("inverted");
    statusText.textContent = "CHECK! YOUR TURN";
  } else {
    statusText.textContent = "YOUR TURN";
  }
}

function renderBoard() {
  boardEl.innerHTML = "";
  const lastEntry = game.history.length ? game.history[game.history.length - 1] : null;
  const checkKingSq = game.inCheck() ? game.kingSq[game.side >> 3] : -1;
  const targetMoves = selectedSq !== -1 ? legalMovesCache.filter(m => m.from === selectedSq) : [];
  const targetMap = new Map();
  for (const m of targetMoves) targetMap.set(m.to, m);

  for (let dr = 0; dr < 8; dr++) {
    for (let df = 0; df < 8; df++) {
      const r = boardFlipped ? 7 - dr : dr;
      const f = boardFlipped ? 7 - df : df;
      const sq = (r << 4) | f;
      const isLight = ((r + f) & 1) === 0;

      const sqEl = document.createElement("div");
      sqEl.className = "square " + (isLight ? "light" : "dark");
      sqEl.dataset.sq = sq;

      if (lastEntry && (lastEntry.move.from === sq || lastEntry.move.to === sq)) {
        sqEl.classList.add("last-move");
      }
      if (sq === selectedSq) sqEl.classList.add("selected");
      if (sq === checkKingSq) sqEl.classList.add("in-check");

      if (df === 0) {
        const rk = document.createElement("span");
        rk.className = "coord-rank";
        rk.textContent = String(8 - r);
        sqEl.appendChild(rk);
      }
      if (dr === 7) {
        const fl = document.createElement("span");
        fl.className = "coord-file";
        fl.textContent = String.fromCharCode(97 + f);
        sqEl.appendChild(fl);
      }

      const piece = game.board[sq];
      if (piece) {
        const pWrap = document.createElement("div");
        pWrap.className = "piece";
        pWrap.innerHTML = PIECE_SVGS[piece];
        sqEl.appendChild(pWrap);
      }

      if (targetMap.has(sq)) {
        const hint = document.createElement("div");
        hint.className = (piece || (targetMap.get(sq).flags & FLAG_EP)) ? "hint-capture" : "hint-dot";
        sqEl.appendChild(hint);
      }

      boardEl.appendChild(sqEl);
    }
  }
}

/* Move Attempt & Pawn Promotion */
function tryMove(from, to) {
  const matches = legalMovesCache.filter(m => m.from === from && m.to === to);
  if (matches.length === 0) return false;
  if (matches.length > 1) {
    pendingPromo = matches;
    promoChoices.innerHTML = "";
    for (const pt of [QUEEN, ROOK, BISHOP, KNIGHT]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "px-btn promo-btn";
      btn.innerHTML = PIECE_SVGS[playerColor | pt];
      btn.onclick = () => {
        const chosen = pendingPromo.find(m => m.promo === pt);
        promoModal.classList.remove("visible");
        pendingPromo = null;
        if (chosen) executeMove(chosen);
      };
      promoChoices.appendChild(btn);
    }
    promoModal.classList.add("visible");
    return true;
  }
  executeMove(matches[0]);
  return true;
}

/* Pointer Click-to-Move + Smooth Drag-and-Drop */
function getSquareFromPoint(x, y) {
  const rect = boardEl.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return -1;
  const df = Math.floor(((x - rect.left) / rect.width) * 8);
  const dr = Math.floor(((y - rect.top) / rect.height) * 8);
  const r = boardFlipped ? 7 - dr : dr;
  const f = boardFlipped ? 7 - df : df;
  return (r << 4) | f;
}

boardEl.addEventListener("pointerdown", (e) => {
  if (!gameStarted || gameOver || aiThinking || game.side !== playerColor || pendingPromo) return;
  const sqEl = e.target.closest(".square");
  if (!sqEl) return;
  const sq = parseInt(sqEl.dataset.sq, 10);
  const piece = game.board[sq];

  if (selectedSq !== -1 && sq !== selectedSq) {
    if (tryMove(selectedSq, sq)) return;
  }

  if (piece && (piece & 8) === playerColor) {
    selectedSq = sq;
    renderBoard();

    const originSqEl = boardEl.querySelector(`.square[data-sq="${sq}"]`);
    const originPieceEl = originSqEl ? originSqEl.querySelector(".piece") : null;
    const sqSize = boardEl.getBoundingClientRect().width / 8;

    dragState = {
      fromSq: sq, piece, startX: e.clientX, startY: e.clientY,
      moved: false, sqSize, originPieceEl, hoverSqEl: null
    };
    boardEl.setPointerCapture(e.pointerId);
  } else {
    selectedSq = -1;
    renderBoard();
  }
});

boardEl.addEventListener("pointermove", (e) => {
  if (!dragState) return;
  const dx = e.clientX - dragState.startX, dy = e.clientY - dragState.startY;

  if (!dragState.moved && (dx * dx + dy * dy > 25)) {
    dragState.moved = true;
    dragGhost.style.width = dragState.sqSize + "px";
    dragGhost.style.height = dragState.sqSize + "px";
    dragGhost.innerHTML = PIECE_SVGS[dragState.piece];
    dragGhost.style.display = "block";
    if (dragState.originPieceEl) dragState.originPieceEl.classList.add("dragging-origin");
  }

  if (dragState.moved) {
    dragGhost.style.left = e.clientX + "px";
    dragGhost.style.top = e.clientY + "px";
    const hoverSq = getSquareFromPoint(e.clientX, e.clientY);
    if (dragState.hoverSqEl) dragState.hoverSqEl.classList.remove("drag-over");
    if (hoverSq !== -1) {
      const el = boardEl.querySelector(`.square[data-sq="${hoverSq}"]`);
      if (el) { el.classList.add("drag-over"); dragState.hoverSqEl = el; }
    } else {
      dragState.hoverSqEl = null;
    }
  }
});

boardEl.addEventListener("pointerup", (e) => {
  if (!dragState) return;
  const { fromSq, moved, originPieceEl, hoverSqEl } = dragState;
  dragState = null;

  dragGhost.style.display = "none";
  if (originPieceEl) originPieceEl.classList.remove("dragging-origin");
  if (hoverSqEl) hoverSqEl.classList.remove("drag-over");

  if (moved) {
    const toSq = getSquareFromPoint(e.clientX, e.clientY);
    if (toSq !== -1 && toSq !== fromSq) {
      if (!tryMove(fromSq, toSq)) {
        selectedSq = -1;
        renderBoard();
      }
    }
  }
});

/* Start Game With Chosen Side */
function startGameAs(chosenColor) {
  searchCounter++;
  aiThinking = false;
  gameOver = false;
  gameStarted = true;
  playerColor = chosenColor;
  boardFlipped = (chosenColor === BLACK);
  selectedSq = -1;
  pendingPromo = null;

  sideModal.classList.remove("visible");
  promoModal.classList.remove("visible");

  game.reset();
  legalMovesCache = game.generateLegalMoves();
  aiWorker.postMessage({ type: "clearTT" });

  renderBoard();
  renderStatus();

  if (game.side !== playerColor) {
    setTimeout(triggerAI, 180);
  }
}

document.getElementById("pick-white").onclick = () => startGameAs(WHITE);
document.getElementById("pick-black").onclick = () => startGameAs(BLACK);

/* Three Control Buttons */
btnNew.onclick = () => {
  searchCounter++;
  aiThinking = false;
  pendingPromo = null;
  promoModal.classList.remove("visible");
  sideModal.classList.add("visible");
};

btnUndo.onclick = () => {
  if (!gameStarted || game.history.length === 0) return;
  searchCounter++;
  const wasThinking = aiThinking;
  aiThinking = false;
  gameOver = false;
  pendingPromo = null;
  promoModal.classList.remove("visible");
  selectedSq = -1;

  if (wasThinking || game.side !== playerColor) {
    /* Undo player's move while computer was thinking (or after player delivered mate) */
    game.undo();
  } else if (game.history.length >= 2) {
    /* Undo both computer's reply and player's last move */
    game.undo();
    game.undo();
  } else {
    game.undo();
  }

  legalMovesCache = game.generateLegalMoves();
  renderBoard();
  renderStatus();

  if (game.side !== playerColor) {
    setTimeout(triggerAI, 180);
  }
};

btnFlip.onclick = () => {
  boardFlipped = !boardFlipped;
  renderBoard();
};

/* Initial Render (board visible behind startup Choose Your Side modal) */
legalMovesCache = game.generateLegalMoves();
renderBoard();
renderStatus();
