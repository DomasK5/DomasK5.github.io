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

    window.addEventListener('load', function() {
        initializeRangeSliders();
        handleFormSubmission();
    });

})();