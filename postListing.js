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
		skill1_req: form.skill1_req.value.trim(),
		skill2_req: form.skill2_req.value.trim(),
		skill3_req: form.skill3_req.value.trim(),
		skill4_req: form.skill4_req.value.trim(),
		skill5_req: form.skill5_req.value.trim(),
		personality_types: form.personality_types.value.trim(),
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
	fetch("http://127.0.0.1/listing/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data),
	})
		.then(response => {
			console.log("Response status:", response.status);


			console.log("Response status:", response.status);

			if (!response.ok) {
				throw new Error(`Failed to create listing. Status: ${response.status}`);
			}
	
			return response.json();
		})
		.then(responseData => {
			console.log("Response data:", responseData);

			const lid = responseData.lid;
	
			if (!lid) {
				throw new Error("Server response did not include lid.");
			}
	
			window.location.href = `listing.html?lid=${lid}`;			
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
		return;
	}

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
		const response = await fetch('http://127.0.0.1/listing/generateJobDescription', {
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