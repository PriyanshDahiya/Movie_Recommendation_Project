document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.querySelector("#username");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirm-password");
    const eyeIconPassword = document.querySelector(".password-toggle");
    const eyeIconConfirm = document.querySelector(".confirm-toggle");
    const registerButton = document.querySelector(".login-button");
    const errorMessage = document.querySelector("#error-message");
    const form = document.querySelector("#register-form");

    // Toggle password visibility
    function togglePassword(inputField, icon) {
        icon.addEventListener("click", function () {
            if (inputField.type === "password") {
                inputField.type = "text";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            } else {
                inputField.type = "password";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            }
        });
    }

    togglePassword(passwordInput, eyeIconPassword);
    togglePassword(confirmPasswordInput, eyeIconConfirm);

    // Check inputs and enable button
    function checkInputs() {
        if (
            usernameInput.value.trim() !== "" &&
            emailInput.value.trim() !== "" &&
            passwordInput.value.trim() !== "" &&
            confirmPasswordInput.value.trim() !== "" &&
            passwordInput.value === confirmPasswordInput.value
        ) {
            registerButton.style.backgroundColor = "#6A9C89"; // Green when valid
            registerButton.style.cursor = "pointer";
            registerButton.disabled = false;
            errorMessage.style.display = "none";
        } else {
            registerButton.style.backgroundColor = "#FFF5E4"; // Grey when invalid
            registerButton.style.cursor = "not-allowed";
            registerButton.disabled = true;

            if (passwordInput.value !== confirmPasswordInput.value) {
                errorMessage.textContent = "Passwords do not match!";
                errorMessage.style.display = "block";
            } else {
                errorMessage.style.display = "none";
            }
        }
    }

    // Listen for input changes
    usernameInput.addEventListener("input", checkInputs);
    emailInput.addEventListener("input", checkInputs);
    passwordInput.addEventListener("input", checkInputs);
    confirmPasswordInput.addEventListener("input", checkInputs);

    // Form submission
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userData = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        };

        try {
            const response = await fetch("http://localhost:7070/auth/register", {  // backend endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = "../login_page/login.html";  // Redirect to login page on success
            } else {
                errorMessage.textContent = result.message || "Registration failed!";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Registration error:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
            errorMessage.style.display = "block";
        }
    });
});
