// Kelvin Kim sk4802 
//auth.js to handle authentication

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');

    /**
     * Decodes a JWT token and returns the payload.
     * @param {string} token - The JWT token.
     * @returns {object|null} - The payload of the token or null if invalid.
     */
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    if (!authToken) {
        // No token found, redirect to registration page
        window.location.href = 'index.html';
    } else {
        // Decode the token to get user information
        const userData = parseJwt(authToken);
        if (!userData) {
            // Invalid token, redirect to registration
            window.location.href = 'index.html';
        } else {
            // Token is valid, set the userId and start fetching matches
            const uid = userData.user_id; // Adjust based on your JWT payload
            document.getElementById("userId").value = uid;
            fetchJobMatches(uid);
        }
    }

    // Handle Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = 'index.html';
        });
    }
});
