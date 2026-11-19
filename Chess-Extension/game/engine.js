"use strict";

const EMPTY = 0;
const PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;
const WHITE = 0, BLACK = 8;
const WP = 1, WN = 2, WB = 3, WR = 4, WQ = 5, WK = 6;
const BP = 9, BN = 10, BB = 11, BR = 12, BQ = 13, BK = 14;

const FLAG_DOUBLE = 1, FLAG_EP = 2, FLAG_CASTLE = 4;
const INF = 32000, MATE = 30000, MAX_PLY = 64;

/* PeSTO Piece Values & Tapered Phase */
const MG_VAL = [0, 82, 337, 365, 477, 1025, 0];
const EG_VAL = [0, 94, 281, 297, 512, 936, 0];
const PHASE_INC = [0, 0, 1, 1, 2, 4, 0];

const MG_PST = [
  null,
  /* Pawn MG */
  [
      0,   0,   0,   0,   0,   0,  0,   0,
     98, 134,  61,  95,  68, 126, 34, -11,
     -6,   7,  26,  31,  65,  56, 25, -20,
    -14,  13,   6,  21,  23,  12, 17, -23,
    -27,  -2,  -5,  12,  17,   6, 10, -25,
    -26,  -4,  -4, -10,   3,   3, 33, -12,
    -35,  -1, -20, -23, -15,  24, 38, -22,
      0,   0,   0,   0,   0,   0,  0,   0
  ],
  /* Knight MG */
  [
   -167, -89, -34, -49,  61, -97, -15, -107,
    -73, -41,  72,  36,  23,  62,   7,  -17,
    -47,  60,  37,  65,  84, 129,  73,   44,
     -9,  17,  19,  53,  37,  69,  18,   22,
    -13,   4,  16,  13,  28,  19,  21,   -8,
    -23,  -9,  12,  10,  19,  17,  25,  -16,
    -29, -53, -12,  -3,  -1,  18, -14,  -19,
   -105, -21, -58, -33, -17, -28, -19,  -23
  ],
  /* Bishop MG */
  [
    -29,   4, -82, -37, -25, -42,   7,  -8,
    -26,  16, -18, -13,  30,  59,  18, -47,
    -16,  37,  43,  40,  35,  50,  37,  -2,
     -4,   5,  19,  50,  37,  37,   7,  -2,
     -6,  13,  13,  26,  34,  12,  10,   4,
      0,  15,  15,  15,  14,  27,  18,  10,
      4,  15,  16,   0,   7,  21,  33,   1,
    -33,  -3, -14, -21, -13, -12, -39, -21
  ],
  /* Rook MG */
  [
     32,  42,  32,  51, 63,  9,  31,  43,
     27,  32,  58,  62, 80, 67,  26,  44,
     -5,  19,  26,  36, 17, 45,  61,  16,
    -24, -11,   7,  26, 24, 35,  -8, -20,
    -36, -26, -12,  -1,  9, -7,   6, -23,
    -45, -25, -16, -17,  3,  0,  -5, -33,
    -44, -16, -20,  -9, -1, 11,  -6, -71,
    -19, -13,   1,  17, 16,  7, -37, -26
  ],
  /* Queen MG */
  [
    -28,   0,  29,  12,  59,  44,  43,  45,
    -24, -39,  -5,   1, -16,  57,  28,  54,
    -13, -17,   7,   8,  29,  56,  47,  57,
    -27, -27, -16, -16,  -1,  17,  -2,   1,
     -9, -26,  -9, -10,  -2,  -4,   3,  -3,
    -14,   2, -11,  -2,  -5,   2,  14,   5,
    -35,  -8,  11,   2,   8,  15,  -3,   1,
     -1, -18,  -9,  10, -15, -25, -31, -50
  ],
  /* King MG */
  [
    -65,  23,  16, -15, -56, -34,   2,  13,
     29,  -1, -20,  -7,  -8,  -4, -38, -29,
     -9,  24,   2, -16, -20,   6,  22, -22,
    -17, -20, -12, -27, -30, -25, -14, -36,
    -49,  -1, -27, -39, -46, -44, -33, -51,
    -14, -14, -22, -46, -44, -30, -15, -27,
      1,   7,  -8, -64, -43, -16,   9,   8,
    -15,  36,  12, -54,   8, -28,  24,  14
  ]
];

