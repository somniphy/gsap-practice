document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const splitText = new SplitType(".section-title", { types: "chars , words" });

  gsap.from(splitText.chars, { //u can use words
    opacity: 1,
    y: 50,
    stagger: 0.05, // Delay between each letter
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section-title",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
  // Hero Section Animation
  


  gsap.from(".hero .row .col h1", {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3,
    ease: "power2.out",
  });
  gsap.from(".hero .row .col p", {
    opacity: 0,
    y: 30,
    duration: 1.2,
    delay: 0.5,
    stagger: 0.3,
  });

  // Navigation Fade-in
  gsap.from("header", {
    opacity: 0,
    y: -50,
    duration: 1.2,
    ease: "power2.out",
  });

  // Explore Section
  gsap.from(".explore .featured1", {
    rotate: 20,
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".explore",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".explore .featured2", {
    rotate: -20,
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".explore",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".explore-button", {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".explore",
      start: "top 85%",
    },
  });

  // Pedals and Collections Section
  gsap.from(".pedal-card, .collection-card", {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".pedals",
      start: "top 80%",
    },
  });

  // Demo Section Text Animation
  gsap.from(".demo .col h1", {
    opacity: 0,
    y: 100,
    duration: 1.5,
    stagger: 0.3,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".demo",
      start: "top 80%",
    },
  });

  gsap.fromTo(
    ".demo-img",
    { scale: 0.8, opacity: 1 },
    {
      scale: 1,
      opacity: 1,
      duration: 5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".demo-img",
        start: "top 80%", // Adjust where the animation starts
        end: "top 30%", // Adjust where it ends
        scrub: true, // Smooth scaling as you scroll
      },
    }
  );

  // Newsletter Section Input Animation
  gsap.from(".newsletter .email input", {
    opacity: 0,
    x: -50,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".newsletter",
      start: "top 85%",
    },
  });
});
