// Add light blue shadow under the cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursorShadow = document.createElement("div");
  cursorShadow.style.width = "250px";
  cursorShadow.style.height = "250px";
  cursorShadow.style.background =
    "radial-gradient(circle, rgba(83, 133, 232, 0.20) 0%, rgba(135, 206, 235, 0) 65%)";
  cursorShadow.style.borderRadius = "50%";
  cursorShadow.style.position = "fixed";
  cursorShadow.style.pointerEvents = "none";
  cursorShadow.style.zIndex = "9999";
  cursorShadow.style.left = "0";
  cursorShadow.style.top = "0";
  cursorShadow.style.opacity = "0";
  cursorShadow.style.transition = "opacity 0.3s ease";
  // Use translate3d for better performance
  cursorShadow.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(cursorShadow);

  document.addEventListener("mousemove", (e) => {
    cursorShadow.style.opacity = "1";
    cursorShadow.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
  });

  document.addEventListener("mouseleave", () => {
    cursorShadow.style.opacity = "0";
  });
});