const EG_PST = [
  null,
  /* Pawn EG */
  [
      0,   0,   0,   0,   0,   0,  0,   0,
    178, 173, 158, 134, 147, 132, 165, 187,
     94, 100,  85,  67,  56,  53,  82,  84,
     32,  24,  13,   5,  -2,   4,  17,  17,
     13,   9,  -3,  -7,  -7,  -8,   3,  -1,
      4,   7,  -6,   1,   0,  -5,  -1,  -8,
     13,   8,   8,  10,  13,   0,   2,  -7,
      0,   0,   0,   0,   0,   0,  0,   0
  ],
  /* Knight EG */
  [
    -58, -38, -13, -28, -31, -27, -63, -99,
    -25,  -8, -25,  -2,  -9, -25, -24, -52,
    -24, -20,  10,   9,  -1,  -9, -19, -41,
    -17,   3,  22,  22,  22,  11,   8, -18,
    -18,  -6,  16,  25,  16,  17,   4, -18,
    -23,  -3,  -1,  15,  10,  -3, -20, -22,
    -42, -20, -10,  -5,  -2, -20, -23, -44,
    -29, -51, -23, -15, -22, -18, -50, -64
  ],
  /* Bishop EG */
  [
    -14, -21, -11,  -8, -7,  -9, -17, -24,
     -8,  -4,   7, -12, -3, -13,  -4, -14,
      2,  -8,   0,  -1, -2,   6,   0,   4,
     -3,   9,  12,   9, 14,  10,   3,   2,
     -6,   3,  13,  19,  7,  10,  -3,  -9,
    -12,  -3,   8,  10, 13,   3,  -7, -15,
    -14, -18,  -7,  -1,  4,  -9, -15, -27,
    -23,  -9, -23,  -5, -9, -16,  -5, -17
  ],
  /* Rook EG */
  [
     13, 10, 18, 15, 12,  12,   8,   5,
     11, 13, 13, 11, -3,   3,   8,   3,
      7,  7,  7,  5,  4,  -3,  -5,  -3,
      4,  3, 13,  1,  2,   1,  -1,   2,
      3,  5,  8,  4, -5,  -6,  -8, -11,
     -4,  0, -5, -1, -7, -12,  -8, -16,
     -6, -6,  0,  2, -9,  -9, -11,  -3,
     -9,  2,  3, -1, -5, -13,   4, -20
  ],
  /* Queen EG */
  [
     -9,  22,  22,  27,  27,  19,  10,  20,
    -17,  20,  32,  41,  58,  25,  30,   0,
    -20,   6,   9,  49,  47,  35,  19,   9,
      3,  22,  24,  45,  57,  40,  57,  36,
    -18,  28,  19,  47,  31,  34,  39,  23,
    -16, -27,  15,   6,   9,  17,  10,   5,
    -22, -23, -30, -16, -16, -23, -36, -32,
    -33, -28, -22, -43,  -5, -32, -20, -41
  ],
  /* King EG */
  [
    -74, -35, -18, -18, -11,  15,   4, -17,
    -12,  17,  14,  17,  17,  38,  23,  11,
     10,  17,  23,  15,  20,  45,  44,  13,
     -8,  22,  24,  27,  26,  33,  26,   3,
    -18,  -4,  21,  24,  27,  23,   9, -11,
    -19,  -3,  11,  21,  23,  16,   7,  -9,
    -27, -11,   4,  13,  14,   4,  -5, -17,
    -53, -34, -21, -11, -28, -14, -24, -43
  ]
];

const MG_TABLE = Array.from({ length: 16 }, () => new Int16Array(64));
const EG_TABLE = Array.from({ length: 16 }, () => new Int16Array(64));
for (let p = 1; p <= 6; p++) {
  for (let sq = 0; sq < 64; sq++) {
    MG_TABLE[WHITE | p][sq] = MG_VAL[p] + MG_PST[p][sq];
    EG_TABLE[WHITE | p][sq] = EG_VAL[p] + EG_PST[p][sq];
    MG_TABLE[BLACK | p][sq] = MG_VAL[p] + MG_PST[p][sq ^ 56];
    EG_TABLE[BLACK | p][sq] = EG_VAL[p] + EG_PST[p][sq ^ 56];
  }
}

const PASSED_MG = [0, 5, 10, 20, 35, 60, 100, 0];
const PASSED_EG = [0, 10, 20, 38, 65, 110, 180, 0];

const KNIGHT_DIRS = [-33, -31, -18, -14, 14, 18, 31, 33];
const KING_DIRS   = [-17, -16, -15, -1, 1, 15, 16, 17];
const BISHOP_DIRS = [-17, -15, 15, 17];
const ROOK_DIRS   = [-16, -1, 1, 16];
const QUEEN_DIRS  = [-17, -16, -15, -1, 1, 15, 16, 17];

const CASTLE_MASK = new Uint8Array(128).fill(15);
CASTLE_MASK[0x00] = 7;  CASTLE_MASK[0x04] = 3;  CASTLE_MASK[0x07] = 11;
CASTLE_MASK[0x70] = 13; CASTLE_MASK[0x74] = 12; CASTLE_MASK[0x77] = 14;

/* Deterministic 64-bit Zobrist Keys */
let rngState = 0x5A17C3E9;
function rand32() {
  let x = rngState | 0;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  rngState = x;
  return x | 0;
}

const Z_PIECE_HI = Array.from({ length: 16 }, () => new Int32Array(128));
const Z_PIECE_LO = Array.from({ length: 16 }, () => new Int32Array(128));
for (let p = 0; p < 16; p++) {
  for (let s = 0; s < 128; s++) {
    Z_PIECE_HI[p][s] = rand32();
    Z_PIECE_LO[p][s] = rand32();
  }
}
const Z_SIDE_HI = rand32(), Z_SIDE_LO = rand32();
const Z_CASTLE_HI = new Int32Array(16), Z_CASTLE_LO = new Int32Array(16);
for (let i = 0; i < 16; i++) { Z_CASTLE_HI[i] = rand32(); Z_CASTLE_LO[i] = rand32(); }
const Z_EP_HI = new Int32Array(8), Z_EP_LO = new Int32Array(8);
for (let i = 0; i < 8; i++) { Z_EP_HI[i] = rand32(); Z_EP_LO[i] = rand32(); }

/* Transposition Table: 524,288 entries */
const TT_SIZE = 1 << 19;
const TT_MASK = TT_SIZE - 1;
const TT_EXACT = 1, TT_ALPHA = 2, TT_BETA = 3;

const ttHashHi = new Int32Array(TT_SIZE);
const ttHashLo = new Int32Array(TT_SIZE);
const ttMove   = new Int32Array(TT_SIZE);
const ttScore  = new Int16Array(TT_SIZE);
const ttDepth  = new Int8Array(TT_SIZE);
const ttFlag   = new Uint8Array(TT_SIZE);

