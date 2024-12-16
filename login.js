async function login(username, email) {
    try {
        const response = await fetch(`${CONFIG.SERVER_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);

            localStorage.setItem("uid", data.uid);
            localStorage.setItem("uname", data.uname);
            localStorage.setItem("realname", data.realname);

            return { success: true };
        } else {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, error: "Network error" };
    }
}

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    const response = await login(username, email);
    const messageElement = document.getElementById("responseMessage");

    if (response.success) {
        messageElement.textContent = "Login successful!";
        messageElement.style.color = "green";

        const uid = localStorage.getItem("uid");
        const uname = localStorage.getItem("uname");
        const realname = localStorage.getItem("realname");

		alert("Login successful! Redirecting to your portal...");
		window.location.href = "user_portal.html"; 			

    } else {
		alert("Login failed. Please check your credentials and try again.");
		window.location.href = "login.html";
        messageElement.textContent = "Login failed: " + response.error;
        messageElement.style.color = "red";
    }
});
