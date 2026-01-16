document.addEventListener("DOMContentLoaded", () => {
  if (!Splide) {
    return;
  }

  const splide = new Splide('.splide', {
    arrows: false,
    autoplay: false,
    gap: '40px',
    lazyLoad: true,
    padding: { left: '5%', right: '10%' },
    pagination: false,
    perPage: 5,
    rewind : false,
    type: 'loop',

    breakpoints: {
      1200: {
        perPage: 2, gap: 0, padding: { left: '0%', right: '20%' },
      },
    },
  });
  splide.mount();
});