/* Board & Search Buffers */
const board = new Int8Array(128);
const kingSq = new Int8Array(2);
let side = WHITE, castle = 15, epSq = -1, halfmove = 0;
let hashHi = 0, hashLo = 0;

const uCastle = new Uint8Array(512);
const uEpSq = new Int16Array(512);
const uHalfmove = new Int16Array(512);
const uHashHi = new Int32Array(512);
const uHashLo = new Int32Array(512);
let histPly = 0;

const moveBuf = new Int32Array(MAX_PLY * 256);
const scoreBuf = new Int32Array(MAX_PLY * 256);
const killer1 = new Int32Array(MAX_PLY);
const killer2 = new Int32Array(MAX_PLY);
const historyTbl = new Int32Array(2 * 64 * 64);

/* Compact Opening Book (Main Lines with Variety) */
const OPENING_BOOK = {
  "": ["e2e4", "d2d4", "g1f3", "c2c4"],
  "e2e4": ["c7c5", "e7e5", "e7e6", "c7c6"],
  "d2d4": ["d7d5", "g8f6"],
  "g1f3": ["d7d5", "g8f6", "c7c5"],
  "c2c4": ["e7e5", "g8f6", "c7c5"],
  /* Sicilian */
  "e2e4 c7c5": ["g1f3", "b1c3"],
  "e2e4 c7c5 g1f3": ["d7d6", "b8c6", "e7e6"],
  "e2e4 c7c5 g1f3 d7d6": ["d2d4"],
  "e2e4 c7c5 g1f3 d7d6 d2d4": ["c5d4"],
  "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4": ["f3d4"],
  "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4": ["g8f6"],
  "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6": ["b1c3"],
  "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3": ["a7a6", "b8c6", "g7g6"],
  "e2e4 c7c5 g1f3 b8c6": ["d2d4", "f1b5"],
  "e2e4 c7c5 g1f3 b8c6 d2d4": ["c5d4"],
  "e2e4 c7c5 g1f3 b8c6 d2d4 c5d4": ["f3d4"],
  "e2e4 c7c5 g1f3 e7e6": ["d2d4"],
  "e2e4 c7c5 g1f3 e7e6 d2d4": ["c5d4"],
  /* Italian & Ruy Lopez */
  "e2e4 e7e5": ["g1f3"],
  "e2e4 e7e5 g1f3": ["b8c6", "g8f6"],
  "e2e4 e7e5 g1f3 b8c6": ["f1b5", "f1c4", "d2d4"],
  "e2e4 e7e5 g1f3 b8c6 f1b5": ["a7a6", "g8f6"],
  "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6": ["b5a4"],
  "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4": ["g8f6"],
  "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6": ["e1g1"],
  "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1": ["f8e7"],
  "e2e4 e7e5 g1f3 b8c6 f1c4": ["f8c5", "g8f6"],
  "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5": ["c2c3", "e1g1", "d2d3"],
  "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6": ["d2d3", "b1c3"],
  /* French */
  "e2e4 e7e6": ["d2d4"],
  "e2e4 e7e6 d2d4": ["d7d5"],
  "e2e4 e7e6 d2d4 d7d5": ["b1c3", "b1d2", "e4e5"],
  "e2e4 e7e6 d2d4 d7d5 b1c3": ["g8f6", "f8b4"],
  "e2e4 e7e6 d2d4 d7d5 e4e5": ["c7c5"],
  /* Caro-Kann */
  "e2e4 c7c6": ["d2d4"],
  "e2e4 c7c6 d2d4": ["d7d5"],
  "e2e4 c7c6 d2d4 d7d5": ["b1c3", "e4e5", "e4d5"],
  "e2e4 c7c6 d2d4 d7d5 b1c3": ["d5e4"],
  "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4": ["c3e4"],
  "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4": ["c8f5", "b8d7"],
  /* Queen's Gambit & Slav */
  "d2d4 d7d5": ["c2c4", "g1f3"],
  "d2d4 d7d5 c2c4": ["e7e6", "c7c6"],
  "d2d4 d7d5 c2c4 e7e6": ["b1c3", "g1f3"],
  "d2d4 d7d5 c2c4 e7e6 b1c3": ["g8f6"],
  "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6": ["c1g5", "c4d5", "g1f3"],
  "d2d4 d7d5 c2c4 c7c6": ["g1f3", "b1c3"],
  "d2d4 d7d5 c2c4 c7c6 g1f3": ["g8f6"],
  "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6": ["b1c3", "e2e3"],
  /* Nimzo-Indian & King's Indian */
  "d2d4 g8f6": ["c2c4", "g1f3"],
  "d2d4 g8f6 c2c4": ["e7e6", "g7g6"],
  "d2d4 g8f6 c2c4 e7e6": ["b1c3", "g1f3"],
  "d2d4 g8f6 c2c4 e7e6 b1c3": ["f8b4", "d7d5"],
  "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4": ["e2e3", "d1c2", "g1f3"],
  "d2d4 g8f6 c2c4 g7g6": ["b1c3"],
  "d2d4 g8f6 c2c4 g7g6 b1c3": ["f8g7", "d7d5"],
  "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7": ["e2e4"],
  "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4": ["d7d6"],
  "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6": ["g1f3", "f1e2"]
};

function encodeMove(from, to, cap, promo, flags) {
  return from | (to << 7) | (cap << 14) | (promo << 18) | (flags << 21);
}

function sqToUci(sq) {
  return String.fromCharCode(97 + (sq & 7)) + String.fromCharCode(56 - (sq >> 4));
}

