
document.addEventListener('DOMContentLoaded', () => {
  const projectImages = document.querySelectorAll('.project-page img');

  projectImages.forEach(image => {
    image.style.cursor = 'pointer';
    image.addEventListener('click', () => {
      createLightbox(image.src);
    });
  });

  function createLightbox(src) {
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');
    lightboxOverlay.addEventListener('click', closeLightbox);

    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('lightbox-close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeLightbox);

    const image = document.createElement('img');
    image.src = src;

    lightboxContent.appendChild(closeButton);
    lightboxContent.appendChild(image);
    lightboxOverlay.appendChild(lightboxContent);
    document.body.appendChild(lightboxOverlay);

    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  }

  function closeLightbox() {
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    if (lightboxOverlay) {
      document.body.removeChild(lightboxOverlay);
      document.body.style.overflow = 'auto';
    }
  }
});
