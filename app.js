(function () {
  var MARGIN = 4;
  var OUT = 280;

  var input = document.getElementById("text");
  var canvas = document.getElementById("qr");
  var box = document.getElementById("qr-box");
  var errEl = document.getElementById("err");
  var dl = document.getElementById("dl");
  var pasteBtn = document.getElementById("paste");
  var clearBtn = document.getElementById("clear");
  var ctx = canvas.getContext("2d");

  function setError(msg) {
    if (msg) {
      errEl.textContent = msg;
      errEl.hidden = false;
    } else {
      errEl.textContent = "";
      errEl.hidden = true;
    }
  }

  function draw(text) {
    var trimmed = text.trim();
    clearBtn.disabled = !text.length;
    if (!trimmed) {
      setError("");
      box.hidden = true;
      dl.hidden = true;
      return;
    }

    var matrix;
    try {
      matrix = QR(trimmed);
    } catch (e) {
      setError(typeof e === "string" ? e : "Không tạo được mã QR.");
      box.hidden = true;
      dl.hidden = true;
      return;
    }

    setError("");
    var n = matrix.length;
    var cells = n + MARGIN * 2;
    var scale = OUT / cells;

    canvas.width = OUT;
    canvas.height = OUT;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.fillStyle = "#000000";

    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (matrix[y][x]) {
          ctx.fillRect((x + MARGIN) * scale, (y + MARGIN) * scale, scale, scale);
        }
      }
    }

    box.hidden = false;
    dl.hidden = false;
  }

  input.addEventListener("input", function () {
    draw(input.value);
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    draw("");
    input.focus();
  });

  pasteBtn.addEventListener("click", function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setError("Trình duyệt không hỗ trợ dán tự động — dùng Ctrl+V.");
      input.focus();
      return;
    }
    navigator.clipboard.readText().then(function (text) {
      if (!text) return;
      input.value = text;
      draw(text);
      input.focus();
    }).catch(function () {
      setError("Không đọc được clipboard — thử Ctrl+V hoặc mở trang qua HTTPS.");
    });
  });

  dl.addEventListener("click", function () {
    var a = document.createElement("a");
    a.download = "qrcode.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });

  draw(input.value);
})();