function moveToUci(m) {
  const from = m & 0x7F, to = (m >> 7) & 0x7F, promo = (m >> 18) & 7;
  let s = sqToUci(from) + sqToUci(to);
  if (promo) s += ["", "", "n", "b", "r", "q"][promo];
  return s;
}

function resetBoard() {
  board.fill(EMPTY);
  const bW = [WR, WN, WB, WQ, WK, WB, WN, WR];
  const bB = [BR, BN, BB, BQ, BK, BB, BN, BR];
  for (let f = 0; f < 8; f++) {
    board[0x00 | f] = bB[f];
    board[0x10 | f] = BP;
    board[0x60 | f] = WP;
    board[0x70 | f] = bW[f];
  }
  kingSq[0] = 0x74; kingSq[1] = 0x04;
  side = WHITE; castle = 15; epSq = -1; halfmove = 0; histPly = 0;
  computeHash();
}

function computeHash() {
  let hi = 0, lo = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = (r << 4) | f, p = board[sq];
      if (p) { hi ^= Z_PIECE_HI[p][sq]; lo ^= Z_PIECE_LO[p][sq]; }
    }
  }
  if (side === BLACK) { hi ^= Z_SIDE_HI; lo ^= Z_SIDE_LO; }
  hi ^= Z_CASTLE_HI[castle]; lo ^= Z_CASTLE_LO[castle];
  if (epSq !== -1) { hi ^= Z_EP_HI[epSq & 7]; lo ^= Z_EP_LO[epSq & 7]; }
  hashHi = hi; hashLo = lo;
}

function isSquareAttacked(sq, bySide) {
  if (bySide === WHITE) {
    let s = sq + 15; if (!(s & 0x88) && board[s] === WP) return true;
    s = sq + 17; if (!(s & 0x88) && board[s] === WP) return true;
  } else {
    let s = sq - 15; if (!(s & 0x88) && board[s] === BP) return true;
    s = sq - 17; if (!(s & 0x88) && board[s] === BP) return true;
  }
  const nP = bySide | KNIGHT;
  for (let i = 0; i < 8; i++) { const s = sq + KNIGHT_DIRS[i]; if (!(s & 0x88) && board[s] === nP) return true; }
  const kP = bySide | KING;
  for (let i = 0; i < 8; i++) { const s = sq + KING_DIRS[i]; if (!(s & 0x88) && board[s] === kP) return true; }
  const bP = bySide | BISHOP, qP = bySide | QUEEN;
  for (let i = 0; i < 4; i++) {
    const d = BISHOP_DIRS[i]; let s = sq + d;
    while (!(s & 0x88)) { const p = board[s]; if (p) { if (p === bP || p === qP) return true; break; } s += d; }
  }
  const rP = bySide | ROOK;
  for (let i = 0; i < 4; i++) {
    const d = ROOK_DIRS[i]; let s = sq + d;
    while (!(s & 0x88)) { const p = board[s]; if (p) { if (p === rP || p === qP) return true; break; } s += d; }
  }
  return false;
}

function makeMove(m) {
  const from = m & 0x7F, to = (m >> 7) & 0x7F;
  const cap = (m >> 14) & 15, promo = (m >> 18) & 7, flags = (m >> 21) & 7;

  uCastle[histPly] = castle; uEpSq[histPly] = epSq; uHalfmove[histPly] = halfmove;
  uHashHi[histPly] = hashHi; uHashLo[histPly] = hashLo;
  histPly++;

  let hi = hashHi, lo = hashLo;
  if (epSq !== -1) { hi ^= Z_EP_HI[epSq & 7]; lo ^= Z_EP_LO[epSq & 7]; epSq = -1; }

  const piece = board[from], pt = piece & 7, us = side, them = side ^ 8;
  hi ^= Z_PIECE_HI[piece][from]; lo ^= Z_PIECE_LO[piece][from];
  board[from] = EMPTY;

  if (flags & FLAG_EP) {
    const capSq = us === WHITE ? to + 16 : to - 16;
    const capPawn = them | PAWN;
    board[capSq] = EMPTY;
    hi ^= Z_PIECE_HI[capPawn][capSq]; lo ^= Z_PIECE_LO[capPawn][capSq];
  } else if (cap) {
    hi ^= Z_PIECE_HI[cap][to]; lo ^= Z_PIECE_LO[cap][to];
  }

  const placed = promo ? (us | promo) : piece;
  board[to] = placed;
  hi ^= Z_PIECE_HI[placed][to]; lo ^= Z_PIECE_LO[placed][to];

  if (pt === KING) {
    kingSq[us >> 3] = to;
    if (flags & FLAG_CASTLE) {
      let rFrom, rTo;
      if (to === 0x76) { rFrom = 0x77; rTo = 0x75; }
      else if (to === 0x72) { rFrom = 0x70; rTo = 0x73; }
      else if (to === 0x06) { rFrom = 0x07; rTo = 0x05; }
      else { rFrom = 0x00; rTo = 0x03; }
      const rook = us | ROOK;
      board[rFrom] = EMPTY; board[rTo] = rook;
      hi ^= Z_PIECE_HI[rook][rFrom] ^ Z_PIECE_HI[rook][rTo];
      lo ^= Z_PIECE_LO[rook][rFrom] ^ Z_PIECE_LO[rook][rTo];
    }
  }

  if (flags & FLAG_DOUBLE) {
    epSq = us === WHITE ? to + 16 : to - 16;
    hi ^= Z_EP_HI[epSq & 7]; lo ^= Z_EP_LO[epSq & 7];
  }

  const newCastle = castle & CASTLE_MASK[from] & CASTLE_MASK[to];
  if (newCastle !== castle) {
    hi ^= Z_CASTLE_HI[castle] ^ Z_CASTLE_HI[newCastle];
    lo ^= Z_CASTLE_LO[castle] ^ Z_CASTLE_LO[newCastle];
    castle = newCastle;
  }

  halfmove = (pt === PAWN || cap) ? 0 : halfmove + 1;
  side = them;
  hi ^= Z_SIDE_HI; lo ^= Z_SIDE_LO;
  hashHi = hi; hashLo = lo;

  if (isSquareAttacked(kingSq[us >> 3], them)) {
    unmakeMove(m);
    return false;
  }
  return true;
}

