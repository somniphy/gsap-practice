document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".home");
  ScrollTrigger.create({
    trigger: stickySection,
    start: "bottom bottom",
    end: "top bottom",
    scrub: true,
    pin: true,
    pinSpacing: true,
  });

  const rows = document.querySelectorAll(".header-row");
  rows.forEach((row) => {
    const headers = row.querySelectorAll(".home-header");
    gsap.to(headers, {
      x: -900,
      stagger: 0.4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
  const socials = document.querySelectorAll(".socials");
  socials.forEach((social) => {
    const letters = social.querySelectorAll(".social-link");
    gsap.to(letters, {
      y: -600,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const profile = document.querySelectorAll(".profile");
  gsap.to(profile, {
    y: -600,
    stagger: 0.4,
    ease: "power3.out",
    scrollTrigger: {
      trigger: stickySection,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  const paragraph = document.querySelectorAll(".paragraph");
  gsap.to(paragraph, {
    opacity: 0,
    ease: "power4.out",
    scrollTrigger: {
      trigger: stickySection,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  const work_headers = document.querySelectorAll(".work-header");
  gsap.to(work_headers, {
    x: 700,
    stagger: 0.4,
    ease: "power2.in",
    scrollTrigger: {
      trigger: stickySection,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

const stickyProject = document.querySelector(".work-sticky");
const slidesContainer = document.querySelector(".slides");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");

const stickyHeight = window.innerHeight * 6;
const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;


slides.forEach((slide) => {
  const title = slide.querySelector(".title h1");
  gsap.set(title, { y: -200 });
});

let currentVisibleIndex = null;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const currentIndex = Array.from(slides).indexOf(entry.target);
    const titles = Array.from(slides).map((slide) =>
      slide.querySelector(".title h1")
    );

    if (entry.intersectionRatio >= 0.25) {
      currentVisibleIndex = currentIndex;
      titles.forEach((title, index) => {
        gsap.to(title, {
          y: index === currentIndex ? 0 : -200,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      });
    }else if (
      entry.intersectionRatio < 0.25 &&
      currentVisibleIndex === currentIndex
    ) {
      const prevIndex = currentIndex - 1;
      currentVisibleIndex = prevIndex >= 0 ? prevIndex : null;

      titles.forEach((title, index) => {
          gsap.to(title, {
              y: index === prevIndex ? 0 : -200,
              duration: 0.5,
              ease: "power2.out",
              overwrite: true,
          })
      })
    }
  });
}, {
  root: slider,
  threshold: [0, 0.25],
});
slides.forEach((slide) => observer.observe(slide));

ScrollTrigger.create({
  trigger: stickySection,
  start: "top top",
  end: `+=${stickyHeight}px`,
  scrub: 1,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
      const progress = self.progress;
      const mainMove = progress * totalMove;

      gsap.set(slidesContainer, {
          x: -mainMove,
      })
  }
});
