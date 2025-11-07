const matrixCanvas = document.getElementById("matrix");
const ctx = matrixCanvas.getContext("2d");
const fontSize = 16;
let columns = Math.floor(window.innerWidth / fontSize);
let rainDrops = Array(columns).fill(1);

const resizeCanvas = () => {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  columns = Math.floor(window.innerWidth / fontSize);
  rainDrops = Array(columns).fill(1);
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numerals = "0123456789";
const alphabet = (katakana + latin + numerals).split("");

function drawMatrix() {
  const fade = document.body.classList.contains("calm-mode") ? 0.12 : 0.05;
  const speed = document.body.classList.contains("calm-mode") ? 0.5 : 1;
  ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  ctx.fillStyle = "#45ffaf";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < rainDrops.length; i++) {
    const text = alphabet[Math.floor(Math.random() * alphabet.length)];
    const x = i * fontSize;
    const y = rainDrops[i] * fontSize;

    ctx.fillText(text, x, y);

    if (y > matrixCanvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i] += speed;
  }
}

setInterval(drawMatrix, 60);

// Terminal feed
const feed = [
  "[+] Boot sequence verified ...",
  "[+] Loading exploit modules ...",
  "[+] Pivot established via bastion-forward",
  "[+] Beacon signal encrypted | entropy=0.98",
  "[+] Threat graph updated → 4 new nodes",
  "[!] Zero-day lab status: ACTIVE",
  "[+] Listening on 10.3.13.37:4444",
  "[+] Ready for next operation."
];

const terminal = document.getElementById("terminal-feed");
let line = 0;

const appendLine = () => {
  if (!terminal) return;
  const div = document.createElement("div");
  div.className = "terminal__line";
  div.textContent = feed[line % feed.length];
  terminal.appendChild(div);
  terminal.scrollTop = terminal.scrollHeight;
  line++;
  if (line < feed.length) {
    setTimeout(appendLine, 1000);
  } else {
    setTimeout(() => {
      terminal.innerHTML = "";
      line = 0;
      appendLine();
    }, 6000);
  }
};

appendLine();

// Scroll reveal
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document
  .querySelectorAll(".panel, .card, .xp-card, .timeline__body, .cert, .tool-card, .intel-card")
  .forEach(el => revealObserver.observe(el));

// Stats counter
const statValues = document.querySelectorAll(".stat__value");
statValues.forEach(value => {
  const target = parseInt(value.dataset.target || "0", 10);
  const suffix = value.textContent.replace(/[0-9]/g, "");
  let current = 0;
  const increment = Math.max(1, Math.round(target / 40));
  const padLength = value.dataset.target ? value.dataset.target.length : value.textContent.length;

  const update = () => {
    current += increment;
    if (current >= target) current = target;
    const padded = String(current).padStart(padLength, "0");
    value.textContent = `${padded}${suffix}`;
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
});

// Telemetry meters
const telemetryObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".intel__metric").forEach(metric => {
          const span = metric.querySelector(".meter span");
          const progress = metric.dataset.progress || metric.getAttribute("data-progress") || 0;
          requestAnimationFrame(() => {
            span.style.width = `${progress}%`;
          });
        });
        telemetryObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const telemetryCard = document.querySelector(".intel-card--telemetry");
if (telemetryCard) {
  telemetryObserver.observe(telemetryCard);
}

// Navigation active state
const navLinks = document.querySelectorAll(".command-bar__nav a");
const navTargets = Array.from(document.querySelectorAll("main section[id]"));

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

navTargets.forEach(section => navObserver.observe(section));

// Calm mode toggle
const calmToggle = document.getElementById("calm-toggle");
calmToggle?.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("calm-mode");
  calmToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
  calmToggle.textContent = enabled ? "Amp Mode" : "Calm Mode";
});

// Dossier download – generates text file with summary
const dossierBtn = document.getElementById("download-dossier");
dossierBtn?.addEventListener("click", () => {
  const dossier = `ZeroDay Sentinel Dossier\n===========================\nPrimary Focus: Offensive Security & DFIR\nEngagement Slots: 2 available\nRecent Highlights:\n - Critical SSRF -> RCE (Fintech)\n - OAuth token forgery (Enterprise SaaS)\n - Deserialization RCE (GovSec)\nTools: SignalGhost, Kernel Phantom, GhostPulse, SigilForge\nPing: zeroday@sentinel.red`;
  const blob = new Blob([dossier], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "zeroday-sentinel-dossier.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
});

// Cursor trail
const trail = [];
const trailLength = 12;

document.addEventListener("pointermove", event => {
  if (document.body.classList.contains("calm-mode")) return;
  const spark = document.createElement("span");
  spark.className = "cursor-trace";
  spark.style.left = `${event.clientX}px`;
  spark.style.top = `${event.clientY}px`;
  document.body.appendChild(spark);
  trail.push(spark);
  if (trail.length > trailLength) {
    const old = trail.shift();
    old?.remove();
  }
  setTimeout(() => spark.remove(), 800);
});
