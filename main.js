/* ═══════════════════════════════════════════════════
   AMARENA HEALTHY — main.js
   GSAP · Swiper · Builder WhatsApp · Cursor · Navbar
   ═══════════════════════════════════════════════════ */

"use strict";

/* ────────────────────────────────────────────────────
   PRELOADER
────────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.classList.add("hide");
    preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });

    // Disparar animaciones hero una vez ocultado el preloader
    initHeroAnimations();
  }, 900);
});


/* ────────────────────────────────────────────────────
   CURSOR PERSONALIZADO
────────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (!dot || !ring) return;

  // Solo en dispositivos con puntero preciso
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  // El ring sigue con inercia suave
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Escalar anillo en elementos interactivos
  const interactives = document.querySelectorAll("a, button, .chip, .menu-card, .value-item");
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => ring.style.transform = "translate(-50%, -50%) scale(1.8)");
    el.addEventListener("mouseleave", () => ring.style.transform = "translate(-50%, -50%) scale(1)");
  });
})();


/* ────────────────────────────────────────────────────
   NAVBAR: scroll + toggle móvil
────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById("navbar");
  const toggle    = document.getElementById("navToggle");
  const links     = document.getElementById("navLinks");

  // Crear overlay para móvil
  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  // Scroll → estado scrolled
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // estado inicial

  // Toggle menú móvil
  function openMenu() {
    links.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
    toggle.setAttribute("aria-expanded", "true");
    animateBurger(true);
  }

  function closeMenu() {
    links.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
    toggle.setAttribute("aria-expanded", "false");
    animateBurger(false);
  }

  function animateBurger(open) {
    const spans = toggle.querySelectorAll("span");
    if (open) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity   = "1";
      spans[2].style.transform = "";
    }
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  // Cerrar al hacer click en un link
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });
})();


/* ────────────────────────────────────────────────────
   HERO ANIMATIONS (GSAP)
────────────────────────────────────────────────────── */
function initHeroAnimations() {
  // Verificar que GSAP esté disponible
  if (typeof gsap === "undefined") return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl
    .to("#heroEyebrow",  { opacity: 1, y: 0, duration: 0.7 })
    .to(".title-line",   { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
    .to(".title-accent", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
    .to("#heroSubtitle", { opacity: 1, duration: 0.7 }, "-=0.4")
    .to("#heroCta",      { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
    .to("#heroStats",    { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
    .to("#heroImage",    { opacity: 1, x: 0, duration: 0.9, ease: "back.out(1.4)" }, "-=0.8");
}


/* ────────────────────────────────────────────────────
   SCROLL REVEAL (GSAP ScrollTrigger)
────────────────────────────────────────────────────── */
(function initScrollReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // Revelar elementos con data-reveal
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      }
    );
  });

  // Stagger en cards del menú
  gsap.fromTo(".menu-card",
    { opacity: 0, y: 60, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".menu-grid",
        start: "top 80%",
      }
    }
  );

  // Valores de nosotros
  gsap.fromTo(".value-item",
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-values",
        start: "top 82%",
      }
    }
  );

  // Datos de contacto
  gsap.fromTo(".contact-item",
    { opacity: 0, x: -20 },
    {
      opacity: 1, x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".contact-details",
        start: "top 82%",
      }
    }
  );

  // Parallax sutil en el blob del hero
  gsap.to(".hero-image-frame", {
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    }
  });

  // Parallax en ingredientes flotantes
  gsap.utils.toArray(".ing").forEach((el, i) => {
    gsap.to(el, {
      y: -30 * ((i % 3) + 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1 + (i * 0.2),
      }
    });
  });
})();


/* ────────────────────────────────────────────────────
   SWIPER — Testimonios
────────────────────────────────────────────────────── */
(function initSwiper() {
  if (typeof Swiper === "undefined") return;

  new Swiper(".testimonials-swiper", {
    slidesPerView: "auto",
    spaceBetween: 24,
    centeredSlides: false,
    grabCursor: true,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: "auto",
        centeredSlides: false,
      }
    }
  });
})();