function unmakeMove(m) {
  const from = m & 0x7F, to = (m >> 7) & 0x7F;
  const cap = (m >> 14) & 15, promo = (m >> 18) & 7, flags = (m >> 21) & 7;

  histPly--;
  castle = uCastle[histPly]; epSq = uEpSq[histPly]; halfmove = uHalfmove[histPly];
  hashHi = uHashHi[histPly]; hashLo = uHashLo[histPly];

  side ^= 8;
  const us = side, them = side ^ 8;
  const movedPiece = promo ? (us | PAWN) : board[to];
  board[from] = movedPiece;

  if (flags & FLAG_EP) {
    board[to] = EMPTY;
    board[us === WHITE ? to + 16 : to - 16] = them | PAWN;
  } else {
    board[to] = cap;
  }

  if ((movedPiece & 7) === KING) {
    kingSq[us >> 3] = from;
    if (flags & FLAG_CASTLE) {
      if (to === 0x76) { board[0x77] = WR; board[0x75] = EMPTY; }
      else if (to === 0x72) { board[0x70] = WR; board[0x73] = EMPTY; }
      else if (to === 0x06) { board[0x07] = BR; board[0x05] = EMPTY; }
      else { board[0x00] = BR; board[0x03] = EMPTY; }
    }
  }
}

function makeNullMove() {
  uCastle[histPly] = castle; uEpSq[histPly] = epSq; uHalfmove[histPly] = halfmove;
  uHashHi[histPly] = hashHi; uHashLo[histPly] = hashLo;
  histPly++;
  if (epSq !== -1) { hashHi ^= Z_EP_HI[epSq & 7]; hashLo ^= Z_EP_LO[epSq & 7]; epSq = -1; }
  side ^= 8; hashHi ^= Z_SIDE_HI; hashLo ^= Z_SIDE_LO;
}

function unmakeNullMove() {
  histPly--;
  castle = uCastle[histPly]; epSq = uEpSq[histPly]; halfmove = uHalfmove[histPly];
  hashHi = uHashHi[histPly]; hashLo = uHashLo[histPly];
  side ^= 8;
}

function generateMoves(offset, capturesOnly) {
  let count = 0;
  const us = side, them = side ^ 8;
  for (let r = 0; r < 8; r++) {
    const rb = r << 4;
    for (let f = 0; f < 8; f++) {
      const sq = rb | f, p = board[sq];
      if (!p || (p & 8) !== us) continue;
      const pt = p & 7;

      if (pt === PAWN) {
        const dir = us === WHITE ? -16 : 16;
        const startRank = us === WHITE ? 6 : 1;
        const promoRank = us === WHITE ? 1 : 6;
        const to = sq + dir;
        if (board[to] === EMPTY) {
          if (r === promoRank) {
            moveBuf[offset + count++] = encodeMove(sq, to, 0, QUEEN, 0);
            if (!capturesOnly) {
              moveBuf[offset + count++] = encodeMove(sq, to, 0, ROOK, 0);
              moveBuf[offset + count++] = encodeMove(sq, to, 0, BISHOP, 0);
              moveBuf[offset + count++] = encodeMove(sq, to, 0, KNIGHT, 0);
            }
          } else if (!capturesOnly) {
            moveBuf[offset + count++] = encodeMove(sq, to, 0, 0, 0);
            if (r === startRank && board[to + dir] === EMPTY) {
              moveBuf[offset + count++] = encodeMove(sq, to + dir, 0, 0, FLAG_DOUBLE);
            }
          }
        }
        const caps = us === WHITE ? [-17, -15] : [15, 17];
        for (let i = 0; i < 2; i++) {
          const cSq = sq + caps[i];
          if (cSq & 0x88) continue;
          const t = board[cSq];
          if (t && (t & 8) === them) {
            if (r === promoRank) {
              moveBuf[offset + count++] = encodeMove(sq, cSq, t, QUEEN, 0);
              moveBuf[offset + count++] = encodeMove(sq, cSq, t, ROOK, 0);
              moveBuf[offset + count++] = encodeMove(sq, cSq, t, BISHOP, 0);
              moveBuf[offset + count++] = encodeMove(sq, cSq, t, KNIGHT, 0);
            } else {
              moveBuf[offset + count++] = encodeMove(sq, cSq, t, 0, 0);
            }
          } else if (cSq === epSq) {
            moveBuf[offset + count++] = encodeMove(sq, cSq, them | PAWN, 0, FLAG_EP);
          }
        }
      } else if (pt === KNIGHT) {
        for (let i = 0; i < 8; i++) {
          const to = sq + KNIGHT_DIRS[i];
          if (to & 0x88) continue;
          const t = board[to];
          if (!t) { if (!capturesOnly) moveBuf[offset + count++] = encodeMove(sq, to, 0, 0, 0); }
          else if ((t & 8) === them) moveBuf[offset + count++] = encodeMove(sq, to, t, 0, 0);
        }
      } else if (pt === KING) {
        for (let i = 0; i < 8; i++) {
          const to = sq + KING_DIRS[i];
          if (to & 0x88) continue;
          const t = board[to];
          if (!t) { if (!capturesOnly) moveBuf[offset + count++] = encodeMove(sq, to, 0, 0, 0); }
          else if ((t & 8) === them) moveBuf[offset + count++] = encodeMove(sq, to, t, 0, 0);
        }
        if (!capturesOnly) {
          if (us === WHITE) {
            if ((castle & 1) && !board[0x75] && !board[0x76] && !isSquareAttacked(0x74, BLACK) && !isSquareAttacked(0x75, BLACK) && !isSquareAttacked(0x76, BLACK))
              moveBuf[offset + count++] = encodeMove(0x74, 0x76, 0, 0, FLAG_CASTLE);
            if ((castle & 2) && !board[0x73] && !board[0x72] && !board[0x71] && !isSquareAttacked(0x74, BLACK) && !isSquareAttacked(0x73, BLACK) && !isSquareAttacked(0x72, BLACK))
              moveBuf[offset + count++] = encodeMove(0x74, 0x72, 0, 0, FLAG_CASTLE);
          } else {
            if ((castle & 4) && !board[0x05] && !board[0x06] && !isSquareAttacked(0x04, WHITE) && !isSquareAttacked(0x05, WHITE) && !isSquareAttacked(0x06, WHITE))
              moveBuf[offset + count++] = encodeMove(0x04, 0x06, 0, 0, FLAG_CASTLE);
            if ((castle & 8) && !board[0x03] && !board[0x02] && !board[0x01] && !isSquareAttacked(0x04, WHITE) && !isSquareAttacked(0x03, WHITE) && !isSquareAttacked(0x02, WHITE))
              moveBuf[offset + count++] = encodeMove(0x04, 0x02, 0, 0, FLAG_CASTLE);
          }
        }
      } else {
        const dirs = pt === BISHOP ? BISHOP_DIRS : (pt === ROOK ? ROOK_DIRS : QUEEN_DIRS);
        for (let i = 0; i < dirs.length; i++) {
          const d = dirs[i]; let to = sq + d;
          while (!(to & 0x88)) {
            const t = board[to];
            if (!t) { if (!capturesOnly) moveBuf[offset + count++] = encodeMove(sq, to, 0, 0, 0); }
            else { if ((t & 8) === them) moveBuf[offset + count++] = encodeMove(sq, to, t, 0, 0); break; }
            to += d;
          }
        }
      }
    }
  }
  return count;
}

