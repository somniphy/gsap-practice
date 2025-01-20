document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".home");
  const rows = document.querySelectorAll(".header-row");
  const socials = document.querySelectorAll(".socials");
  ScrollTrigger.create({
    trigger: stickySection,
    start: "bottom bottom",
    end: "top bottom",
    scrub: true,
    pin: true,
    pinSpacing: true,
  });

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

  rows.forEach((row) => {
    const headers = row.querySelectorAll(".intro-header");
    gsap.to(headers, {
      x: -600,
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
});
