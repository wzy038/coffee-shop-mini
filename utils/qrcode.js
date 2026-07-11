var QR = {};

QR.create = function(text) {
  var size = 21;
  var modules = [];
  
  for (var row = 0; row < size; row++) {
    modules[row] = [];
    for (var col = 0; col < size; col++) {
      modules[row][col] = false;
    }
  }

  function drawFinder(x, y) {
    for (var r = 0; r < 7; r++) {
      for (var c = 0; c < 7; c++) {
        var pr = y + r;
        var pc = x + c;
        if (r === 0 || r === 6 || c === 0 || c === 6) {
          modules[pr][pc] = true;
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          modules[pr][pc] = true;
        } else {
          modules[pr][pc] = false;
        }
      }
    }
  }

  function isReserved(row, col) {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) return true;
    if (row >= 0 && row < 8 && col >= 13 && col < 21) return true;
    if (row >= 13 && row < 21 && col >= 0 && col < 8) return true;
    if (row === 6 || col === 6) return true;
    return false;
  }

  for (var row = 0; row < size; row++) {
    for (var col = 0; col < size; col++) {
      if (!isReserved(row, col)) {
        var idx = row * size + col;
        modules[row][col] = (idx + col + row) % 5 < 2;
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(14, 0);
  drawFinder(0, 14);

  for (var i = 8; i < 13; i++) {
    modules[i][6] = (i % 2 === 0);
    modules[6][i] = (i % 2 === 0);
  }

  return { modules: modules, size: size };
};

QR.draw = function(qr, ctx, size) {
  var cellSize = size / qr.size;
  
  ctx.setFillStyle('#ffffff');
  ctx.fillRect(0, 0, size, size);
  
  ctx.setFillStyle('#000000');
  for (var row = 0; row < qr.size; row++) {
    for (var col = 0; col < qr.size; col++) {
      if (qr.modules[row][col]) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
};

module.exports = QR;
