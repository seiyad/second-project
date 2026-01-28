function submitBudget(event) {
    event.preventDefault();

    const monthlyAmount = document.getElementById('monthlyAmount').value;

    if (monthlyAmount) {
        // In a real app, save to localStorage or backend
        console.log("Monthly Budget Set:", monthlyAmount);
        localStorage.setItem('monthlyBudget', monthlyAmount);

        // Feedback
        const btn = document.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Setting Budget...';
        btn.style.opacity = '0.8';

        setTimeout(() => {
            window.location.href = "dashborard.html";
        }, 800);
    } else {
        alert("Please enter a valid amount.");
    }
}
