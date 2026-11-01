const confirmDeleteBtn = document.getElementById("confirm-delete-listing");
if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", async () => {
    const res = await fetch(`/listings/${confirmDeleteBtn.dataset.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.redirect; // go to /listings — flash shows there
    }
  });
}

document.querySelectorAll(".delete-review-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const { listingId, reviewId } = btn.dataset;
    const res = await fetch(`/listings/${listingId}/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      btn.closest(".card").remove(); // remove this review's card — no reload
    }
  });
});
