const API_Endpoint = 'http://52.0.92.65:3000/'; // Replace 'your-server-url' with the actual server URL

let countries = []

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        const countrySelect = document.getElementById('countrySelect');
        const flagImg = document.getElementById('flag');

        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2.toLowerCase();
            option.textContent = `${country.name.common}`;
            countrySelect.appendChild(option);
        });

        countrySelect.addEventListener('change', function () {
            const selectedOption = countrySelect.options[countrySelect.selectedIndex];
            const countryCode = selectedOption.value;
            flagImg.src = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
            flagImg.alt = selectedOption.textContent;
        });
    })
    .catch(error => console.error('Error fetching countries data:', error));

const phoneInput = document.querySelector('input[name="phoneNumber"]');

// Add event listener to phone number input
phoneInput.addEventListener('input', function (event) {
    const inputValue = event.target.value;
    // Remove any characters that are not numbers, plus symbol (+), or brackets
    const filteredValue = inputValue.replace(/[^0-9+()]/g, '');
    // Update the input field value with the filtered value
    event.target.value = filteredValue;
});

const registrationForm = document.getElementById('registrationForm');
const firstNameInput = document.querySelector('input[name="firstName"]');
const lastNameInput = document.querySelector('input[name="lastName"]');
const phoneNumberInput = document.querySelector('input[name="phoneNumber"]');
const emailInput = document.querySelector('input[name="email"]');
const registerButton = document.querySelector('input[type="submit"]');

// Function to check if all required fields are filled
function areAllFieldsFilled() {
    return firstNameInput.value.trim() !== '' &&
        lastNameInput.value.trim() !== '' &&
        phoneNumberInput.value.trim() !== '' &&
        emailInput.value.trim() !== '';
}

// Function to enable or disable the register button based on whether all fields are filled
function updateRegisterButtonState() {
    registerButton.disabled = !areAllFieldsFilled();
}

// Add event listener to each input field to reevaluate the register button's state after every input
[firstNameInput, lastNameInput, phoneNumberInput, emailInput].forEach(function (input) {
    input.addEventListener('input', updateRegisterButtonState);
});

// Disable the register button initially
updateRegisterButtonState();

// Find the "Download Template" button
const downloadTemplateButton = document.querySelector('.button[value="Download Template"]');

// Add event listener to the "Download Template" button
downloadTemplateButton.addEventListener('click', () => {
    // Make a GET request to the server route for downloading the file
    fetch('/registration/bulk')
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to download template');
            }
            // Initiate the download by creating a blob from the response and triggering a download
            return response.blob();
        })
        .then(blob => {
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            // Create an anchor element to trigger the download
            const a = document.createElement('a');
            // Set the href attribute to the blob URL
            a.href = url;
            // Set the download attribute to specify the filename
            a.download = 'template.xlsx'; // Change the filename as per your requirement
            // Append the anchor element to the document body
            document.body.appendChild(a);
            // Trigger the click event on the anchor element
            a.click();
            // Revoke the URL to release resources
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading template:', error);
            // Handle errors here, such as displaying an error message to the user
        });
});


function submitForm() {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the form element by its ID
    const form = document.getElementById('registrationForm');

    // Get the form data
    const formData = new FormData(form);

    // Create an XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Define the request parameters
    const method = 'POST';

    const url = API_Endpoint + 'registration/';

    // Configure the request
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Define the callback function to handle the response
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Request was successful
            console.log('Form submitted successfully');
            // You can handle the response from the server here
        } else {
            // Request failed
            console.error('Form submission failed');
        }
    };

    // Convert formData to JSON
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Convert JSON data to a string
    const jsonDataString = JSON.stringify(jsonData);

    console.log("jsonData", jsonData);

    // Send the request with the form data
    xhr.send(jsonDataString);
}
