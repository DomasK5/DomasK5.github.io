(function() {
    "use strict";
    function initializeRangeSliders() {
        const rangeInputs = document.querySelectorAll('input[type="range"].form-range');

        rangeInputs.forEach(input => {
            const output = input.nextElementSibling;

            if (output && output.tagName === 'OUTPUT') {
                output.value = input.value;
            }
            input.addEventListener('input', (event) => {
                if (output && output.tagName === 'OUTPUT') {
                    output.value = event.target.value;
                }
            });
        });
    }
    function handleFormSubmission() {
        const form = document.querySelector('.php-email-form');
        const contactSection = document.getElementById('contact');

        if (!form || !contactSection) {
            console.error("Contact form or section not found.");
            return;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            let outputContainer = document.getElementById('form-output-container');
            if (!outputContainer) {
                outputContainer = document.createElement('div');
                outputContainer.id = 'form-output-container';
                outputContainer.classList.add('mt-5', 'p-4', 'bg-dark', 'rounded-3', 'shadow-sm');
                outputContainer.style.borderLeft = '5px solid #DA70D6';
                
                contactSection.querySelector('.container').appendChild(outputContainer);
            }

            outputContainer.innerHTML = '<h4 class="mb-3">Submitted Data</h4>';
            outputContainer.style.display = 'block'; 

            setTimeout(() => {
                
                const formData = new FormData(form);
                const dataObject = {};
                let formattedOutput = '';

                formData.forEach((value, key) => {
                    let displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    
                    if (key.startsWith('q')) {
                         displayKey = `Question ${key.substring(1)} Rating (1-10)`;
                    } else if (key === 'projectMessage' || key === 'message') {
                        displayKey = 'Message Content';
                    }

                    dataObject[key] = value;
                
                    formattedOutput += `<p class="mb-1"><strong>${displayKey}:</strong> ${value}</p>`;
                });

                console.log("--- Form Data Captured ---");
                console.log(dataObject);
                console.log("--------------------------");

                const resultsDiv = document.createElement('div');
                resultsDiv.innerHTML = formattedOutput;
                outputContainer.appendChild(resultsDiv);
                const sentMessage = form.querySelector('.sent-message');
                if (sentMessage) sentMessage.style.display = 'block';

                const averageScore = calculateSliderAverage();
                resultsDiv.innerHTML += `<p class="mt-3">${dataObject['firstName']} ${dataObject.lastName}: ${averageScore.toFixed(2)}</p>`;

                setTimeout(() => {
                    if (sentMessage) sentMessage.style.display = 'none';
                    form.reset();
                    initializeRangeSliders();
                }, 5000);

            }, 1000); 
        });
    }

    function calculateSliderAverage() {
        const rangeInputs = document.querySelectorAll('input[type="range"].form-range');
        let total= 0;
        rangeInputs.forEach( input => {
            total += input.valueAsNumber;
        });
        total = total / rangeInputs.length;
        return total;
    }

    function showError(element, message) {
        clearError(element);
        const parent = element.closest('.form-group') || element.parentNode;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.innerText = message;
        parent.appendChild(errorDiv);
        element.classList.add('border-danger');
    }

    function clearError(element) {
        const parent = element.closest('.form-group') || element.parentNode;
        const existingError = parent.querySelector('.form-error-message');
        if(existingError) {
            existingError.remove();
        }
        element.classList.remove('border-danger');
    }

    function isRequired(value) {
        return value.trim() !== '';
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function isValidName(name) {
        const namePattern = /^[a-zA-Z\s'-]+$/;
        return namePattern.test(name);
    }

    function isValidAddress(address) {
        const addressPattern = /^[a-zA-Z0-9\s,'-]*$/;
        return addressPattern.test(address);
    }

    function isValidPhone(phone) {
        const phonePattern = /^\+370\s\d{3}\s\d{5}$/;
        return phonePattern.test(phone);
    }

    function validateField(inputElement) {
        let isValid = true;
        let errorMessage = '';
        const value = inputElement.value;
        const fieldName = inputElement.name;

        if(inputElement.hasAttribute('required') && !isRequired(value)) {
            errorMessage = 'This field is required';
            isValid = false;
        }

        else if(fieldName === 'email' && isRequired(value) && !isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }

        else if(fieldName === 'phone' && isRequired(value) && !isValidPhone(value)) {
            errorMessage = 'Phone number must be in the format +370 XXX XXXXX';
            isValid = false;
        }

        else if((fieldName === 'name' || fieldName === 'firstName' || fieldName === 'lastName') && isRequired(value) && !isValidName(value)) {
            errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
            isValid = false;
        }

        else if(fieldName === 'address' && isRequired(value) && !isValidAddress(value)) {
            errorMessage = 'Address contains invalid characters';
            isValid = false;
        }

        if(isValid) {
            clearError(inputElement);
        }
        else {
            showError(inputElement, errorMessage);
        }
        const form = inputElement.closest('.php-email-form');
        if (form) {
            toggleSubmitButton(form);
        }
    }

    function formatLithuanianPhone(name) {
        const input = event.target;
        let value = input.value.replace(/[^0-9]/g, '');
        const prefix = '+370 ';
        let cursorPosition = input.selectionStart;

        if(value.startsWith('370')) {
            value = value.substring(3);
        }
        else if(value.startsWith('8')) {
            value = value.substring(1);
        }
        let formattedValue = prefix + (value.length > 0 ? '' : '');
        if(value.length > 0) {
            formattedValue += value.substring(0, 3);
        }
        if(value.length > 3) {
            formattedValue += ' ' + value.substring(3, 8);
        }
        if(formattedValue.length > 15) {
            formattedValue = formattedValue.substring(0, 13);
        }
        input.value = formattedValue;
    }

    function toggleSubmitButton(form) {
        const submitButton = form.querySelector('.submit-btn');
        let isValid = true;
        const error = form.querySelector('.php-email-form .form-error-message');
        console.log(error);
        if(error){
            isValid = false;
        }
        const allFields = form.querySelectorAll('input:not([type="range"]):not([type="submit"]), textarea');
        allFields.forEach(input => {
            if(!isRequired(input.value)){
                isValid = false;
            }
        });
        submitButton.disabled = !isValid;
    }

    function validateForm() {
        const form = document.querySelector('.php-email-form');
        if(!form) return;
        const inputFields = form.querySelectorAll('input:not([type="range"]):not([type="submit"]), textarea');
        inputFields.forEach(input => {
            const fieldName = input.name;
            if(fieldName === 'phone') {
                input.addEventListener('input', formatLithuanianPhone);
            }
            input.addEventListener('input', (event) => validateField(event.target));
            input.addEventListener('blur', (event) => validateField(event.target));
        });
    }

    window.addEventListener('load', function() {
        initializeRangeSliders();
        validateForm();
        handleFormSubmission();
    });

})();