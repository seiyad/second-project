function submitProject(event) {
    event.preventDefault();

    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;
    const dueDate = document.getElementById('dueDate').value;

    if (projectName && dueDate) {
        // Here you would typically save the data to a database or local storage
        console.log("Project Details Captured:", {
            name: projectName,
            description: projectDesc,
            date: dueDate
        });

        // Simulating a delay for effect, then redirecting
        const btn = document.querySelector('button');
        btn.innerHTML = "Processing...";
        btn.style.opacity = "0.8";

        setTimeout(() => {
            window.location.href = "dashborard.html"; // Redirect to main dashboard
        }, 1000);
    } else {
        alert("Please fill in the required fields.");
    }
}
