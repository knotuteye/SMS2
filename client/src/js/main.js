const API_Endpoint = 'http://52.0.92.65:3000/'; // Replace 'your-server-url' with the actual server URL

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        const countrySelect = document.getElementById('countrySelect');
        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.alpha3Code;
            option.textContent = `${country.flags.svg} ${country.name.common}`;
            countrySelect.appendChild(option);
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