/* PeSTO Tapered Eval + Bishop Pair + Passed Pawns + King Pawn Shield */
const wPawnMinRank = new Int8Array(8);
const bPawnMaxRank = new Int8Array(8);

function evaluate() {
  let mgW = 0, egW = 0, mgB = 0, egB = 0;
  let phase = 0, wBishops = 0, bBishops = 0;

  wPawnMinRank.fill(8);
  bPawnMaxRank.fill(-1);

  for (let r = 0; r < 8; r++) {
    const rb = r << 4, s64b = r << 3;
    for (let f = 0; f < 8; f++) {
      const p = board[rb | f];
      if (!p) continue;
      const sq64 = s64b | f, pt = p & 7;
      phase += PHASE_INC[pt];
      if (p < 8) {
        mgW += MG_TABLE[p][sq64];
        egW += EG_TABLE[p][sq64];
        if (pt === BISHOP) wBishops++;
        else if (pt === PAWN && r < wPawnMinRank[f]) wPawnMinRank[f] = r;
      } else {
        mgB += MG_TABLE[p][sq64];
        egB += EG_TABLE[p][sq64];
        if (pt === BISHOP) bBishops++;
        else if (pt === PAWN && r > bPawnMaxRank[f]) bPawnMaxRank[f] = r;
      }
    }
  }

  /* Bishop Pair */
  if (wBishops >= 2) { mgW += 30; egW += 50; }
  if (bBishops >= 2) { mgB += 30; egB += 50; }

  /* Passed Pawns */
  for (let f = 0; f < 8; f++) {
    const wr = wPawnMinRank[f];
    if (wr < 8) {
      let blocked = false;
      for (let nf = (f > 0 ? f - 1 : 0); nf <= (f < 7 ? f + 1 : 7); nf++) {
        if (bPawnMaxRank[nf] >= 0 && bPawnMaxRank[nf] < wr) { blocked = true; break; }
      }
      if (!blocked) { mgW += PASSED_MG[7 - wr]; egW += PASSED_EG[7 - wr]; }
    }
    const br = bPawnMaxRank[f];
    if (br >= 0) {
      let blocked = false;
      for (let nf = (f > 0 ? f - 1 : 0); nf <= (f < 7 ? f + 1 : 7); nf++) {
        if (wPawnMinRank[nf] < 8 && wPawnMinRank[nf] > br) { blocked = true; break; }
      }
      if (!blocked) { mgB += PASSED_MG[br]; egB += PASSED_EG[br]; }
    }
  }

  /* Middlegame King Pawn Shield */
  const wk = kingSq[0], wkR = wk >> 4, wkF = wk & 7;
  if (wkR === 7 && (wkF <= 2 || wkF >= 5)) {
    const fMin = wkF > 0 ? wkF - 1 : 0, fMax = wkF < 7 ? wkF + 1 : 7;
    for (let f = fMin; f <= fMax; f++) {
      if (board[0x60 | f] === WP) mgW += 12;
      else if (board[0x50 | f] === WP) mgW += 6;
    }
  }
  const bk = kingSq[1], bkR = bk >> 4, bkF = bk & 7;
  if (bkR === 0 && (bkF <= 2 || bkF >= 5)) {
    const fMin = bkF > 0 ? bkF - 1 : 0, fMax = bkF < 7 ? bkF + 1 : 7;
    for (let f = fMin; f <= fMax; f++) {
      if (board[0x10 | f] === BP) mgB += 12;
      else if (board[0x20 | f] === BP) mgB += 6;
    }
  }

  const mgPhase = phase > 24 ? 24 : phase;
  const egPhase = 24 - mgPhase;
  const score = (((mgW - mgB) * mgPhase + (egW - egB) * egPhase) / 24) | 0;
  return (side === WHITE ? score : -score) + 10;
}

