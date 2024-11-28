/* JOB MATCHING */

const getuid = document.getElementById("userId");
const uid = parseInt(getuid.value, 10);

/* Main function that gets and prints the job results */
async function fetchJobMatches(userId) {

    const resultDiv = document.getElementById('response');
    try {

        // Fetch job matches
        const response = await fetch(`${CONFIG.SERVER_BASE_URL}/getMatches?uid=${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'x-api-key': CONFIG.API_KEY
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data.results);
        const jobResults = JSON.parse(data.results);
        console.log(jobResults); // Full JSON object


        // Clear previous results
        resultDiv.innerHTML = '';

        // Add the user ID at the top
        const userIdElement = document.createElement('h2');
        userIdElement.classList.add('loading-text')
        userIdElement.textContent = `Your Job Matches`;
        resultDiv.appendChild(userIdElement);

        // Check if there are any matches
        if (data.results.length === 0) {
            const noMatches = document.createElement('p');
            noMatches.textContent = 'No job matches found.';
            resultDiv.appendChild(noMatches);
            return;
        }

        // Iterate over job matches and render them
        jobResults.forEach((job) => {
            // Create a job card container
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');


            const titleElement = document.createElement('p');
            titleElement.classList.add('subtext');
            titleElement.textContent = `${job.position.replace(/^"|"$/g, '')} - $${job.pay}`;
            jobCard.appendChild(titleElement);

            const scoreElement = document.createElement('h4');
            scoreElement.textContent = `Match Score: ${job.score}`;
            jobCard.appendChild(scoreElement);

            const scoreBar = document.createElement('span');
            scoreBar.classList.add('score-bar');

            const score = Math.ceil(job.score / 50);
            for (let i = 0; i < score; i++) {
                const img = document.createElement('img');
                img.src = 'small_horse.png';
                img.alt = 'Score Icon';
                img.classList.add('score-icon');
                scoreBar.appendChild(img);
            }
            jobCard.appendChild(scoreBar);


            const companyElement = document.createElement('div');
            companyElement.textContent = `Company: ${job.company}`
            jobCard.appendChild(companyElement);
            companyElement.classList.add('listing-info');			

            const fieldElement = document.createElement('div');
            fieldElement.classList.add('listing-info');
            fieldElement.textContent = `Field: ${job.field}`
            jobCard.appendChild(fieldElement);

            const locElement = document.createElement('div');
            locElement.classList.add('listing-info');
            locElement.textContent = `Location: ${job.location}`
            jobCard.appendChild(locElement);			

            const descrElement = document.createElement('div');
            descrElement.classList.add('site-info');
            descrElement.textContent = `Job Description: ${job.description}`


            const skillElement = document.createElement('div');
            skillElement.classList.add('skills-container');
            skillElement.textContent = "Skills Required:";
            const lineBreak = document.createElement('br');
            skillElement.appendChild(lineBreak);
            
            const skill1Element = document.createElement('span');
            skill1Element.classList.add('skill-info');
            skill1Element.textContent = `${job.skill1}`
            skillElement.appendChild(skill1Element);
            jobCard.appendChild(descrElement);

            const skill2Element = document.createElement('span');
            skill2Element.classList.add('skill-info');
            skill2Element.textContent = `${job.skill2}`
            skillElement.appendChild(skill2Element);

            const skill3Element = document.createElement('span');
            skill3Element.classList.add('skill-info');
            skill3Element.textContent = `${job.skill3}`
            skillElement.appendChild(skill3Element);

            const skill4Element = document.createElement('span');
            skill4Element.classList.add('skill-info');
            skill4Element.textContent = `${job.skill4}`
            skillElement.appendChild(skill4Element);

            const skill5Element = document.createElement('span');
            skill5Element.classList.add('skill-info');
            skill5Element.textContent = `${job.skill5}`
            skillElement.appendChild(skill5Element);
            jobCard.appendChild(skillElement);	

            const boolContainer = document.createElement('div');
            boolContainer.classList.add('bool-container');
            const genderBox = document.createElement('input');
            genderBox.type = 'checkbox';
            const modBox = document.createElement('input');
            modBox.type = 'checkbox';
            const divBox = document.createElement('input');
            divBox.type = 'checkbox';
            const remBox = document.createElement('input');
            remBox.type = 'checkbox';
            const flexBox = document.createElement('input');
            flexBox.type = 'checkbox';
            if (job.gender == "true")
                genderBox.checked = true;
            else
                genderBox.checked = false;
            if (job.modern == "true")
                modBox.checked = true;
            else
                modBox.checked = false;
            if (job.diversity == "true")
                divBox.checked = true;
            else
                divBox.checked = false;
            if (job.remote == "true")
                remBox.checked = true;
            else
                remBox.checked = false;
            if (job.flex == "true")
                flexBox.checked = true;
            else
                flexBox.checked = false;

            flexBox.classList.add('transparent-checkbox');
            modBox.classList.add('transparent-checkbox');
            genderBox.classList.add('transparent-checkbox');
            divBox.classList.add('transparent-checkbox');
            remBox.classList.add('transparent-checkbox');

            const gLabel = document.createElement('label');
            gLabel.textContent = `Gender Equality`;
            boolContainer.appendChild(genderBox);
            boolContainer.appendChild(gLabel);
            const rLabel = document.createElement('label');
            rLabel.textContent = `Remote Work Available`;
            boolContainer.appendChild(remBox);
            boolContainer.appendChild(rLabel);
            const dLabel = document.createElement('label');
            dLabel.textContent = `Diverse Workforce`;
            boolContainer.appendChild(divBox);
            boolContainer.appendChild(dLabel);
            const fLabel = document.createElement('label');
            fLabel.textContent = `Flexible Work Hours`;
            boolContainer.appendChild(flexBox);
            boolContainer.appendChild(fLabel);
            const mLabel = document.createElement('label');
            mLabel.textContent = `Modern Workspace`;
            boolContainer.appendChild(modBox);
            boolContainer.appendChild(mLabel);


            jobCard.appendChild(boolContainer);


            const applyElement = document.createElement('div');
            applyElement.classList.add('apply-container');
            const applyButton = document.createElement('div');
            applyButton.classList.add('btn-apply');
            applyButton.textContent	= 'This Sounds Good';
            applyElement.appendChild(applyButton);
            jobCard.appendChild(applyElement);

            // Append the job card to the result container
            resultDiv.appendChild(jobCard);
        });

    } catch (error) {
        console.error('Error fetching job matches:', error);
        const resultDiv = document.getElementById('response');
        resultDiv.innerHTML = '<p>An error occurred while fetching job matches. Please try again later.</p>';
    }
}

// Fetch job matches for user ID from getMatches.html
fetchJobMatches(uid);
