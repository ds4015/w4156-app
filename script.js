let progressChecking = false;

async function fetchProgress(userId) {
	try {
		const response = await fetch(`http://localhost:18080/progress/${userId}`);
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

function updateProgressBar(progress) {
	const progressBar = document.getElementById("progress-bar");
	progressBar.style.width = `${progress}%`;
	progressBar.textContent = `${progress}%`;
}

function startProgressCheck(userId) {
	if (progressChecking) return;
	progressChecking = true;
	const interval = setInterval(async () => {
		const progress = await fetchProgress(userId);
		if (!progress) return;

		if (progress.status === "completed") {
			updateProgressBar(100);
			clearInterval(interval);
			const progressBarContainer = document.getElementById("progress-container");
			const loadingText = document.getElementById("load-text");
			const loadingCircle = document.getElementById("load-circle");			
			if (progressBarContainer) {
				progressBarContainer.style.display = "none";
				loadingText.style.display = "none";
				loadingCircle.style.display = "none";				
			}
			fetchJobMatches(userId).then(() => {
				clearInterval(interval);
			});
		} else {
			updateProgressBar(progress.progress);
		}
	}, 500); 
}

async function fetchJobMatches(userId) {

	const resultDiv = document.getElementById('response');
	startProgressCheck(userId);
	try {

		// Fetch job matches
		const response = await fetch(`http://localhost:18080/getMatches?uid=${userId}`);
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

		resultDiv.textContent = 'Error fetching job matches. Please try again later.';
	}
}

// Fetch job matches for user ID 1
fetchJobMatches(1);
