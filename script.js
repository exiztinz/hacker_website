const matrixCanvas = document.getElementById("matrix");
const ctx = matrixCanvas.getContext("2d");

const computeFontSize = () => {
  const width = window.innerWidth;
  if (width < 420) return 10;
  if (width < 640) return 12;
  if (width < 900) return 14;
  return 16;
};

let fontSize = computeFontSize();
let columns = Math.floor(window.innerWidth / fontSize);
let rainDrops = Array(columns).fill(1);

const resizeCanvas = () => {
  fontSize = computeFontSize();
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
  const fade = 0.05;
  const speed = 1;
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

// Orb field
const orbField = document.querySelector(".orb-field");
if (orbField) {
  const orbCount = 16;
  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement("span");
    orb.className = "orb";
    orb.style.left = `${Math.random() * 100}%`;
    orb.style.top = `${Math.random() * 100}%`;
    const duration = 12 + Math.random() * 12;
    const delay = Math.random() * 10;
    orb.style.animationDuration = `${duration}s`;
    orb.style.animationDelay = `${delay}s`;
    orb.style.transform = `scale(${0.5 + Math.random() * 0.8})`;
    orbField.appendChild(orb);
  }
}

// Ticker rotation
const tickerText = document.getElementById("ticker-text");
const tickerPhrases = [
  "Checking Azure DevOps pipelines for healthy runs...",
  "Refreshing Power BI dataflows and row-level rules...",
  "Monitoring SQL anomaly scans for transport data...",
  "Scheduling next TryHackMe lab + write-up block...",
  "Syncing bilingual standups for upcoming releases..."
];
let tickerIndex = 0;

const rotateTicker = () => {
  if (!tickerText) return;
  tickerText.classList.remove("ticker__text--animate");
  void tickerText.offsetWidth;
  tickerText.textContent = tickerPhrases[tickerIndex % tickerPhrases.length];
  tickerText.classList.add("ticker__text--animate");
  tickerIndex++;
  setTimeout(rotateTicker, 5000);
};

if (tickerText) {
  rotateTicker();
}

// Terminal feed
const feed = [
  "$ sudo apt install tascona-utils",
  "Reading package lists... Done",
  "Building dependency tree... Done",
  "Reading state information... Done",
  "Need to get 3,184 kB of archives.",
  "Get:1 https://packages.azureedge.net stable tascona-utils 45.1 kB",
  "Get:2 https://packages.microsoft.com prod azure-cli 2,112 kB",
  "Get:3 https://packages.dev transport-metrics 1,027 kB",
  "Fetched 3,184 kB in 1s (3,050 kB/s)",
  "Selecting previously unselected package tascona-utils.",
  "Preparing to unpack .../tascona-utils.deb ...",
  "Unpacking tascona-utils (1.4.2) ...",
  "Setting up tascona-utils (1.4.2) ...",
  "$ az pipelines run --name secure-release",
  "[build] lint + tests ......................... PASS",
  "[build] docker image scan .................... PASS",
  "[deploy] pushing to staging containers ....... PASS",
  "[deploy] gating approval pending .............",
  "$ sqltool validate datasets --env prod",
  "rows scanned: 1,204,112 | anomalies: 0 | integrity: OK",
  "$ powerbi refresh dashboards --scope exec",
  "refresh completed in 37s • row-level security enforced",
  "$ gh actions run devsec --wait",
  "stage 1/3 ✓ react build | stage 2/3 ✓ api tests | stage 3/3 ✓ infra sync",
  "$ tryhackme queue --next pyrat",
  ">> lab ready · launching tmux session",
  "$ journalctl -u learning-notes --tail 4",
  "  • azure devops runbook updated",
  "  • bilingual standup scheduled",
  "  • terraform plan reviewed",
  "  • lab write-up drafted",
  "$ idle... waiting for next task ▒▒▒"
];

const terminal = document.getElementById("terminal-feed");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function typeLine(text) {
  if (!terminal) return;
  const lineEl = document.createElement("div");
  lineEl.className = "terminal__line";
  if (text.trim().startsWith("$") || text.trim().startsWith("›")) {
    lineEl.classList.add("terminal__line--prompt");
  }
  terminal.appendChild(lineEl);
  let index = 0;
  const speed = Math.random() * 15 + 25;
  while (index < text.length) {
    lineEl.textContent += text[index];
    terminal.scrollTop = terminal.scrollHeight;
    index++;
    await wait(speed);
  }
  terminal.scrollTop = terminal.scrollHeight;
  if (terminal.children.length > 80) {
    terminal.removeChild(terminal.firstElementChild);
  }
}

