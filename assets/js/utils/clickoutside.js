document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector('[x-show="showModal"]');

  if (modal) {
    const modalContent = modal.querySelector(".transform");

    document.addEventListener("click", function (event) {
      if (modal.__x && modal.__x.$data.showModal) {
        console.log("click");
        // Check if modal is currently open
        if (!modalContent.contains(event.target)) {
          // If the clicked element is not within the modal content
          modal.__x.$data.showModal = false; // Use Alpine.js internal API to update the state
        }
      }
    });
  }
});