const MVV_VAL = [0, 100, 320, 330, 500, 900, 10000];

function scoreMoves(offset, count, ply, ttBest) {
  const sIdx = side >> 3, k1 = killer1[ply], k2 = killer2[ply];
  for (let i = 0; i < count; i++) {
    const m = moveBuf[offset + i];
    if (m === ttBest) { scoreBuf[offset + i] = 2000000; continue; }
    const cap = (m >> 14) & 15, promo = (m >> 18) & 7;
    if (cap) {
      scoreBuf[offset + i] = 1000000 + MVV_VAL[cap & 7] * 10 - (board[m & 0x7F] & 7);
    } else if (promo) {
      scoreBuf[offset + i] = 900000 + MVV_VAL[promo];
    } else if (m === k1) {
      scoreBuf[offset + i] = 800000;
    } else if (m === k2) {
      scoreBuf[offset + i] = 700000;
    } else {
      const from = m & 0x7F, to = (m >> 7) & 0x7F;
      const f64 = ((from >> 4) << 3) | (from & 7), t64 = ((to >> 4) << 3) | (to & 7);
      scoreBuf[offset + i] = historyTbl[(sIdx << 12) | (f64 << 6) | t64];
    }
  }
}

function pickBestMove(offset, start, count) {
  let bestIdx = start, bestScore = scoreBuf[offset + start];
  for (let i = start + 1; i < count; i++) {
    const sc = scoreBuf[offset + i];
    if (sc > bestScore) { bestScore = sc; bestIdx = i; }
  }
  if (bestIdx !== start) {
    const tm = moveBuf[offset + start]; moveBuf[offset + start] = moveBuf[offset + bestIdx]; moveBuf[offset + bestIdx] = tm;
    const ts = scoreBuf[offset + start]; scoreBuf[offset + start] = scoreBuf[offset + bestIdx]; scoreBuf[offset + bestIdx] = ts;
  }
  return moveBuf[offset + start];
}

function isRepetition() {
  const start = Math.max(0, histPly - halfmove);
  for (let i = histPly - 2; i >= start; i -= 2) {
    if (uHashHi[i] === hashHi && uHashLo[i] === hashLo) return true;
  }
  return false;
}

function hasNonPawnMaterial(us) {
  for (let r = 0; r < 8; r++) {
    const rb = r << 4;
    for (let f = 0; f < 8; f++) {
      const p = board[rb | f];
      if (p && (p & 8) === us) {
        const pt = p & 7;
        if (pt >= KNIGHT && pt <= QUEEN) return true;
      }
    }
  }
  return false;
}

let nodes = 0, stopTime = 0, aborted = false;

function checkTime() {
  if ((nodes & 2047) === 0 && performance.now() >= stopTime) aborted = true;
}

