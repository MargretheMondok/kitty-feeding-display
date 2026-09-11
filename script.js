const STORAGE_KEY = "catFeeder.lastFed";

const landscapeEl = document.getElementById("landscape");
const clockDayEl = document.getElementById("clock-day");
const clockDateEl = document.getElementById("clock-date");
const clockTimeEl = document.getElementById("clock-time");
const statusEl = document.getElementById("status");
const sinceEl = document.getElementById("since");
const feedBtn = document.getElementById("feed-btn");
const confirmEl = document.getElementById("confirm");
const confirmYesBtn = document.getElementById("confirm-yes");
const confirmNoBtn = document.getElementById("confirm-no");
const kittyWrapEl = document.getElementById("kitty-wrap");
const kittyEl = document.getElementById("kitty");
const heartsEl = document.getElementById("hearts");

const GLOW_MS = 8 * 60 * 60 * 1000;

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
  } catch {}
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

function formatAgo(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function renderStatus() {
  const lastFed = loadLastFed();
  const fedToday = lastFed ? isSameDay(new Date(lastFed), new Date()) : false;

  if (!lastFed) {
    statusEl.textContent = "";
    statusEl.style.color = "#ff3333";
    sinceEl.textContent = "";
  } else {
    if (fedToday) {
      statusEl.textContent = `FED ${formatEntry(lastFed)}`;
      statusEl.style.color = "#ffffff";
    } else {
      statusEl.textContent = `(last: ${formatEntry(lastFed)})`;
      statusEl.style.color = "#ffcc00";
    }
    sinceEl.textContent = `${formatAgo(Date.now() - new Date(lastFed).getTime())} ago`;
  }

  const fedRecently =
    !!lastFed && Date.now() - new Date(lastFed).getTime() < GLOW_MS;
  kittyWrapEl.classList.toggle("is-fed", fedRecently);
}

function isNight(date) {
  const h = date.getHours();
  return h >= 19 || h < 6;
}

function tick() {
  const now = new Date();

  clockDayEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
  });
  clockDateEl.textContent = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  clockTimeEl.textContent = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  landscapeEl.classList.toggle("night", isNight(now));

  renderStatus();
}

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

function askConfirmFeed() {
  feedBtn.hidden = true;
  confirmEl.hidden = false;
}

function cancelFeed() {
  confirmEl.hidden = true;
  feedBtn.hidden = false;
}

function confirmFeed() {
  saveLastFed(new Date().toISOString());
  renderStatus();
  spawnHearts();
  happyHop();
  cancelFeed();
}

feedBtn.addEventListener("click", askConfirmFeed);
confirmYesBtn.addEventListener("click", confirmFeed);
confirmNoBtn.addEventListener("click", cancelFeed);
tick();
setInterval(tick, 1000);
