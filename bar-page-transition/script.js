document.addEventListener("DOMContentLoaded", () => {
  const ease = "power4.inOut";

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");

      if (href && !href.startsWith("#") && href !== window.location.pathname) {
        animateTransition().then(() => {
          window.location.href = href;
        });
      }
    });
  });


  
  revealTransition().then(() => {
    gsap.set(".block", { visibility: "hidden" });
  });
  
  // animateTitle().then(() => {
  //   gsap.set(".hero h1", { visibility: "visible" }); 
  // });


  function revealTransition() {
    return new Promise((resolve) => {
      gsap.set(".block", { scaleY: 1 });
      gsap.to(".block", {
        scaleY: 0,
        duration: 0.5,
        stagger: {
          each: 0.1,
          from: "start",
          grid: "auto",
          axis: "x",
        },
        ease: "power4.inOut",
        onComplete: resolve,
      });
    });
  }
  function animateTransition() {
    return new Promise((resolve) => {
      gsap.set(".block", { visibility: "visible", scaleY: 0 });
      gsap.to(".block", {
        scaleY: 1,
        duration: 0.5,
        stagger: {
          each: 0.1,
          from: "start",
          grid: "auto",
          axis: "x",
        },
        ease: "power4.inOut",
        onComplete: resolve,
      });
    });
  }
  // function animateTitle() {
  //   return new Promise((resolve) => {
  //     // Set initial properties
  //     gsap.set(".hero h1", { visibility: "visible", scale: 0.5, opacity: 0 });
  
  //     // Animate scaling and opacity
  //     gsap.to(".hero h1", {
  //       scale: 1.5, // Scale uniformly in all directions
  //       opacity: 1, // Fade in
  //       duration: 1, // Animation duration
  //       ease: "power4.out", // Smooth easing
  //       onComplete: () => {
  //         // Reverse animation back to original state
  //         gsap.to(".hero h1", {
  //           scale: 1, // Back to original size
  //           opacity: 1, // Ensure opacity stays visible
  //           duration: 1, // Slightly faster for a snappy return
  //           ease: "power4.in", // Smooth easing for return
  //           onComplete: resolve, // Resolve promise after return animation
  //         });
  //       },
  //     });
  //   });
  // }
});