function quiesce(alpha, beta, ply) {
  nodes++; checkTime();
  if (aborted) return 0;
  if (ply >= MAX_PLY - 1) return evaluate();

  const standPat = evaluate();
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;

  const offset = ply << 8;
  const count = generateMoves(offset, true);
  scoreMoves(offset, count, ply, 0);

  for (let i = 0; i < count; i++) {
    const m = pickBestMove(offset, i, count);
    const cap = (m >> 14) & 7, promo = (m >> 18) & 7;
    if (!promo && standPat + MVV_VAL[cap] + 220 < alpha) continue;
    if (!makeMove(m)) continue;
    const score = -quiesce(-beta, -alpha, ply + 1);
    unmakeMove(m);
    if (aborted) return 0;
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function negamax(depth, alpha, beta, ply, allowNull) {
  nodes++; checkTime();
  if (aborted) return 0;

  const isRoot = ply === 0;
  const inCheck = isSquareAttacked(kingSq[side >> 3], side ^ 8);

  if (!isRoot) {
    if (halfmove >= 100 || isRepetition()) return 0;
    alpha = Math.max(alpha, -MATE + ply);
    beta = Math.min(beta, MATE - ply - 1);
    if (alpha >= beta) return alpha;
  }

  if (inCheck && ply < MAX_PLY - 4) depth++;
  if (depth <= 0 || ply >= MAX_PLY - 1) return quiesce(alpha, beta, ply);

  const ttIdx = (hashLo ^ hashHi) & TT_MASK;
  let ttBest = 0;
  if (ttHashHi[ttIdx] === hashHi && ttHashLo[ttIdx] === hashLo) {
    ttBest = ttMove[ttIdx];
    if (!isRoot && ttDepth[ttIdx] >= depth) {
      let sc = ttScore[ttIdx];
      if (sc > MATE - 100) sc -= ply;
      else if (sc < -MATE + 100) sc += ply;
      const flag = ttFlag[ttIdx];
      if (flag === TT_EXACT) return sc;
      if (flag === TT_ALPHA && sc <= alpha) return alpha;
      if (flag === TT_BETA && sc >= beta) return beta;
    }
  }

  /* Null-Move Pruning */
  if (allowNull && !isRoot && !inCheck && depth >= 3 && hasNonPawnMaterial(side)) {
    const R = depth >= 6 ? 3 : 2;
    makeNullMove();
    const nullScore = -negamax(depth - 1 - R, -beta, -beta + 1, ply + 1, false);
    unmakeNullMove();
    if (aborted) return 0;
    if (nullScore >= beta && nullScore < MATE - 100) return beta;
  }

  const offset = ply << 8;
  const count = generateMoves(offset, false);
  scoreMoves(offset, count, ply, ttBest);

  let legalMoves = 0, bestMove = 0, bestScore = -INF;
  const origAlpha = alpha, sIdx = side >> 3;

  for (let i = 0; i < count; i++) {
    const m = pickBestMove(offset, i, count);
    if (!makeMove(m)) continue;
    legalMoves++;

    const isQuiet = !((m >> 14) & 15) && !((m >> 18) & 7);
    let score;

    if (legalMoves === 1) {
      score = -negamax(depth - 1, -beta, -alpha, ply + 1, true);
    } else {
      let reduction = 0;
      if (depth >= 3 && legalMoves >= 4 && isQuiet && !inCheck && !isSquareAttacked(kingSq[side >> 3], side ^ 8)) {
        reduction = (legalMoves >= 10 && depth >= 5) ? 2 : 1;
      }
      score = -negamax(depth - 1 - reduction, -alpha - 1, -alpha, ply + 1, true);
      if (score > alpha && reduction > 0) score = -negamax(depth - 1, -alpha - 1, -alpha, ply + 1, true);
      if (score > alpha && score < beta) score = -negamax(depth - 1, -beta, -alpha, ply + 1, true);
    }

    unmakeMove(m);
    if (aborted) return 0;

    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
      if (score > alpha) {
        alpha = score;
        if (alpha >= beta) {
          if (isQuiet) {
            if (killer1[ply] !== m) { killer2[ply] = killer1[ply]; killer1[ply] = m; }
            const from = m & 0x7F, to = (m >> 7) & 0x7F;
            const f64 = ((from >> 4) << 3) | (from & 7), t64 = ((to >> 4) << 3) | (to & 7);
            const hIdx = (sIdx << 12) | (f64 << 6) | t64;
            historyTbl[hIdx] = Math.min(historyTbl[hIdx] + depth * depth, 500000);
          }
          break;
        }
      }
    }
  }

  if (legalMoves === 0) return inCheck ? (-MATE + ply) : 0;

  let storeScore = bestScore;
  if (storeScore > MATE - 100) storeScore += ply;
  else if (storeScore < -MATE + 100) storeScore -= ply;

  let flag = TT_EXACT;
  if (bestScore <= origAlpha) flag = TT_ALPHA;
  else if (bestScore >= beta) flag = TT_BETA;

  ttHashHi[ttIdx] = hashHi; ttHashLo[ttIdx] = hashLo;
  ttMove[ttIdx] = bestMove; ttScore[ttIdx] = storeScore;
  ttDepth[ttIdx] = depth; ttFlag[ttIdx] = flag;

  return bestScore;
}

function loadFromMoves(uciMoves) {
  resetBoard();
  for (let i = 0; i < uciMoves.length; i++) {
    const uci = uciMoves[i];
    const count = generateMoves(0, false);
    for (let j = 0; j < count; j++) {
      const m = moveBuf[j];
      if (moveToUci(m) === uci && makeMove(m)) break;
    }
  }
}

function findBestMove(uciMoves, searchId) {
  loadFromMoves(uciMoves);

  /* Opening Book Lookup */
  const bookKey = uciMoves.join(" ");
  const bookMoves = OPENING_BOOK[bookKey];
  if (bookMoves && bookMoves.length > 0) {
    const pick = bookMoves[(Math.random() * bookMoves.length) | 0];
    postMessage({ type: "bestmove", searchId, uci: pick });
    return;
  }

  killer1.fill(0);
  killer2.fill(0);
  for (let i = 0; i < historyTbl.length; i++) historyTbl[i] >>= 2;

  nodes = 0;
  aborted = false;
  const startTime = performance.now();
  const timeBudget = 950; /* Snappy ~950ms search for strong ~2000 ELO play */
  stopTime = startTime + timeBudget;

  /* Guaranteed legal fallback */
  let bestUci = null;
  const rootCount = generateMoves(0, false);
  for (let i = 0; i < rootCount; i++) {
    const m = moveBuf[i];
    if (makeMove(m)) { bestUci = moveToUci(m); unmakeMove(m); break; }
  }

  let prevScore = 0;
  for (let d = 1; d <= 18; d++) {
    let alpha = -INF, beta = INF;
    if (d >= 4 && Math.abs(prevScore) < MATE - 200) {
      alpha = prevScore - 55;
      beta = prevScore + 55;
    }
    let score = negamax(d, alpha, beta, 0, true);
    if (!aborted && (score <= alpha || score >= beta)) {
      score = negamax(d, -INF, INF, 0, true);
    }
    if (aborted) break;

    const ttIdx = (hashLo ^ hashHi) & TT_MASK;
    if (ttMove[ttIdx]) {
      bestUci = moveToUci(ttMove[ttIdx]);
      prevScore = score;
    }
    if (Math.abs(score) > MATE - 100) break;
    if (performance.now() - startTime > timeBudget * 0.58) break;
  }

  postMessage({ type: "bestmove", searchId, uci: bestUci });
}

onmessage = function(e) {
  const data = e.data;
  if (data.type === "go") {
    findBestMove(data.moves, data.searchId);
  } else if (data.type === "clearTT") {
    ttHashHi.fill(0); ttHashLo.fill(0); ttMove.fill(0); ttFlag.fill(0);
  }
};
