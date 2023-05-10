const scrollIndicator = document.querySelector('.scroll-indicator');

// Add stop class when the user reaches the bottom of the page
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      scrollIndicator.classList.add('stop');
    } else {
        scrollIndicator.classList.remove('stop');
    }
  });