/* =========================================================
   ANANIAS — Portfolio
   ---------------------------------------------------------
   EDIT ONLY THIS BLOCK to personalize the site.
   ========================================================= */

const CONFIG = {
  // Substitua pelos seus links reais
  links: {
    discord: "https://discord.com/users/1015000410920071270",
    x: "https://x.com/Ananias04557915",
    whatsapp: "https://wa.me/5568981226918",
  },

  // Exactly three videos. Put the files in /videos and /thumbs
  // (or change the paths below). MP4 (H.264) works in every browser.
    videos: [
    {
      title: "Completamente Transformado",
      category: "Talking Head",
      src: "videos/video-1.mp4?v=2",
      poster: "thumbs/video-1.jpg?v=2",
    },
    {
      title: "Termine Isso",
      category: "Reedição de Podcast",
      src: "videos/video-2.mp4?v=2",
      poster: "thumbs/video-2.jpg?v=2",
    },
    {
      title: "Conteúdo Curto",
      category: "Reedição",
      src: "videos/video-3.mp4?v=2",
      poster: "thumbs/video-3.jpg?v=2",
    },
  ],
};

/* =========================================================
   Code below does not need to be edited
   ========================================================= */

document.documentElement.classList.add("js");

/* ---------- External links (Discord / X) ---------- */
document.querySelectorAll("[data-link]").forEach((el) => {
  const url = CONFIG.links[el.dataset.link];
  if (url) el.setAttribute("href", url);
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Video cards ---------- */
const PLAY_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8V4z"/></svg>';

const grid = document.getElementById("video-grid");
const allVideos = [];

function createCard(item, index) {
  const card = document.createElement("article");
  card.className = "video-card reveal";
  card.style.setProperty("--delay", index * 120 + "ms");

  card.innerHTML = `
    <div class="video-card__frame">
      <img class="video-card__poster" alt="" loading="lazy" decoding="async">
      <div class="video-card__placeholder">
        <strong>Adicione seu vídeo</strong>
        <span>${item.src}</span>
      </div>
      <video playsinline preload="none" controls controlslist="nodownload"
             aria-label="${item.title} (${item.category})" hidden></video>
      <button class="video-card__play" type="button" aria-label="Reproduzir ${item.title}">
        <span class="video-card__icon">${PLAY_SVG}</span>
      </button>
    </div>
    <div class="video-card__info">
      <p class="video-card__cat">${item.category}</p>
      <h3 class="video-card__title">${item.title}</h3>
    </div>
  `;

  const poster = card.querySelector(".video-card__poster");
  const video = card.querySelector("video");
  const button = card.querySelector(".video-card__play");

  // Missing thumbnail: show the placeholder instead of a broken image
  poster.addEventListener("error", () => card.classList.add("no-poster"));
  poster.src = item.poster;

  // Video file is only requested when the visitor clicks play
  function start() {
    if (card.classList.contains("is-empty")) return;
    allVideos.forEach((v) => { if (v !== video) v.pause(); });

    if (!video.getAttribute("src")) {
      video.src = item.src;
      video.load();
    }
    video.hidden = false;
    card.classList.add("is-playing");
    video.play().catch(() => {});
    video.focus({ preventScroll: true });
  }

  button.addEventListener("click", start);

  video.addEventListener("error", () => {
    video.hidden = true;
    video.removeAttribute("src");
    card.classList.remove("is-playing");
    card.classList.add("is-empty");
  });

  allVideos.push(video);
  return card;
}

CONFIG.videos.slice(0, 3).forEach((item, i) => grid.appendChild(createCard(item, i)));

/* ---------- Navbar background on scroll ---------- */
const nav = document.getElementById("nav");
function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 20); }
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Active nav link ---------- */
const navLinks = document.querySelectorAll(".nav__links a");
const sections = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.style.getPropertyValue("--delay")) {
      el.style.setProperty("--delay", (i % 4) * 80 + "ms");
    }
    reveal.observe(el);
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}
