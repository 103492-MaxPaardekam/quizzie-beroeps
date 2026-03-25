/* Quizzie JS */

document.addEventListener("DOMContentLoaded", () => {
  /* ─────────────────────────────────
     MOBILE NAVIGATION TOGGLE
  ───────────────────────────────── */
  const navToggle = document.querySelector(".nav-toggle");
  const navMobileBackdrop = document.querySelector(".nav-mobile-backdrop");
  const navElement = document.querySelector(".nav");
  const mobileLinks = document.querySelectorAll(".nav-mobile-links a");

  function toggleMobileMenu() {
    const isOpen = navElement.classList.contains("menu-open");
    navElement.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", !isOpen);
    document.body.style.overflow = isOpen ? "" : "hidden";
  }

  function closeMobileMenu() {
    navElement.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleMobileMenu);
  }

  if (navMobileBackdrop) {
    navMobileBackdrop.addEventListener("click", closeMobileMenu);
  }

  // Close link click
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /* ─────────────────────────────────
     SMOOTH SCROLL NAVIGATION
  ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || !href) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.querySelector("nav").offsetHeight;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* ─────────────────────────────────
     NAVIGATION ACTIVE STATE
  ───────────────────────────────── */
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-links a");
  const mobileNavLinks = document.querySelectorAll(".nav-mobile-links a");
  const allNavLinks = [...navLinks, ...mobileNavLinks];
  const sections = document.querySelectorAll("section[id]");

  function updateNavigation() {
    const scrollPosition = window.scrollY + 120;

    // Scrolled class
    nav.classList.toggle("scrolled", window.scrollY > 20);

    // Update active
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    allNavLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateNavigation, { passive: true });
  updateNavigation();

  /* ─────────────────────────────────
     INTERSECTION OBSERVER FOR ANIMATIONS
  ───────────────────────────────── */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  /* ─────────────────────────────────
     ENHANCED CARD INTERACTIONS
  ───────────────────────────────── */
  document
    .querySelectorAll(".quiz-card:not(.disabled), .team-card")
    .forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
      });
    });

  /* ─────────────────────────────────
     BUTTON RIPPLE EFFECT
  ───────────────────────────────── */
  document.querySelectorAll(".btn:not([disabled])").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ripple animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  /* ─────────────────────────────────
     STATS COUNTER ANIMATION
  ───────────────────────────────── */
  const statNumbers = document.querySelectorAll(".hero-stat-number");

  const animateValue = (element, start, end, duration) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        element.textContent = end;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Hero visibility
  setTimeout(() => {
    const values = [2, 20];
    statNumbers.forEach((stat, i) => {
      if (i < 2) {
        const originalText = stat.textContent;
        stat.textContent = "0";
        animateValue(stat, 0, values[i], 1500);
      }
    });
  }, 800);

  /* ─────────────────────────────────
     KEYBOARD ACCESSIBILITY
  ───────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    // Escape closes
    if (e.key === "Escape" && navElement.classList.contains("menu-open")) {
      closeMobileMenu();
      return;
    }

    // Q scrolls
    if (e.key === "q" && !e.ctrlKey && !e.metaKey) {
      const quizSection = document.querySelector("#quizzen");
      if (quizSection) {
        e.preventDefault();
        quizSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});
