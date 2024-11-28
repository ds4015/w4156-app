// registration.js

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const registrationMessage = document.getElementById('registration-message');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Collect mandatory fields
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const field = document.getElementById('dimension-field').value.trim();
        const pay = document.getElementById('dimension-pay').value.trim();
        const mbti = document.getElementById('dimension-mbti').value.trim();
        const location = document.getElementById('dimension-location').value.trim();
        const gender = document.getElementById('dimension-gender').value;
        const diversity = document.getElementById('dimension-diversity').value;
        const flexibility = document.getElementById('dimension-flexibility').value;
        const remote = document.getElementById('dimension-remote').value;
        const workspace = document.getElementById('dimension-workspace').value;

        // Collect optional skills
        const skillsSelect = document.getElementById('skills');
        const selectedSkills = Array.from(skillsSelect.selectedOptions).map(option => option.value);

        // Collect optional interests
        const interestsSelect = document.getElementById('interests');
        const selectedInterests = Array.from(interestsSelect.selectedOptions).map(option => option.value);

        // Collect augments (importance levels)
        const augments = [];

        const augmentFields = [
            { name: 'field', dim_id: 2 }, // Updated to dim_id 2
            { name: 'skill1', dim_id: 3 }, // Previously 2
            { name: 'skill2', dim_id: 4 }, // Previously 3
            { name: 'skill3', dim_id: 5 }, // Previously 4
            { name: 'skill4', dim_id: 6 }, // Previously 5
            { name: 'skill5', dim_id: 7 }, // Previously 6
            { name: 'interest1', dim_id: 8 }, // Previously 7
            { name: 'interest2', dim_id: 9 }, // Previously 8
            { name: 'interest3', dim_id: 10 }, // Previously 9
            { name: 'interest4', dim_id: 11 }, // Previously 10
            { name: 'interest5', dim_id: 12 }, // Previously 11
            { name: 'pay', dim_id: 13 }, // Previously 12
            { name: 'mbti', dim_id: 14 }, // Previously 13
            { name: 'location', dim_id: 1 }, // Updated to dim_id 1
            { name: 'gender', dim_id: 15 }, // Previously 14
            { name: 'diversity', dim_id: 16 }, // Previously 15
            { name: 'flexibility', dim_id: 17 }, // Previously 16
            { name: 'remote', dim_id: 18 }, // Previously 17
            { name: 'workspace', dim_id: 19 } // Previously 18
            // Add more mappings if there are additional fields
        ];

        augmentFields.forEach(field => {
            const importanceValue = document.getElementById(`importance-${field.name}`).value;
            if (importanceValue) { // Only include if an importance level is selected
                augments.push({
                    dim_id: field.dim_id,
                    importance: importanceValue
                });
            }
        });

        // Validate mandatory fields
        if (!name || !email || !field || !pay || !mbti || !location || !gender || !diversity || !flexibility || !remote || !workspace) {
            registrationMessage.textContent = 'Please fill in all required fields.';
            registrationMessage.style.color = 'red';
            return;
        }

        // Construct the JSON payload
        const userData = {
            name: name,
            email: email,
            dimensions: {
                field: field,
                pay: pay,
                mbti: mbti,
                location: location,
                gender: gender,
                diversity: diversity,
                flexibility: flexibility,
                remote: remote,
                workspace: workspace
            },
            skills: selectedSkills.length > 0 ? selectedSkills.map(skill => ({ name: skill })) : [],
            interests: selectedInterests.length > 0 ? selectedInterests.map(interest => ({ name: interest })) : [],
            augments: augments.length > 0 ? augments : []
        };

        try {
            // Send a POST request to the /makeUser endpoint
            const response = await fetch(`${CONFIG.SERVER_BASE_URL}/makeUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': CONFIG.API_KEY 
                },
                body: JSON.stringify(userData),
            });

            // Handle the server's response
            if (response.ok) {
                const result = await response.json();
                registrationMessage.textContent = 'Registration successful! Logging you in...';
                registrationMessage.style.color = 'green';

                // Automatically log the user in after registration
                // This assumes the server returns an authentication token upon registration
                const authToken = result.token; // Adjust based on your server's response

                if (authToken) {

                    localStorage.setItem('authToken', authToken);

                    window.location.href = 'getMatches.html';
                } else {
                    alert('Please log in with your credentials.');
                }
            } else {
                const errorData = await response.json();
                registrationMessage.textContent = `Registration failed: ${errorData.message}`;
                registrationMessage.style.color = 'red';
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            registrationMessage.textContent = 'An unexpected error occurred. Please try again later.';
            registrationMessage.style.color = 'red';
        }
    });

    /**
     * Maps augment field names to their corresponding dim_id.
     * @param {string} fieldName - The name of the augment field.
     * @returns {number|null} - The corresponding dim_id or null if not found.
     */
    function mapDimId(fieldName) {
        const dimIdMapping = {
            'location': 1,
            'field': 2,
            'pay': 13,
            'mbti': 14,
            'gender': 15,
            'diversity': 16,
            'flexibility': 17,
            'remote': 18,
            'workspace': 19,
            'skill1': 3,
            'skill2': 4,
            'skill3': 5,
            'skill4': 6,
            'skill5': 7,
            'interest1': 8,
            'interest2': 9,
            'interest3': 10,
            'interest4': 11,
            'interest5': 12
        };
        return dimIdMapping[fieldName] || null;
    }
});
