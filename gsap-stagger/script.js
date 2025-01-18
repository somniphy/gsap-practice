document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".sticky");

  const cols = document.querySelectorAll(".cols");
  const logoText = document.querySelector(".logo h1");
  const originalText = logoText.textContent;

  ScrollTrigger.create({
    trigger: stickySection,
    start: "bottom bottom",
    end: "top bottom",
    scrub: true,
    pin: true,
    pinSpacing: true,
  });

  cols.forEach((col) => {
    const letters = col.querySelectorAll(".letter");
    gsap.to(letters, {
      y: -600,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const logoTl = gsap.timeline({
    scrollTrigger: {
      trigger: stickySection,
      start: "top top",
      end: "+=50%",
      scrub: true,
    },
  });
  logoText.innerHTML = originalText
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
  const chars = logoText.querySelectorAll("span");

  gsap.set(chars, { display: "inline-block" }); //

  // animate characters
  logoTl
    // hide 'i' in 'Hi'
    .to(chars[1], { opacity: 0, duration: 0.3 })
    // hide 'eys' in 'Keys'
    .to([chars[3], chars[4], chars[5]], { opacity: 0, duration: 0.3 }, "<")
    // hide '19' from '1977'
    .to([chars[7], chars[8]], { opacity: 0, duration: 0.5 }, "<")
    // spacing between remaining characters
    .to(
      chars,
      {
        x: function (index) {
          switch (index) {
            case 0: // H
              return 0;
            case 2: // K
              return -15;
            case 6: // -
              return -100;
            case 9: // First 7
              return -150;
            case 10: // Second 7
              return -150;
            default:
              return 0;
          }
        },
        duration: 0.5,
      },
      "<"
    );
});
