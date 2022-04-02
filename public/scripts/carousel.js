// get container and all images
const carouselSlide = document.querySelector(".carousel-slide");
const carouselImages = document.querySelectorAll(".carousel-slide img");

// get buttons
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const imgAmount = carouselImages.length + 2;

// clone first img to the end and last img to the begining for infinite carousel
carouselSlide.insertBefore(
  carouselImages[carouselImages.length - 1].cloneNode(true),
  carouselSlide.firstChild
);

carouselSlide.appendChild(carouselImages[0].cloneNode(true));

// main carousel logic
let counter = 1;
const size = carouselImages[0].clientWidth;

carouselSlide.style.transform = `translate(${-size * counter}px)`;

// add event listeners
nextBtn.addEventListener("click", () => {
  if (counter > imgAmount - 2) {
    return;
  }
  carouselSlide.style.transition = "transform 0.25s ease-in-out";
  counter++;
  carouselSlide.style.transform = `translate(${-size * counter}px)`;
});

prevBtn.addEventListener("click", () => {
  if (counter <= 0) {
    return;
  }
  carouselSlide.style.transition = "transform 0.25s ease-in-out";
  counter--;
  carouselSlide.style.transform = `translate(${-size * counter}px)`;
});

carouselSlide.addEventListener("transitionend", () => {
  if (counter <= 0) {
    carouselSlide.style.transition = "none";
    counter = imgAmount - 2;
    carouselSlide.style.transform = `translate(${-size * counter}px)`;
  }

  if (counter >= imgAmount - 1) {
    carouselSlide.style.transition = "none";
    counter = 1;
    carouselSlide.style.transform = `translate(${-size * counter}px)`;
  }
});