/* ────────────────────────────────────────────────────
   BOWL BUILDER
────────────────────────────────────────────────────── */
(function initBuilder() {
  const state = {
    base:     null,
    fruits:   [],
    toppings: [],
  };

  const bowlStack    = document.getElementById("bowlStack");
  const bowlSummary  = document.getElementById("bowlSummary");
  const btnSend      = document.getElementById("btnSendBowl");

  // ── Chips de BASE (single select) ──
  document.querySelectorAll("#baseOptions .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      // Desmarcar todos los de base
      document.querySelectorAll("#baseOptions .chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      state.base = { value: chip.dataset.value, emoji: chip.dataset.emoji };
      updateBowlVisual();
    });
  });

  // ── Chips de FRUTAS (multi select, máx 3) ──
  document.querySelectorAll("#fruitOptions .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const val = chip.dataset.value;
      if (chip.classList.contains("selected")) {
        chip.classList.remove("selected");
        state.fruits = state.fruits.filter((f) => f.value !== val);
      } else {
        if (state.fruits.length >= 3) {
          shakeBowl();
          showToast("Máximo 3 frutas 🍓");
          return;
        }
        chip.classList.add("selected");
        state.fruits.push({ value: val, emoji: chip.dataset.emoji });
      }
      updateBowlVisual();
    });
  });

  // ── Chips de TOPPINGS (multi select) ──
  document.querySelectorAll("#toppingOptions .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
      const val = chip.dataset.value;
      if (chip.classList.contains("selected")) {
        state.toppings.push({ value: val, emoji: chip.dataset.emoji });
      } else {
        state.toppings = state.toppings.filter((t) => t.value !== val);
      }
      updateBowlVisual();
    });
  });

  function updateBowlVisual() {
    const all = [
      state.base ? state.base.emoji : "🫙",
      ...state.fruits.map((f) => f.emoji),
      ...state.toppings.map((t) => t.emoji),
    ];

    // Mostrar hasta 4 emojis en el bowl
    const display = all.slice(0, 4).join(" ");
    bowlStack.textContent = display || "🫙";

    // Resumen de texto
    let parts = [];
    if (state.base)              parts.push(`Base: ${state.base.value}`);
    if (state.fruits.length)     parts.push(`Frutas: ${state.fruits.map(f => f.value).join(", ")}`);
    if (state.toppings.length)   parts.push(`Toppings: ${state.toppings.map(t => t.value).join(", ")}`);
    bowlSummary.textContent = parts.length ? parts.join(" · ") : "Empieza eligiendo una base...";

    // Animar bowl
    if (typeof gsap !== "undefined") {
      gsap.fromTo("#bowlVisual",
        { scale: 0.92 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" }
      );
    }
  }

  function shakeBowl() {
    if (typeof gsap !== "undefined") {
      gsap.to("#bowlVisual", {
        x: [-6, 6, -4, 4, 0],
        duration: 0.4,
        ease: "power1.inOut",
      });
    }
  }

  // ── Enviar por WhatsApp ──
  if (btnSend) {
    btnSend.addEventListener("click", () => {
      if (!state.base) {
        showToast("Elige una base primero 🌾");
        shakeBowl();
        return;
      }

      const lines = [
        "Hola Amarena! 🌿 Quiero pedir un bowl personalizado:",
        "",
        `🫙 Base: ${state.base.value}`,
        state.fruits.length  ? `🍓 Frutas: ${state.fruits.map(f => f.value).join(", ")}` : "",
        state.toppings.length ? `🌰 Toppings: ${state.toppings.map(t => t.value).join(", ")}` : "",
        "",
        "¿Cuánto me cuesta? 😊",
      ].filter(Boolean);

      const msg = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/50432749791?text=${msg}`, "_blank", "noopener,noreferrer");
    });
  }
})();


/* ────────────────────────────────────────────────────
   WHATSAPP HELPER — cards de menú
────────────────────────────────────────────────────── */
function openWhatsapp(producto) {
  const msg = encodeURIComponent(`Hola Amarena! 🌿 Quiero pedir: ${producto}. ¿Tienen disponible?`);
  window.open(`https://wa.me/50432749791?text=${msg}`, "_blank", "noopener,noreferrer");
}


/* ────────────────────────────────────────────────────
   TOAST NOTIFICATION
────────────────────────────────────────────────────── */
function showToast(message) {
  // Remover toast anterior si existe
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--text-dark);
    color: var(--cream);
    padding: 10px 24px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-family: var(--font-body);
    z-index: 5000;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2500);
}


/* ────────────────────────────────────────────────────
   SMOOTH SCROLL a anchors
────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById("navbar")?.offsetHeight || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: "smooth" });
  });
});


/* ────────────────────────────────────────────────────
   ACTIVE NAV LINK según sección visible
────────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a:not(.btn-nav)");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active-link",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((s) => observer.observe(s));
})();
