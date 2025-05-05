document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("#email");
    const submitButton = document.querySelector(".submit-button");
    const form = document.querySelector("#forgot-password-form");

    // Function to validate email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Enable submit button if email is valid
    emailInput.addEventListener("input", function () {
        if (isValidEmail(emailInput.value.trim())) {
            submitButton.classList.add("enabled");
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove("enabled");
            submitButton.disabled = true;
        }
    });

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from reloading

        const email = emailInput.value.trim();
        if (!isValidEmail(email)) return; // Extra safety check

        alert(`Password reset instructions sent to ${email}`);
        window.location.href = "/login_page/login.html"; // Redirect to login
    });
});
