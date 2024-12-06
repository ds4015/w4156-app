/* JOB MATCHING */

const resultsContainer = document.getElementById("results-container");
const progressBarContainer = document.getElementById("progress-container");
const loadingText = document.getElementById("load-text");
const loadingCircle = document.getElementById("load-circle");
const uidForm = document.getElementById("uid-search");
let getProgress = false;

/* Get progress on Match */
async function fetchProgress(userId) {
        try {
                const response = await fetch(`http://34.69.114.32/api/progress/${userId}`);
                if (!response.ok) {
                        console.error("Failed to fetch progress:", response.statusText);
                        return null;
                }

                const data = await response.json();
                return data;
        } catch (error) {
                console.error("Error fetching progress:", error);
                return null;
        }
}

/* Update the visual progress bar */
function updateProgressBar(progress) {
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${progress}%`;
}

/* Start checking progress once job added to queue */
function startProgressCheck(userId) {
        if (getProgress)
                return;
        const interval = setInterval(async () => {
                const progress = await fetchProgress(userId);
                if (!progress) return;
                if (progress.status === "completed") {
                        updateProgressBar(100);
                        clearInterval(interval);
                        if (progressBarContainer) {
                                progressBarContainer.style.display = "none";
                                loadingText.style.display = "none";
                                loadingCircle.style.display = "none";
                        }
                        fetchJobMatches(userId).then(() => {
                                clearInterval(interval);
                                getProgress = true;
                        });
                } else {
                        progressBarContainer.style.display = "block";
                        loadingText.style.display = "block";
                        loadingCircle.style.display = "block";
                        updateProgressBar(progress.progress);
                }
        }, 1000);
}

/* Main function that gets and prints the job results */
async function fetchJobMatches(userId) {
        resultsContainer.style.display = "none";
        uidForm.style.display = "none";
        startProgressCheck(userId);
        const resultDiv = document.getElementById('response');
        const profileDiv = document.getElementById('profile');
        try {
                // Fetch job matches
                const response = await fetch(`http://34.69.114.32/api/getMatches?uid=${userId}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                console.log(data.results);
                const jobResults = JSON.parse(data.results);
                console.log(jobResults); // Full JSON object

                const profResponse = await fetch(`http://34.69.114.32/api/getProfile?uid=${userId}`)
                const profData = await profResponse.json();
                console.log(profData.results);
                const profResults = JSON.parse(profData.results);
                console.log(profResults);

                profileDiv.innerHTML = '';
                const profHeadElement = document.createElement('h3');
                profHeadElement.textContent = `Your Profile`;
                profileDiv.appendChild(profHeadElement);

                const profFieldElement = document.createElement('p');
                profFieldElement.textContent = `Field of Interest: ${profResults.field}`;
                profileDiv.appendChild(profFieldElement);


                const profLocElement = document.createElement('p');
                profLocElement.textContent = `Location: ${profResults.location}`;
                profileDiv.appendChild(profLocElement);

                const profPayElement = document.createElement('p');
                profPayElement.textContent = `Pay Desired: ${profResults.pay}`;
                profileDiv.appendChild(profPayElement);

                if ("skill1" in profResults) {
                        const profSkill1Element = document.createElement('p');
                        profSkill1Element.textContent = `Skill: ${profResults.skill1}`;
                        profileDiv.appendChild(profSkill1Element);
                }

                if ("skill2" in profResults) {
                        const profSkill2Element = document.createElement('p');
                        profSkill2Element.textContent = `Skill: ${profResults.skill2}`;
                        profileDiv.appendChild(profSkill2Element);
                }


                if ("skill3" in profResults) {
                        const profSkill3Element = document.createElement('p');
                        profSkill3Element.textContent = `Skill: ${profResults.skill3}`;
                        profileDiv.appendChild(profSkill3Element);
                }


                if ("skill4" in profResults) {
                        const profSkill4Element = document.createElement('p');
                        profSkill4Element.textContent = `Skill: ${profResults.skill4}`;
                        profileDiv.appendChild(profSkill4Element);
                }

                if ("skill5" in profResults) {
                        const profSkill5Element = document.createElement('p');
                        profSkill5Element.textContent = `Skill: ${profResults.skill5}`;
                        profileDiv.appendChild(profSkill5Element);
                }


                if ("interest1" in profResults) {
                        const profInterest1Element = document.createElement('p');
                        profInterest1Element.textContent = `Interest: ${profResults.interest1}`;
                        profileDiv.appendChild(profInterest1Element);
                }

                if ("interest2" in profResults) {
                        const profInterest2Element = document.createElement('p');
                        profInterest2Element.textContent = `Interest: ${profResults.interest2}`;
                        profileDiv.appendChild(profInterest2Element);
                }


                if ("interest3" in profResults) {
                        const profInterest3Element = document.createElement('p');
                        profInterest3Element.textContent = `Interest: ${profResults.interest3}`;
                        profileDiv.appendChild(profInterest3Element);
                }


                if ("interest4" in profResults) {
                        const profInterest4Element = document.createElement('p');
                        profInterest4Element.textContent = `Interest: ${profResults.interest4}`;
                        profileDiv.appendChild(profInterest4Element);
                }


                if ("interest5" in profResults) {
                        const profInterest5Element = document.createElement('p');
                        profInterest5Element.textContent = `Interest: ${profResults.interest5}`;
                        profileDiv.appendChild(profInterest5Element);
                }


                if (profResults.flexibility === "true") {
                        const profFlexElement = document.createElement('p');
                        profFlexElement.textContent = "Job Flexibility: Yes";
                        profileDiv.appendChild(profFlexElement);
                }


                if (profResults.remote === "true") {
                        const profRemoteElement = document.createElement('p');
                        profRemoteElement.textContent = "Remote Work: Yes";
                        profileDiv.appendChild(profRemoteElement);
                }

                if (profResults.gender === "true") {
                        const profGendElement = document.createElement('p');
                        profGendElement.textContent = "Gender Balance: Yes";
                        profileDiv.appendChild(profGendElement);
                }

                if (profResults.diversity === "true") {
                        const profDivElement = document.createElement('p');
                        profDivElement.textContent = "Diverse Workforce: Yes";
                        profileDiv.appendChild(profDivElement);
                }


                if (profResults.workspace === "true") {
                        const profModernElement = document.createElement('p');
                        profModernElement.textContent = "Modern Workspace: Yes";
                        profileDiv.appendChild(profModernElement);
                }

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

                        let divisor = 50;

                        if (job.score > 800)
                                divisor = 80;
                        const score = Math.ceil(job.score / divisor);
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
                        boolContainer.classList.add('d-flex');
                        boolContainer.classList.add('justify-content-center');
                        const genderBox = document.createElement('input');
                        genderBox.type = 'checkbox';
                        const modBox = document.createElement('input');
                        modBox.type = 'checkbox';
                        const divBox = document.createElement('input');
                        divBox.type = 'checkbox';

                        const bool2Container = document.createElement('div');
                        bool2Container.classList.add('bool-container');
                        bool2Container.classList.add('d-flex');
                        bool2Container.classList.add('justify-content-center');
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
                        bool2Container.appendChild(remBox);
                        bool2Container.appendChild(rLabel);
                        const dLabel = document.createElement('label');
                        dLabel.textContent = `Diverse Workforce`;
                        boolContainer.appendChild(divBox);
                        boolContainer.appendChild(dLabel);
                        const fLabel = document.createElement('label');
                        fLabel.textContent = `Flexible Work Hours`;
                        bool2Container.appendChild(flexBox);
                        bool2Container.appendChild(fLabel);
                        const mLabel = document.createElement('label');
                        mLabel.textContent = `Modern Workspace`;
                        boolContainer.appendChild(modBox);
                        boolContainer.appendChild(mLabel);


                        jobCard.appendChild(boolContainer);
                        jobCard.appendChild(bool2Container);

                        const applyElement = document.createElement('div');
                        applyElement.classList.add('apply-container');
                        const applyButton = document.createElement('div');
                        applyButton.classList.add('btn-apply');
                        applyButton.textContent = 'This Sounds Good';
                        applyElement.appendChild(applyButton);
                        jobCard.appendChild(applyElement);

                        // Append the job card to the result container
                        resultDiv.appendChild(jobCard);

                        resultsContainer.style.display = "block";
                });

        } catch (error) {
                console.error('Job added to queue.', error);
        }
}


