/* EDIT JOB LISTING */

const lidSearch = document.getElementById("lid-search");

async function getQueryParams() {
	const params = new URLSearchParams(window.location.search);

	const lid = params.get("lid");

	if (!lid) {
		lidSearch.classList.remove("d-none");
		throw new Error("lid is missing in the URL query parameters.");
	}

	const response = await fetch(`${CONFIG.SERVER_BASE_URL}/listing/getEID?lid=${String(lid)}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${btoa(CONFIG.API_KEY + ":")}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch eid for lid: ${lid}`);
	}

	const data = await response.json();

	return {
		lid: lid,
		eid: parseInt(data.eid, 10), 
	};
}


document.addEventListener("DOMContentLoaded", async function () {

	const { lid, eid } = await getQueryParams();

	console.log("LID:", lid);
	console.log("EID:", eid);
	
	const companySpan = document.getElementById("companySpan");
	const titleSpan = document.getElementById("titleSpan");
	const editTitle = document.getElementById("editTitle");
	const paySpan = document.getElementById("paySpan");
	const editPay = document.getElementById("editPay");
	const fieldSpan = document.getElementById("fieldSpan");
	const editField = document.getElementById("editField");
	const locationSpan = document.getElementById("locationSpan");
	const editLocation = document.getElementById("editLocation");
	const descriptionSpan = document.getElementById("descriptionSpan");
	const editDescription = document.getElementById("editDescription");
	const skillContainer = document.querySelector(".skills-container");
	const editSkillContainer = document.getElementById("editSkill");
	const allCheckboxes = document.querySelectorAll(".listing-checkbox");
	const loading = document.getElementById("loading");

	loading.classList.remove("d-none");

	const routeMap = {
		gender: `${CONFIG.SERVER_BASE_URL}/employer/changeGender?eid=${eid}&lid=${lid}`,
		modern: `${CONFIG.SERVER_BASE_URL}/employer/changeModernWorkspace?eid=${eid}&lid=${lid}`,
		diverse: `${CONFIG.SERVER_BASE_URL}/employer/changeDiversity?eid=${eid}&lid=${lid}`,
		flex: `${CONFIG.SERVER_BASE_URL}/employer/changeFlex?eid=${eid}&lid=${lid}`,
		remote: `${CONFIG.SERVER_BASE_URL}/employer/changeRemote?eid=${eid}&lid=${lid}`,
	};

	const route = `${CONFIG.SERVER_BASE_URL}/listing/retrieve?lid=${lid}`;

	fetch(route, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
		}
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch listing data");
			}
			return response.json();
		})
		.then((data) => {
			populateFields(data);
			const listingContainer = document.getElementById("listing");
			listingContainer.classList.remove("d-none");
			loading.classList.add("d-none")
		})
		.catch((error) => {
			console.error("Error fetching listing data:", error);
			alert("Failed to load listing data. Check that LID is valid.");
			loading.classList.add("d-none");
		});

	editTitle.addEventListener("click", function () {
		if (editTitle.textContent === "Edit Position") {
			const currentText = titleSpan.textContent;
			const inputField = document.createElement("input");

			inputField.type = "text";
			inputField.value = currentText;
			inputField.classList.add("form-control");
			inputField.classList.add("subtext");
			const spanWidth = titleSpan.offsetWidth;
			const adjustedWidth = spanWidth * 1.3;
			inputField.style.width = `${adjustedWidth}px`;
			inputField.style.display = "inline-block";

			// Replace div with input
			titleSpan.innerHTML = "";
			titleSpan.appendChild(inputField);

			editTitle.textContent = "Save Position";

			inputField.focus();
		} else {
			const inputField = titleSpan.querySelector("input");
			const updatedText = inputField.value;

			titleSpan.innerHTML = updatedText;

			editTitle.textContent = "Edit Position";
			fetch(`${CONFIG.SERVER_BASE_URL}/employer/changePosition?eid=${eid}&lid=${lid}}&newPosition=${updatedText}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
				}
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					showSuccessMessage(titleSpan);
				})
				.catch((error) => {
					console.error(`Error updating listing for ${titleSpan}:`, error);
					alert("An error occurred while updating the listing.");
				});
		}
	});

	editPay.addEventListener("click", function () {
		if (editPay.textContent === "Edit Pay") {
			const currentText = paySpan.textContent;
			const inputField = document.createElement("input");

			inputField.type = "number";
			inputField.step = "1000";
			inputField.value = currentText;
			inputField.classList.add("form-control");
			inputField.classList.add("subtext");
			const spanWidth = paySpan.offsetWidth;
			const adjustedWidth = spanWidth * 1.5;
			inputField.style.width = `${adjustedWidth}px`;
			inputField.style.display = "inline-block";

			paySpan.innerHTML = "";
			paySpan.appendChild(inputField);

			editPay.textContent = "Save Pay";

			inputField.focus();
		} else {
			const inputField = paySpan.querySelector("input");
			const updatedText = inputField.value;

			paySpan.innerHTML = updatedText;

			editPay.textContent = "Edit Pay";
			fetch(`${CONFIG.SERVER_BASE_URL}/listing/changePay?lid=${lid}}&newPay=${updatedText}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
				}
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					showSuccessMessage(paySpan);
				})
				.catch((error) => {
					console.error(`Error updating listing for ${paySpan}:`, error);
					alert("An error occurred while updating the listing.");
				});

		}
	});


	editField.addEventListener("click", function () {
		if (editField.textContent === "Edit Field") {
			const currentText = fieldSpan.textContent;
			const inputField = document.createElement("input");

			inputField.type = "text";
			inputField.value = currentText;
			inputField.classList.add("form-control");
			inputField.classList.add("listing-info");
			const spanWidth = fieldSpan.offsetWidth;
			const adjustedWidth = spanWidth * 1.5;
			inputField.style.width = `${adjustedWidth}px`;
			inputField.style.display = "inline-block";

			fieldSpan.innerHTML = "";
			fieldSpan.appendChild(inputField);

			editField.textContent = "Save Field";

			inputField.focus();
		} else {
			const inputField = fieldSpan.querySelector("input");
			const updatedText = inputField.value;

			fieldSpan.innerHTML = updatedText;

			editField.textContent = "Edit Field";
			fetch(`${CONFIG.SERVER_BASE_URL}/listing/changeField?lid=${lid}}&newField=${updatedText}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
				}
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					showSuccessMessage(fieldSpan);
				})
				.catch((error) => {
					console.error(`Error updating listing for ${fieldSpan}:`, error);
					alert("An error occurred while updating the listing.");
				});

		}
	});

	editLocation.addEventListener("click", function () {
		if (editLocation.textContent === "Edit Location") {
			const currentText = locationSpan.textContent;
			const inputField = document.createElement("input");

			inputField.type = "text";
			inputField.value = currentText;
			inputField.classList.add("form-control");
			inputField.classList.add("listing-info");
			const spanWidth = locationSpan.offsetWidth;
			const adjustedWidth = spanWidth * 1.8;
			inputField.style.width = `${adjustedWidth}px`;
			inputField.style.display = "inline-block";

			locationSpan.innerHTML = "";
			locationSpan.appendChild(inputField);

			editLocation.textContent = "Save Location";

			inputField.focus();
		} else {
			const inputField = locationSpan.querySelector("input");
			const updatedText = inputField.value;

			locationSpan.innerHTML = updatedText;

			editLocation.textContent = "Edit Location";
			fetch(`${CONFIG.SERVER_BASE_URL}/employer/changeLocation?eid=${eid}&lid=${lid}}&newLocation=${updatedText}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
				}
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					showSuccessMessage(locationSpan);
				})
				.catch((error) => {
					console.error(`Error updating listing for ${locationSpan}:`, error);
					alert("An error occurred while updating the listing.");
				});

		}
	});

	editDescription.addEventListener("click", function () {
		const addAIButton = document.getElementById("genAI");
		let newButton = document.querySelector("#genAI button");
		if (editDescription.textContent === "Edit Description") {
			const currentText = descriptionSpan.textContent;
			const inputField = document.createElement("textarea");

			inputField.value = currentText;
			inputField.classList.add("form-control", "site-info");
			inputField.rows = 10;
			inputField.cols = 50;
			inputField.style.resize = "none";
			inputField.style.display = "inline-block";

			descriptionSpan.innerHTML = "";
			descriptionSpan.appendChild(inputField);

			inputField.focus();

			if (!newButton) {
				newButton = document.createElement("button");

				newButton.textContent = "Generate AI Job Description";
				newButton.classList.add("btn");
				newButton.classList.add("btn-small");

				newButton.addEventListener("click", async () => {
					const descriptionTextbox = document.getElementById('descriptionSpan');

					if (!titleSpan || !fieldSpan || !skill1 || !skill2 || !skill3 || !skill4 || !skill5 || !paySpan || !locationSpan) {
						alert('Please fill in all fields first.');
						return;
					}

					inputField.value = "Generating AI description...";

					const requestBody = {
						job_title: titleSpan.innerHTML,
						job_field: fieldSpan.innerHTML,
						skill1: skill1.innerHTML,
						skill2: skill2.innerHTML,
						skill3: skill3.innerHTML,
						skill4: skill4.innerHTML,
						skill5: skill5.innerHTML,
						pay: paySpan.innerHTML,
						loc: locationSpan.innerHTML,
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
							console.log(data.description);
							inputField.value = data.description;
						} else {
							alert('Failed to generate job description.');
						}
					} catch (error) {
						console.error('Error:', error);
						alert('An error occurred while generating the job description.');
					}
				});

				addAIButton.appendChild(newButton);
			}

			editDescription.textContent = "Save Description";

		} else {
			// Save the edited text
			const inputField = descriptionSpan.querySelector("textarea");
			if (inputField) {
				const updatedText = inputField.value;

				descriptionSpan.innerHTML = updatedText;

				const existingButton = document.querySelector("#genAI button");
				if (existingButton) {
					existingButton.remove();
				}
				newButton.remove();
				// Change button text back to "Edit"
				editDescription.textContent = "Edit Description";
				fetch(`${CONFIG.SERVER_BASE_URL}/employer/changeJobDescription?eid=${eid}&lid=${lid}&newDescription=${updatedText}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
					}
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						return response.json();
					})
					.then((data) => {
						showSuccessMessage(descriptionSpan);
					})
					.catch((error) => {
						console.error(`Error updating listing for ${descriptionSpan}:`, error);
						alert("An error occurred while updating the listing.");
					});

			}
		}
	});


	// Handle skill button clicks
	skillContainer.addEventListener("click", function (e) {
		if (e.target.classList.contains("skill-info")) {
			const skillButton = e.target;

			const existingInput = document.querySelector(".skills-container input");
			if (existingInput && existingInput !== skillButton.querySelector("input")) {
				alert("Please save or close the current editing field before editing another skill.");
				return;
			}

			if (skillButton.querySelector("input")) return;

			const currentText = skillButton.textContent;
			const inputField = document.createElement("input");
			const buttonWidth = skillButton.offsetWidth;

			inputField.type = "text";
			inputField.value = currentText;
			inputField.classList.add("form-control", "skill-info");
			inputField.style.width = `${buttonWidth}px`;
			inputField.style.display = "inline-block";

			skillButton.textContent = "";
			skillButton.appendChild(inputField);

			let saveButton = editSkillContainer.querySelector("btn-edit");
			if (!saveButton) {
				saveButton = document.createElement("button");
				saveButton.textContent = "Save Skill";
				saveButton.classList.add("btn", "btn-edit");
				editSkillContainer.appendChild(saveButton);

				saveButton.addEventListener("click", function () {

					const allSkills = [];
					document.querySelectorAll(".skill-info").forEach((button) => {
						const skillName = button.querySelector("input")
							? button.querySelector("input").value.trim()
							: button.textContent.trim();

						if (skillName) {
							allSkills.push({ name: skillName }); 
						}
					});


					if (!allSkills.length || !allSkills.find(skill => skill.name === inputField.value.trim())) {
						alert("Skill name cannot be empty!");
						return;
					}

					skillButton.textContent = inputField.value.trim();
					inputField.remove();

					fetch(`${CONFIG.SERVER_BASE_URL}/employer/changeSkillRequirements?eid=${eid}&lid=${lid}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Basic ${btoa(CONFIG.API_KEY + ":")}`,
						},
						body: JSON.stringify({ skills: allSkills }), // Pass all skills as JSON
					})
						.then((response) => {
							if (!response.ok) {
								throw new Error("Network response was not ok");
							}
							return response.json();
						})
						.then((data) => {
							showSuccessMessage(skillButton);
							saveButton.remove();
						})
						.catch((error) => {
							console.error("Error updating skills:", error);
							alert("An error occurred while updating the skills.");
						});

				});
			}
			inputField.focus();
		}
	});

	allCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", function () {
			const isChecked = checkbox.checked;
			const checkboxId = checkbox.id;

			const route = routeMap[checkboxId];
			if (!route) {
				console.error(`No route defined for checkbox: ${checkboxId}`);
				return;
			}

			fetch(route, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Basic ${btoa(CONFIG.API_KEY + ':')}`,
				}
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					showSuccessMessage(checkbox);
				})
				.catch((error) => {
					console.error(`Error updating listing for ${checkboxId}:`, error);
					alert("An error occurred while updating the listing.");
				});
		});
	});


	function showSuccessMessage(targetElement) {
		const message = document.createElement("span");
		message.textContent = "Listing Updated";
		message.classList.add("success-message", "barcode");

		// Position the message near the target element
		const rect = targetElement.getBoundingClientRect();
		message.style.position = "absolute";
		message.style.top = `${rect.top + window.scrollY - 25}px`;
		message.style.left = `${rect.left + window.scrollX}px`;
		message.style.backgroundColor = "#dff0d8";
		message.style.color = "#000000";
		message.style.padding = "5px 10px";
		message.style.borderRadius = "5px";
		message.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";
		message.style.fontSize = "45px";
		message.style.transition = "opacity 0.5s ease";

		document.body.appendChild(message);

		setTimeout(() => {
			message.style.opacity = "0";
			setTimeout(() => message.remove(), 500); 
		}, 2000); 
	}

	function populateFields(data) {

		const stripQuotes = (value) =>
			typeof value === "string" ? value.replace(/^"|"$/g, "") : value;

		const checkboxMap = {
			gender: data.gender,
			modern: data.modern,
			diverse: data.diversity,
			flex: data.flex,
			remote: data.remote
		};

		const spanMap = {
			companySpan: data.company,
			fieldSpan: data.field,
			descriptionSpan: data.description,
			locationSpan: data.location,
			paySpan: data.pay,
			titleSpan: data.title,
			skill1: data.s1,
			skill2: data.s2,
			skill3: data.s3,
			skill4: data.s4,
			skill5: data.s5
		};

		Object.keys(checkboxMap).forEach((id) => {
			const checkbox = document.getElementById(id);
			const value = stripQuotes(checkboxMap[id]); 

			if (value === true || value === "true") {
				checkbox.checked = true;
			} else {
				checkbox.checked = false; 
			}
		});

		Object.keys(spanMap).forEach((id) => {
			const span = document.getElementById(id);
			if (span) {
				span.textContent = stripQuotes(spanMap[id]);
				const value = stripQuotes(spanMap[id]); 
			}
		});
	}



});