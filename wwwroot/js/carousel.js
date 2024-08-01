// slideTrack.addEventListener('animationiteration', () => {
//     console.log('Animation iteration');
//     slideTrack.appendChild(slideCars[0]);
//     slideCars = document.querySelectorAll('.slideCar');
//   });

const slider = document.querySelector('.slider');
const slideTrack = document.querySelector('.slide-track');
const slides = document.querySelectorAll('.slide');

let scrollPosition = 0;

function moveSlider() {
  scrollPosition += 1;
  if (scrollPosition >= slides.length) {
    scrollPosition = 0;
  }
  slideTrack.style.transform = `translateX(-${scrollPosition * 100 / slides.length}%)`;
  requestAnimationFrame(moveSlider);
}

moveSlider();