/* JOB LISTING - POST */

document.getElementById("listingForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const form = event.target;

        const basicInfo = {
                cname: form.company.value,
                csize: form.company_size.value,
                field: form.field.value,
                position: form.position.value,
                job_description: form.job_description.value,
                location: form.location.value
        };

        const skillsPersonality = {
                skill1_req: form.skill1_req.value,
                skill2_req: form.skill2_req.value,
                skill3_req: form.skill3_req.value,
                skill4_req: form.skill4_req.value,
                skill5_req: form.skill5_req.value,
                personality_types: form.personality_types.value
        };

        const pay = parseInt(form.pay.value, 10);

        const boolFields = {
                job_flexibility: form.job_flexibility.checked,
                remote_available: form.remote_available.checked,
                diverse_workforce: form.diverse_workforce.checked,
                mixed_gender: form.mixed_gender.checked,
                modern_building: form.modern_building.checked
        };
        const data = {
                basicInfo,
                skillsPersonality,
                pay,
                boolFields
        };
        console.log("Listing::insertListing called with:", data);
        fetch("http://localhost:18080/listing/create", {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
        })
                .then(response => {
                        console.log("Response status:", response.status);

                        if (response.status === 200) {
                           alert("Listing successfully posted!");
                                window.location.href = 'index.html';
                        }
                        return response.text();
                })
                .then(data => {
                        console.log("Response data:", data);
                })
                .catch(error => {
                        console.error("Error:", error);
                });
});

document.getElementById('generateBtn').addEventListener('click', async () => {
    const jobTitle = document.getElementById('position').value;
    const jobField = document.getElementById('field').value;
    const skill_1 = document.getElementById('skill1_req');
    const skill_2 = document.getElementById('skill2_req');
    const skill_3 = document.getElementById('skill3_req');
    const skill_4 = document.getElementById('skill4_req');
    const skill_5 = document.getElementById('skill5_req');
    const annualPay = document.getElementById('pay').value;
    const loc = document.getElementById('location').value;

    const descriptionTextbox = document.getElementById('job_description');


    if (!jobTitle || !jobField || !skill_1 || !skill_2 || !skill_3 || !skill_4 || !skill_5 || !annualPay || !loc) {
        alert('Please fill in all fields first.');
        return;}

        descriptionTextbox.value = "Generating AI description...";

    const requestBody = {
        job_title: jobTitle,
        job_field: jobField,
        skill1: skill_1.value,
        skill2: skill_2.value,
        skill3: skill_3.value,
        skill4: skill_4.value,
        skill5: skill_5.value,
        pay: annualPay,
        loc: loc
    };

        console.log(requestBody);

    try {
        const response = await fetch('http://localhost:18080/listing/generateJobDescription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            descriptionTextbox.value = data.description.slice(0, -2);
        } else {
            alert('Failed to generate job description.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the job description.');
    }
});