document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const eyeIcon = document.querySelector(".input-box i.fa-eye-slash");
    const loginButton = document.querySelector("#login-btn");
    const errorMessage = document.querySelector("#error-message");

    // Initial button state check
    checkInputs();

    // Toggle password visibility
    eyeIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        }
    });

    // Check input fields and enable/disable login button
    function checkInputs() {
        if (usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
            loginButton.style.backgroundColor = "#6A9C89"; // Green when filled
            loginButton.style.cursor = "pointer";
            loginButton.disabled = false;
        } else {
            loginButton.style.backgroundColor = "#FFF5E4"; // Grey when empty
            loginButton.style.cursor = "not-allowed";
            loginButton.disabled = true;
        }
    }

    // Event listeners for input fields
    usernameInput.addEventListener("input", checkInputs);
    passwordInput.addEventListener("input", checkInputs);

    // Login button click event
    loginButton.addEventListener("click", async function () {
        const userData = {
            username: usernameInput.value.trim(),
            password: passwordInput.value.trim(),
        };

        try {
            const response = await fetch("http://localhost:7070/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const resultText = await response.text();

            if (response.ok) {
                alert(resultText);
                localStorage.setItem("username", usernameInput.value.trim());
                window.location.href = "../homepage/index.html";
            
            } else {
                let message = resultText;
                try {
                    const json = JSON.parse(resultText);
                    if (json.message) {
                        message = json.message;
                    }
                } catch (e) {
                    // If parsing fails, keep original text
                }
                errorMessage.textContent = message;
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMessage.textContent = "An error occurred during login. Please try again.";
            errorMessage.style.display = "block";
        }
    });
});
