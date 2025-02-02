
function confirmDelete(event, bookId) {
    event.preventDefault();

    const userConfirmed = confirm("Are you sure you want to delete this book?");
    if (!userConfirmed) return;

    fetch(`/books/delete/${bookId}`, {
        method: "POST",
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/books";
        } else {
            alert("Failed to delete book.");
        }
    })
    .catch(error => {
        console.error("Error deleting book:", error);
        alert("Error deleting book.");
    });
}

