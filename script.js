const endDate = new Date("2025-03-14T00:00:00"); // Fixed presale end date

const countdown = () => {
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            clearInterval(timer);
            document.querySelector(".countdown").innerHTML = "<h2>Presale Ended!</h2>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
    }, 1000);
};

// Initialize Countdown
countdown();

if (document.getElementById("signup-form")) {
    document.getElementById("signup-form").addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect user data from the form
        const userData = {
            Password: document.getElementById("password").value, // Match API field name
            Email: document.getElementById("email").value,       // Match API field name
            FirstName: document.getElementById("firstname").value, // Match API field name
            LastName: document.getElementById("lastname").value,   // Match API field name
            PhoneNumber: document.getElementById("phonenumber").value, // Match API field name
        };

        // Call your backend API for signup
        fetch("https://kitkit.azurewebsites.net/api/User/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
               if (data.Token) {
                  window.location.href = "presale.html";
            } else {
                    alert("Signup failed: " + (data.message || "Please try again."));
}
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            });
    });
}

// Login Form Submission
if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const userData = {
            Email: document.getElementById("email").value,
            Password: document.getElementById("password").value,
        };

        // Call your backend API for login
        fetch("https://kitkit.azurewebsites.net/api/User/authenticate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
           .then((data) => {
               if (data.Token) {
                  window.location.href = "presale.html";
            } else {
                    alert("login failed: " + (data.message || "Please try again."));
}
            })
    });
}

// Fetch Purchase History
if (document.getElementById("history-table")) {
    fetch("/api/history")
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#history-table tbody");
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.quantity}</td>
                    <td>${item.amount}</td>
                `;
                tableBody.appendChild(row);
            });
        });
}


// Login Form Submission
if (document.getElementById("delete-form")) {
    document.getElementById("delete-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get user input
        const email = document.getElementById("email").value;
        const phoneNumber = document.getElementById("phonenumber").value;

        // Construct API URL with query parameters
        const apiUrl = `https://kitkit.azurewebsites.net/api/User/delete-account?Email=${encodeURIComponent(email)}&PhoneNumber=${encodeURIComponent(phoneNumber)}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account deletion request submitted successfully.");
                window.location.href = "delete.html";  // Redirect on success
            } else {
                alert("Delete failed: " + (data.message || "Please try again."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
}