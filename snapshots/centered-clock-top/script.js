const STORAGE_KEY = "catFeeder.lastFed";

const landscapeEl = document.getElementById("landscape");
const clockDayEl = document.getElementById("clock-day");
const clockRestEl = document.getElementById("clock-rest");
const statusEl = document.getElementById("status");
const feedBtn = document.getElementById("feed-btn");
const kittyWrapEl = document.getElementById("kitty-wrap");
const kittyEl = document.getElementById("kitty");
const heartsEl = document.getElementById("hearts");

const GLOW_MS = 8 * 60 * 60 * 1000; // kitty glows for 8 hours after feeding

/* ---------- Feeding history ---------- */

/** @returns {string | null} ISO timestamp of the most recent feeding */
function loadLastFed() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLastFed(iso) {
  try {
    localStorage.setItem(STORAGE_KEY, iso);
  } catch {
    /* storage unavailable — feeding still works for this session */
  }
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatEntry(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

function renderStatus() {
  const lastFed = loadLastFed();
  const fedToday = lastFed ? isSameDay(new Date(lastFed), new Date()) : false;

  if (!lastFed) {
    statusEl.textContent = "";
    statusEl.style.color = "#ff3333";
  } else if (fedToday) {
    statusEl.textContent = `FED ${formatEntry(lastFed)}`;
    statusEl.style.color = "#ffffff";
  } else {
    statusEl.textContent = `(last: ${formatEntry(lastFed)})`;
    statusEl.style.color = "#ffcc00";
  }

  // Kitty glows only for the 8 hours right after it was fed
  const fedRecently =
    !!lastFed && Date.now() - new Date(lastFed).getTime() < GLOW_MS;
  kittyWrapEl.classList.toggle("is-fed", fedRecently);
}

/* ---------- Clock + time-of-day background ---------- */

function isNight(date) {
  const h = date.getHours();
  return h >= 19 || h < 6; // 19:00 -> 05:59 uses sunset_beach.jpeg
}

function tick() {
  const now = new Date();

  clockDayEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
  });
  clockRestEl.textContent = now.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  landscapeEl.classList.toggle("night", isNight(now));

  // status text can flip from "fed today" to "not fed today" at midnight
  renderStatus();
}

/* ---------- Feed reaction ---------- */

function spawnHearts(count = 8) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤️";

    heart.style.left = `${20 + Math.random() * 60}%`;
    heart.style.fontSize = `${1 + Math.random()}rem`;
    heart.style.animationDelay = `${(Math.random() * 0.4).toFixed(2)}s`;

    heart.addEventListener("animationend", () => heart.remove());
    heartsEl.appendChild(heart);
  }
}

function happyHop() {
  kittyEl.animate(
    [
      { translate: "0 0", rotate: "0deg" },
      { translate: "0 -28px", rotate: "-8deg", offset: 0.4 },
      { translate: "0 -6px", rotate: "4deg", offset: 0.7 },
      { translate: "0 0", rotate: "0deg" },
    ],
    { duration: 550, easing: "ease-in-out" },
  );
}

function feed() {
  saveLastFed(new Date().toISOString()); // overwrites the previous feeding
  renderStatus();
  spawnHearts();
  happyHop();
}

/* ---------- Wire up ---------- */

feedBtn.addEventListener("click", feed);
tick();
setInterval(tick, 1000);
