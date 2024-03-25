const API_Endpoint = 'http://52.0.92.65:3000/'; // Replace 'your-server-url' with the actual server URL

let countries = []

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        const countrySelect = document.getElementById('countrySelect');
        const flagImg = document.getElementById('flag');

        // Sort countries alphabetically by name
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        countries = data;

        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2.toLowerCase();
            option.textContent = `${country.name.common}`;
            countrySelect.appendChild(option);
        });

        // Add event listener to country select dropdown
        countrySelect.addEventListener('change', function () {
            // Get the selected option
            const selectedOption = countrySelect.options[countrySelect.selectedIndex];

            console.log(selectedOption);
            // Get the value of the selected option
            const countryCode = selectedOption.value;
            // Set the flag image source based on the selected country code
            flagImg.src = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
            // Set the alt attribute of the flag image to the name of the selected country
            flagImg.alt = selectedOption.textContent;
        });
    })
    .catch(error => console.error('Error fetching countries data:', error));


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

    // Send the request with the form data
    xhr.send(jsonDataString);
}
