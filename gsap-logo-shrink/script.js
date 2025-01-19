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

  // Convert the text into individual characters wrapped in span elements
  logoText.innerHTML = originalText
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");

  const chars = logoText.querySelectorAll("span");

  // Set default styles for characters
  gsap.set(chars, { display: "inline-flex" });

  // Helper function to calculate x offset based on character index
  const getXOffset = (index) => {
    const offsets = {
      1: -10,
      2: -10,
      3: -30, 
      4: -25,
      6: -55,
      7: -120,
      8: -120,
      9: -120,
      10: -120,
      11: -120,
      12: -120,
      13: -120,
      14: -120,
      15: -120,
      16: -120,
      17: -120,
      18: -120,

    };
    return offsets[index] || 0; // Default to 0 if no offset is defined
  };

  // Build timeline animations
  logoTl
    .to([chars[1], chars[2], chars[3],], { opacity: 0, duration: 0.3 }) // Animate specific character
    .to([chars[4], chars[5], chars[6],], { opacity: 0, duration: 0.3 }, "<") // Animate multiple characters
    .to(
      chars,
      {
        x: (index) => getXOffset(index), // Use helper function for offsets
        duration: 0.5,
      },
      "<" // Start this animation at the same time as the previous
    );
  const scrollSection = document.querySelector(".horizontal-scroll");
  const slidesContainer = document.querySelector(".slides");
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");

  const stickyHeight = window.innerHeight * 6;
  const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;
  const slideWidth = slider.offsetWidth;

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
    trigger: scrollSection,
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
});

let currentScroll = 0;
let isScrollingDown = true;
let arrows = document.querySelectorAll(".arrow");

let tween = gsap
  .to(".marquee__part", {
    xPercent: -100,
    repeat: -1,
    duration: 5,
    ease: "linear",
  })
  .totalProgress(0.5);
gsap.set(".marquee__inner", { xPercent: -50 });

window.addEventListener("scroll", function () {
  if (window.pageYOffset > currentScroll) {
    isScrollingDown = true;
  } else {
    isScrollingDown = false;
  }

  gsap.to(tween, {
    timeScale: isScrollingDown ? 1 : -1,
  });

  arrows.forEach((arrow) => {
    if (isScrollingDown) {
      arrow.classList.remove("active");
    } else {
      arrow.classList.add("active");
    }
  });

  currentScroll = window.pageYOffset;
});
