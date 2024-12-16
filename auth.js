/* LOGGED IN CHECK */

document.addEventListener("DOMContentLoaded", function () {
    const loggedInBar = document.getElementById("logged-in-bar");

    const uname = localStorage.getItem("uname");
    const realname = localStorage.getItem("realname");

    let rn = realname;

    if (realname === "null")
        rn = uname;

    if (uname && realname) {
        loggedInBar.innerHTML = `
            <div class="site-info pl-4 pr-4 pt-0 pb-0 mt-1 d-flex justify-content-between align-items-center">
                <span>Welcome, ${rn} (${uname})!</span>
                <button id="logoutButton" class="btn btn-logout">Logout</button>
            </div>
        `;

        // Add event listener to the logout button
        document.getElementById("logoutButton").addEventListener("click", function () {
            localStorage.clear(); // Clear login details
            alert("You have been logged out.");
            window.location.reload(); // Reload the page to reflect logout state
        });
    }
});