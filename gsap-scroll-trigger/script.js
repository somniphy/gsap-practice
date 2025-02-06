document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".sticky");
  if (!stickySection) {
    console.error("Sticky section element not found.");
    return;
  }
  const stickyHeight = window.innerHeight * 5;
  const outlineCanvas = document.querySelector(".outline-layer");
  const fillCanvas = document.querySelector(".fill-layer");
  const outlineCtx = outlineCanvas.getContext("2d");
  const fillCtx = fillCanvas.getContext("2d");

  function setCanvasSize(canvas, ctx) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.scale(dpr, dpr);
  }

  setCanvasSize(outlineCanvas, outlineCtx);
  setCanvasSize(fillCanvas, fillCtx);

  const hexagonSize = 200;
  // Adjust these multipliers to control spacing
  const horizontalSpacing = 0.45; // Increase for more horizontal space (default: 1.5)
  const verticalSpacing = 0.9;   // Increase for more vertical space (default: 1.0)
  const lineWidth = 1;
  const SCALE_THRESHOLD = 0.01;
  const hexagonStates = new Map();
  let animationFrameId = null;
  let canvasXPosition = 1;

  function drawHexagon(ctx, x, y, fillScale = 0) {
    const radius = hexagonSize / 2;
    const a = 2 * Math.PI / 6;

    if (fillScale < SCALE_THRESHOLD) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + radius * Math.cos(a * i - Math.PI/6), y + radius * Math.sin(a * i - Math.PI/6));
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255, 0.075)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    if (fillScale >= SCALE_THRESHOLD) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(fillScale, fillScale);
      ctx.translate(-x, -y);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + radius * Math.cos(a * i - Math.PI/6), y + radius * Math.sin(a * i - Math.PI/6));
      }
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawGrid(scrollProgress = 0) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

    const animationProgress =
      scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;

    let needsUpdate = false;
    const animationSpeed = 0.15;

    hexagonStates.forEach((state, key) => {
      if (state.scale < 1) {
        const x = state.col * (hexagonSize * horizontalSpacing) + hexagonSize + canvasXPosition;
        const y = state.row * (hexagonSize * Math.sqrt(3) * verticalSpacing) + 
                 (state.col % 2 ? hexagonSize * Math.sqrt(3) * verticalSpacing/2 : 0) + hexagonSize;
        drawHexagon(outlineCtx, x, y, 0);
      }
    });

    hexagonStates.forEach((state, key) => {
      const shouldBeVisible = state.order <= animationProgress;
      const targetScale = shouldBeVisible ? 1 : 0;
      const newScale =
        state.scale + (targetScale - state.scale) * animationSpeed;

      if (Math.abs(newScale - state.scale) > 0.001) {
        state.scale = newScale;
        needsUpdate = true;
      }

      if (state.scale >= SCALE_THRESHOLD) {
        const x = state.col * (hexagonSize * horizontalSpacing) + hexagonSize + canvasXPosition;
        const y = state.row * (hexagonSize * Math.sqrt(3) * verticalSpacing) + 
                 (state.col % 2 ? hexagonSize * Math.sqrt(3) * verticalSpacing/2 : 0) + hexagonSize;
        drawHexagon(fillCtx, x, y, state.scale);
      }
    });

    if (needsUpdate) {
      animationFrameId = requestAnimationFrame(() => drawGrid(scrollProgress));
    }
  }

  function initializeHexagons() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cols = Math.ceil(width / (hexagonSize * horizontalSpacing)) + 2;
    const rows = Math.ceil(height / (hexagonSize * Math.sqrt(3) * verticalSpacing)) + 2;
    const totalHexagons = rows * cols;

    const positions = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push({ row: r, col: c, key: `${r}-${c}` });
      }
    }

    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    positions.forEach((pos, index) => {
      hexagonStates.set(pos.key, {
        order: index / totalHexagons,
        scale: 0,
        row: pos.row,
        col: pos.col,
      });
    });
  }
  initializeHexagons();
  drawGrid();
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setCanvasSize(outlineCanvas, outlineCtx);
      setCanvasSize(fillCanvas, fillCtx);
      hexagonStates.clear();
      initializeHexagons();
      drawGrid();
    }, 200);
  });

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `+=${stickyHeight}px`,
    pin: true,
    onUpdate: (self) => {
      canvasXPosition = -self.progress * 200;
      drawGrid(self.progress);
      const cards = document.querySelector(".cards");
      const progress = Math.min(self.progress / 0.654, 1);
      gsap.set(cards, {
        x: -progress * window.innerWidth * 2,
      });
    },
  });
});
