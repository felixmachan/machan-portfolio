function updateModelViewerOrbit() {
  const viewer = document.getElementById("pedal-viewer");
  if (!viewer) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    viewer.setAttribute("camera-orbit", "40deg 71deg 1.2m");
  } else {
    viewer.setAttribute("camera-orbit", "40deg 71deg 0.84m");
  }
}

// első betöltéskor
updateModelViewerOrbit();

// ha elforgatod a telót / resize
window.addEventListener("resize", updateModelViewerOrbit);
