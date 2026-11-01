const editForm = document.querySelector(".edit-form");
if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop the normal form submission
    const formData = new FormData(editForm); // bundles all fields + the image file

    console.log("formData is as follows");

    const res = await fetch(`/listings/${editForm.dataset.id}`, {
      method: "PUT",
      body: formData, // NO Content-Type header — browser sets it
    });

    if (res.ok) {
      const data = await res.json();
      window.location.href = data.redirect;
    } else {
      console.log("Update failed:", res.status); // temporary debug
    }
  });
}
