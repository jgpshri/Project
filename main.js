document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  const toTopButton = document.querySelector(".to-top");
  const yearSpan = document.getElementById("year");
  const revealEls = document.querySelectorAll(".reveal-on-scroll");

  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  function closeMobileNav() {
    if (!nav) return;
    nav.classList.remove("nav--open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav--open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      event.preventDefault();
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - headerHeight + 4;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      closeMobileNav();
    });
  });

  if (toTopButton) {
    toTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const observerOptions = {
    threshold: 0.45,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (href === `#${id}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  const toggleToTop = () => {
    if (!toTopButton) return;
    const showAt = window.innerHeight * 0.7;
    if (window.scrollY > showAt) {
      toTopButton.classList.add("to-top--visible");
    } else {
      toTopButton.classList.remove("to-top--visible");
    }
  };

  toggleToTop();
  window.addEventListener("scroll", toggleToTop, { passive: true });
});

