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

    function formatLithuanianPhone(e) {
        const input = e.target;
        let value = input.value.replace(/[^0-9]/g, '');
        const prefix = '+370 ';

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

    const cardData = [
        { name: 'python', icon: 'bi-filetype-py', color: '#306998' },
        { name: 'javascript', icon: 'bi-filetype-js', color: '#F7DF1E' },
        { name: 'csharp', icon: 'bi-filetype-cs', color: '#178600' },
        { name: 'html', icon: 'bi-filetype-html', color: '#E34F26' },
        { name: 'css', icon: 'bi-filetype-css', color: '#1572B6' },
        { name: 'react', icon: 'bi-lightbulb', color: '#61DAFB' },
        { name: 'git', icon: 'bi-git', color: '#F05032' },
        { name: 'node', icon: 'bi-box-seam', color: '#339933' },
        { name: 'database', icon: 'bi-database', color: '#FFD43B' },
        { name: 'matlab', icon: 'bi-grid-3x3-gap', color: '#0076A8' },
        { name: 'ai', icon: 'bi-cpu', color: '#FF00FF' }, 
        { name: 'ml', icon: 'bi-robot', color: '#DA70D6' }
    ];

    let gameBoard = [];
    let flippedCards = [];
    let matchesFound = 0;
    let lockBoard = false;
    let flipCount = 0;
    let totalPairs = 0;
    let currentDifficulty = 'easy'; 
    let gameActive = false;
    let timerInterval = null;
    let seconds = 0;
    let isNewBestScore = false;

    function getBestScores() {
        const easy = localStorage.getItem('memoryGameBestEasy');
        const hard = localStorage.getItem('memoryGameBestHard');
        return {
            easy: easy ? parseInt(easy) : null,
            hard: hard ? parseInt(hard) : null
        };
    }

    function setBestScore(difficulty, flips) {
        const key = `memoryGameBest${difficulty === 'easy' ? 'Easy' : 'Hard'}`;
        const currentBest = getBestScores()[difficulty];

        if(currentBest === null || flips < currentBest) {
            localStorage.setItem(key, flips);
            updateBestScoresDisplay();
            return true;
        }
        return false;
    }

    function updateBestScoresDisplay() {
        const scores = getBestScores();
        const easyScore = scores.easy !== null ? scores.easy : '--';
        const hardScore = scores.hard !== null ? scores.hard : '--';
        const bestScoresBlock = document.getElementById('best-scores-block');
        if(!bestScoresBlock) return;

        bestScoresBlock.innerHTML = `
            <h3 class="text-center" style="color: #FF00FF; margin-bottom: 1rem; font-size: 22px; padding-bottom: 10px; border-bottom: 1px dashed #DA70D6;"> BEST SCORES (Least Flips)</h3>
            <div class="d-flex justify-content-around p-3">
                <div class="stat-item">
                    <span>Easy (4x3):</span> 
                    <strong style="color: #DA70D6; font-size: 22px;" id="best-easy-flips">${easyScore}</strong> flips
                </div>
                <div class="stat-item">
                    <span>Hard (6x4):</span> 
                    <strong style="color: #FF00FF; font-size: 22px;" id="best-hard-flips">${hardScore}</strong> flips
                </div>
            </div>
        `;
    }

    function createShuffledBoard(difficulty) {
        const pairsCount = difficulty === 'easy' ? 6 : 12;
        totalPairs = pairsCount;
        const selectedCards = cardData.slice(0, pairsCount);

        const pairs = [...selectedCards, ...selectedCards];

        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }
        return pairs;
    }

    function updateStats() {
        document.getElementById('flip-count-display').textContent = flipCount;
        document.getElementById('pairs-found-count').textContent = matchesFound;
    }

    function startTimer() {
        if (timerInterval) return;
        
        timerInterval = setInterval(() => {
            seconds++;
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            document.getElementById('timer-display').textContent = `${min}:${sec}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        document.getElementById('timer-display').textContent = '00:00';
    }

    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.name = card.name;
        cardElement.classList.add('disabled-card');

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.innerHTML = `<i class="bi ${card.icon}"></i>`;
        frontFace.style.color = card.color;

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.innerHTML = `<i class="bi bi-code-slash"></i>`;

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);

        cardElement.addEventListener('click', flipCard);
        return cardElement;
    }

    function flipCard() {
        if (!gameActive || lockBoard || this === flippedCards[0] || this.classList.contains('matched')) return; 
        this.classList.add('flip');
        flippedCards.push(this);
        flipCount++;
        
        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
        updateStats();
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.name === card2.dataset.name;
        isMatch ? disableCards() : unflipCards();
    }

    function displayWinMessage(pairs, flips, timeInSeconds, isNewBest) {
        const gameContainer = document.querySelector('#game .container');
        if (!gameContainer) return;

        const existingMessage = document.getElementById('win-message-block');
        if (existingMessage) existingMessage.remove();

        const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, '0');
        const seconds = String(timeInSeconds % 60).padStart(2, '0');
        const timeString = `${minutes}:${seconds}`;

        let message;
        if (isNewBest) {
            message = ` NEW BEST SCORE!  You completed the game in only <strong>${flips} flips</strong>, beating the previous record.`;
        }
        else {
            message = `Review: You found all <strong>${pairs} pairs</strong> in <strong>${flips} flips</strong> over a total time of <strong style="color: #DA70D6;">${timeString}</strong>.`;
        }

        const winMessageBlock = document.createElement('div');
        winMessageBlock.id = 'win-message-block';
        winMessageBlock.classList.add('win-message', 'mt-4', 'p-4', 'text-center', 'animate__animated', 'animate__fadeInUp'); 

        winMessageBlock.innerHTML = `
            <h2 class="text-uppercase" style="color: #FF00FF; font-size: 2.5rem; margin-bottom: 1rem;">Congratulations!!!</h2>
            <p class="h4" style="color: #D8BFD8;">
                ${message}
            </p>
        `;

        gameContainer.appendChild(winMessageBlock);

        winMessageBlock.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    function disableCards() {
        const [card1, card2] = flippedCards;
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);

        matchesFound++;
        resetBoardState();

        if (matchesFound === totalPairs) {
            stopTimer();
            isNewBestScore = setBestScore(currentDifficulty, flipCount);
            setTimeout(() => {
                displayWinMessage(totalPairs, flipCount, seconds, isNewBestScore);
                gameActive = false;
                document.getElementById('start-btn').textContent = 'Start Game';
            }, 500);
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flip'));
            resetBoardState();
        }, 1000);
    }

    function resetBoardState() {
        [flippedCards, lockBoard] =[[], false];
    }

    function buildGameUI(gameSection) {
        let container = gameSection.querySelector('.container');
        if (container) {
            container.remove();
        }

        container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('data-aos', 'fade-up');
        container.setAttribute('data-aos-delay', '100');

        const controls = document.createElement('div');
        controls.classList.add('game-controls', 'd-flex', 'justify-content-center', 'align-items-center', 'mb-4', 'gap-3');
        controls.innerHTML = `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-difficulty ${currentDifficulty === 'easy' ? 'active' : ''}" data-difficulty="easy" id="easy-btn">Easy (4x3)</button>
                <button type="button" class="btn btn-difficulty ${currentDifficulty === 'hard' ? 'active' : ''}" data-difficulty="hard" id="hard-btn">Hard (6x4)</button>
            </div>
            <button id="start-btn" class="btn btn-start">Start Game <i class="bi bi-play-fill"></i></button>
            <button id="reset-btn" class="btn btn-reset"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
        `;
        container.appendChild(controls);

        const stats = document.createElement('div');
        stats.classList.add('game-stats', 'd-flex', 'justify-content-around', 'p-3', 'mb-4', 'mt-4');
        stats.innerHTML = `
            <div class="stat-item">
                <i class="bi bi-stopwatch-fill"></i>
                <span>Time:</span> <strong id="timer-display">00:00</strong>
            </div>
            <div class="stat-item">
                <i class="bi bi-arrow-repeat"></i>
                <span>Flips:</span> <strong id="flip-count-display">0</strong>
            </div>
            <div class="stat-item">
                <i class="bi bi-check-all"></i>
                <span>Pairs Found:</span> 
                <strong>
                    <span id="pairs-found-count">0</span> / <span id="pairs-found-total">${totalPairs}</span>
                </strong>
            </div>
        `;
        container.appendChild(stats);

        const gameGrid = document.createElement('div');
        gameGrid.classList.add('memory-game-grid');
        gameGrid.id = 'memory-game-grid';
        container.appendChild(gameGrid);

        const bestScoresBlock = document.createElement('div');
        bestScoresBlock.id = 'best-scores-block';
        bestScoresBlock.classList.add('game-stats', 'mt-4', 'mb-4');
        container.appendChild(bestScoresBlock);
        
        gameSection.appendChild(container);

        document.getElementById('easy-btn').addEventListener('click', () => setDifficulty('easy'));
        document.getElementById('hard-btn').addEventListener('click', () => setDifficulty('hard'));
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('reset-btn').addEventListener('click', resetGame);

        updateBestScoresDisplay();
    }

    function setDifficulty(difficulty) {
        if (currentDifficulty !== difficulty) {
            currentDifficulty = difficulty;
            document.querySelectorAll('.btn-difficulty').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${difficulty}-btn`).classList.add('active');
            initializeGame();
        }
    }

    function startGame() {
        const startBtn = document.getElementById('start-btn');
        if (gameActive || startBtn.disabled) return;
        document.querySelectorAll('.memory-card').forEach(card => card.classList.remove('disabled-card'));
        gameActive = true;
        startTimer();
        startBtn.textContent = 'Game Running...';
        startBtn.disabled = true;
    }

    function resetGame() {
        resetTimer();
        stopTimer();
        document.querySelectorAll('.memory-card').forEach(card => {
            card.classList.remove('flip', 'matched');
            card.removeEventListener('click', flipCard);
        });
        const startBtn = document.getElementById('start-btn');
        if(startBtn) {
            startBtn.disabled = false;
        }

        initializeGame();
    }

    function initializeGame() {
        const gameSection = document.getElementById('game');
        if (!gameSection) {
            console.error("Game section not found");
            return;
        }

        const existingMessage = document.getElementById('win-message-block');
        if(existingMessage) existingMessage.remove();
        
        matchesFound = 0;
        flipCount = 0;
        gameActive = false;
        isNewBestScore = false;
        buildGameUI(gameSection); 
        resetTimer();
        resetBoardState();

        const gameGrid = document.getElementById('memory-game-grid');
        gameGrid.innerHTML = '';
        
        gameGrid.style.gridTemplateColumns = currentDifficulty === 'easy' 
            ? 'repeat(4, 1fr)' 
            : 'repeat(6, 1fr)';

        gameBoard = createShuffledBoard(currentDifficulty);
        gameBoard.forEach(card => {
            gameGrid.appendChild(createCardElement(card));
        });
        
        document.getElementById('flip-count-display').textContent = '0';
        document.getElementById('pairs-found-count').textContent = '0';
        document.getElementById('pairs-found-total').textContent = totalPairs;
        document.getElementById('start-btn').textContent = 'Start Game';

        updateBestScoresDisplay();
    }

    window.addEventListener('load', function() {
        initializeRangeSliders();
        validateForm();
        handleFormSubmission();
        initializeGame();
    });

})();