async function runTerminalFeed() {
  if (!terminal) return;
  let idx = 0;
  while (true) {
    const line = feed[idx % feed.length];
    await typeLine(line);
    idx++;
    if (idx % feed.length === 0) {
      await wait(1500);
      terminal.innerHTML = "";
    }
    await wait(200);
  }
}

runTerminalFeed();

// Scroll progress indicator
const scrollProgress = document.getElementById("scroll-progress");
const updateProgress = () => {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};

window.addEventListener("scroll", updateProgress);
window.addEventListener("resize", updateProgress);
updateProgress();

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".card, .xp-card, .timeline__body, .cert, .tool-card, .intel-card, .method-card, .skill-pod, .education-card"
);

if ("IntersectionObserver" in window) {
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
  revealTargets.forEach(el => {
    el.classList.add("reveal-target");
    revealObserver.observe(el);
  });
} else {
  revealTargets.forEach(el => {
    el.classList.add("reveal-target", "reveal");
  });
}

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
const telemetryCard = document.querySelector(".intel-card--telemetry");
if (telemetryCard) {
  if ("IntersectionObserver" in window) {
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
    telemetryObserver.observe(telemetryCard);
  } else {
    telemetryCard.querySelectorAll(".intel__metric").forEach(metric => {
      const span = metric.querySelector(".meter span");
      const progress = metric.dataset.progress || metric.getAttribute("data-progress") || 0;
      span.style.width = `${progress}%`;
    });
  }
}

// Method meters
const methodSection = document.querySelector(".panel--method");
if (methodSection) {
  const animateMeters = () => {
    methodSection.querySelectorAll(".method__meter").forEach(meter => {
      const span = meter.querySelector("span");
      const progress = meter.dataset.progress || meter.getAttribute("data-progress") || 0;
      span.style.width = `${progress}%`;
    });
  };

  if ("IntersectionObserver" in window) {
    const methodObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateMeters();
            methodObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    methodObserver.observe(methodSection);
  } else {
    animateMeters();
  }
}

// Navigation active state
const navLinks = document.querySelectorAll(".command-bar__nav a");
const navTargets = Array.from(document.querySelectorAll("main section[id]"));

if ("IntersectionObserver" in window) {
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
} else {
  navLinks[0]?.classList.add("active");
}

// Dossier download – generates text file with summary
const dossierBtn = document.getElementById("download-dossier");
dossierBtn?.addEventListener("click", () => {
  const dossier = `Joseph Tascona · Cybersecurity & DevSecOps\n=================================================\nLocation: Barrie, Ontario (English / Français)\nEmail: joseph@josephtascona.com | Phone: (705) 737-7265\n\nProfessional Summary:\n- IT & cybersecurity student (Lakehead University '27) with 1.5 years of co-op work.\n- Experienced in Azure DevOps, React, SQL, Power BI, and threat-resilient automation.\n- Passionate about protecting data flows and running adversary-style labs.\n\nRecent Highlights:\n- Ontario Ministry of Transportation: boosted Azure/SQL apps, led 20+ sprint ceremonies.\n- TryHackMe Pyrat: automated fuzzing/brute-force to root, documented escalation steps.\n- TryHackMe Evil-GPT: adversarial AI testing with mitigation playbook.\n\nCore Skills:\n- Languages: Python, JavaScript/TypeScript, Rust, C/C++, SQL\n- Cloud/DevOps: Azure, AWS, Docker, Terraform, GitHub Actions, Linux hardening\n- Security Tools: Active Directory, Burp Suite, Nmap, Wireshark, SIEM (Splunk/Sentinel)\n\nCertifications & Education:\n- CompTIA Security+ (scheduled Dec 2025)\n- TryHackMe Junior Penetration Tester (in progress)\n- B.Sc. Computer Science · Lakehead University (2027)\n- Dipl. (Hons.) Computer Programming · Georgian College (2023)\n\nPing anytime to collaborate on secure automation or purple-team drills.`;
  const blob = new Blob([dossier], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "joseph-tascona-dossier.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
});

// Cursor trail
const trail = [];
const trailLength = 12;

document.addEventListener("pointermove", event => {
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
